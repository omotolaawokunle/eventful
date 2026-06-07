import axios from 'axios';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QrcodeService } from '../qrcode/qrcode.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { AppError } from '../middleware/error.middleware';

export class PaymentsService {
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private qrcodeService: QrcodeService,
  ) {}

  private get paystackHeaders() {
    return {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async initializePayment(dto: InitializePaymentDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: dto.eventId } });
    if (!event) throw new AppError(404, 'Event not found');
    if (!event.isPublished) throw new AppError(400, 'Event is not published');
    if (event.availableTickets < dto.quantity) {
      throw new AppError(400, 'Not enough tickets available');
    }

    const totalAmount = Math.round(event.price * dto.quantity * 100);
    const reference = `EVT-${Date.now()}-${userId.slice(0, 8)}`;

    const payment = await this.prisma.payment.create({
      data: {
        amount: event.price * dto.quantity,
        reference,
        status: 'PENDING',
        eventId: event.id,
        userId,
        metadata: JSON.stringify({ quantity: dto.quantity, unitPrice: event.price }),
      },
    });

    try {
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          email: (await this.prisma.user.findUnique({ where: { id: userId } }))?.email,
          amount: totalAmount,
          reference,
          callback_url: `${process.env.APP_URL}/api/payments/verify/${reference}`,
          metadata: {
            eventId: event.id,
            userId,
            paymentId: payment.id,
            quantity: dto.quantity,
          },
        },
        { headers: this.paystackHeaders },
      );

      return {
        paymentUrl: response.data.data.authorization_url,
        reference,
        accessCode: response.data.data.access_code,
      };
    } catch {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      throw new AppError(400, 'Payment initialization failed');
    }
  }

  async verifyPayment(reference: string) {
    const payment = await this.prisma.payment.findUnique({ where: { reference } });
    if (!payment) throw new AppError(404, 'Payment not found');

    try {
      const response = await axios.get(`${this.paystackBaseUrl}/transaction/verify/${reference}`, {
        headers: this.paystackHeaders,
      });

      const { status, metadata } = response.data.data;

      if (status === 'success') {
        const quantity = metadata?.quantity || 1;
        const tickets: any[] = [];

        await this.prisma.$transaction(async (tx) => {
          const event = await tx.event.findUnique({ where: { id: payment.eventId } });
          if (!event || event.availableTickets < quantity) {
            throw new AppError(400, 'Not enough tickets');
          }

          await tx.event.update({
            where: { id: payment.eventId },
            data: { availableTickets: { decrement: quantity } },
          });

          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESS',
              paystackRef: reference,
            },
          });

          for (let i = 0; i < quantity; i++) {
            const qrData = await this.qrcodeService.generateQRCodeData(
              payment.eventId,
              payment.userId,
            );
            const qrImage = await this.qrcodeService.generateQRCodeImage(qrData);

            const ticket = await tx.ticket.create({
              data: {
                qrCodeData: qrData,
                qrCodeImage: qrImage,
                eventId: payment.eventId,
                userId: payment.userId,
                paymentId: payment.id,
              },
            });
            tickets.push(ticket);
          }
        });

        await this.redis.del(`events:${payment.eventId}`);
        await this.redis.delPattern('events:*');

        return { status: 'success', tickets };
      }

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      return { status: 'failed', message: 'Payment was not successful' };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(400, 'Payment verification failed');
    }
  }

  async handleWebhook(payload: any) {
    const event = payload.event;
    if (event === 'charge.success') {
      const reference = payload.data.reference;
      return this.verifyPayment(reference);
    }
    return { received: true };
  }

  async getPaymentHistory(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError(404, 'Event not found');
    if (event.creatorId !== userId) throw new AppError(400, 'Not your event');

    const cacheKey = `payments:event:${eventId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const payments = await this.prisma.payment.findMany({
      where: { eventId, status: 'SUCCESS' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        ticket: { select: { id: true, status: true, scannedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.set(cacheKey, payments, 300);
    return payments;
  }

  async getAllPayments(userId: string) {
    const cacheKey = `payments:all:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const payments = await this.prisma.payment.findMany({
      where: {
        event: { creatorId: userId },
        status: 'SUCCESS',
      },
      include: {
        event: { select: { id: true, title: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.set(cacheKey, payments, 300);
    return payments;
  }
}
