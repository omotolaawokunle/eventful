import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async createReminder(dto: CreateReminderDto, userId: string) {
    let remindAt: Date;

    if (dto.remindAt) {
      remindAt = new Date(dto.remindAt);
    } else if (dto.daysBefore) {
      const event = await this.prisma.event.findUnique({ where: { id: dto.eventId } });
      if (!event) throw new Error('Event not found');
      remindAt = new Date(event.date);
      remindAt.setDate(remindAt.getDate() - dto.daysBefore);
    } else {
      throw new Error('Either remindAt or daysBefore is required');
    }

    return this.prisma.reminder.create({
      data: {
        remindAt,
        eventId: dto.eventId,
        userId,
        type: dto.daysBefore ? `${dto.daysBefore}_DAYS_BEFORE` : 'CUSTOM',
      },
    });
  }

  async findMyReminders(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userId },
      include: { event: { select: { id: true, title: true, date: true } } },
      orderBy: { remindAt: 'asc' },
    });
  }

  async deleteReminder(id: string, userId: string) {
    return this.prisma.reminder.deleteMany({ where: { id, userId } });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processReminders() {
    const now = new Date();

    const reminders = await this.prisma.reminder.findMany({
      where: {
        remindAt: { lte: now },
        isSent: false,
      },
      include: {
        event: { select: { title: true, date: true, venue: true } },
        user: { select: { email: true, firstName: true } },
      },
    });

    for (const reminder of reminders) {
      try {
        await this.sendReminderEmail(reminder.user.email, {
          name: reminder.user.firstName,
          eventTitle: reminder.event.title,
          eventDate: reminder.event.date.toLocaleDateString(),
          venue: reminder.event.venue,
        });

        await this.prisma.reminder.update({
          where: { id: reminder.id },
          data: { isSent: true },
        });

        this.logger.log(`Reminder sent to ${reminder.user.email} for ${reminder.event.title}`);
      } catch (error) {
        this.logger.error(`Failed to send reminder to ${reminder.user.email}`, error);
      }
    }
  }

  private async sendReminderEmail(
    to: string,
    data: { name: string; eventTitle: string; eventDate: string; venue: string },
  ) {
    try {
      await this.transporter.sendMail({
        from: `"Eventful" <${process.env.SMTP_USER}>`,
        to,
        subject: `Reminder: ${data.eventTitle} is coming up!`,
        html: `
          <h2>Hey ${data.name}!</h2>
          <p>This is a friendly reminder that <strong>${data.eventTitle}</strong> is coming up!</p>
          <ul>
            <li><strong>Date:</strong> ${data.eventDate}</li>
            <li><strong>Venue:</strong> ${data.venue}</li>
          </ul>
          <p>Don't miss it! See you there!</p>
          <p>- Eventful Team</p>
        `,
      });
    } catch {
      this.logger.warn('Email transport not configured, skipping reminder email');
    }
  }
}
