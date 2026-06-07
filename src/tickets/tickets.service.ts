import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { AppError } from '../middleware/error.middleware';

export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findMyTickets(userId: string) {
    const cacheKey = `tickets:user:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const tickets = await this.prisma.ticket.findMany({
      where: { userId },
      include: {
        event: {
          select: { id: true, title: true, date: true, venue: true, city: true, bannerUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.set(cacheKey, tickets, 120);
    return tickets;
  }

  async verifyTicket(qrCodeData: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCodeData },
      include: {
        event: { select: { id: true, title: true, date: true, venue: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!ticket) throw new AppError(404, 'Invalid QR code - ticket not found');
    if (ticket.status === 'USED') throw new AppError(400, 'Ticket has already been used');
    if (ticket.status === 'CANCELLED') throw new AppError(400, 'Ticket has been cancelled');
    if (ticket.status === 'REFUNDED') throw new AppError(400, 'Ticket has been refunded');

    return ticket;
  }

  async scanTicket(qrCodeData: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCodeData },
      include: { event: true },
    });

    if (!ticket) throw new AppError(404, 'Invalid QR code - ticket not found');
    if (ticket.status === 'USED') throw new AppError(400, 'Ticket has already been used');
    if (ticket.status === 'CANCELLED') throw new AppError(400, 'Ticket has been cancelled');

    const updated = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'USED', scannedAt: new Date() },
    });

    await this.redis.del(`tickets:user:${ticket.userId}`);
    return updated;
  }

  async getEventAttendees(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError(404, 'Event not found');
    if (event.creatorId !== userId) throw new AppError(400, 'Not your event');

    const cacheKey = `tickets:event:${eventId}:attendees`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const tickets = await this.prisma.ticket.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.set(cacheKey, tickets, 300);
    return tickets;
  }
}
