import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getCreatorAnalytics(userId: string) {
    const cacheKey = `analytics:creator:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [totalEvents, totalTicketsSold, totalRevenue, recentPayments] = await Promise.all([
      this.prisma.event.count({ where: { creatorId: userId } }),
      this.prisma.ticket.count({
        where: { event: { creatorId: userId }, status: { not: 'CANCELLED' } },
      }),
      this.prisma.payment.aggregate({
        where: { event: { creatorId: userId }, status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.payment.findMany({
        where: { event: { creatorId: userId }, status: 'SUCCESS' },
        include: {
          event: { select: { title: true } },
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const result = {
      totalEvents,
      totalTicketsSold,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentPayments,
    };

    await this.redis.set(cacheKey, result, 600);
    return result;
  }

  async getEventAnalytics(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.creatorId !== userId) {
      throw new Error('Event not found or not authorized');
    }

    const cacheKey = `analytics:event:${eventId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const [ticketsSold, ticketsScanned, totalRevenue, attendees] = await Promise.all([
      this.prisma.ticket.count({
        where: { eventId, status: { not: 'CANCELLED' } },
      }),
      this.prisma.ticket.count({
        where: { eventId, status: 'USED' },
      }),
      this.prisma.payment.aggregate({
        where: { eventId, status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.ticket.findMany({
        where: { eventId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const result = {
      eventId,
      eventTitle: event.title,
      totalTickets: event.totalTickets,
      availableTickets: event.availableTickets,
      ticketsSold,
      ticketsScanned,
      scanRate: ticketsSold > 0 ? ((ticketsScanned / ticketsSold) * 100).toFixed(2) : '0',
      totalRevenue: totalRevenue._sum.amount || 0,
      attendees,
    };

    await this.redis.set(cacheKey, result, 600);
    return result;
  }

  async getSalesAnalytics(userId: string) {
    const cacheKey = `analytics:sales:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const events = await this.prisma.event.findMany({
      where: { creatorId: userId },
      include: {
        _count: { select: { tickets: true } },
      },
    });

    const analytics = await Promise.all(
      events.map(async (event) => {
        const [revenue, scanned] = await Promise.all([
          this.prisma.payment.aggregate({
            where: { eventId: event.id, status: 'SUCCESS' },
            _sum: { amount: true },
          }),
          this.prisma.ticket.count({
            where: { eventId: event.id, status: 'USED' },
          }),
        ]);

        return {
          eventId: event.id,
          title: event.title,
          totalTickets: event.totalTickets,
          ticketsSold: event._count.tickets,
          ticketsScanned: scanned,
          revenue: revenue._sum.amount || 0,
        };
      }),
    );

    await this.redis.set(cacheKey, analytics, 600);
    return analytics;
  }
}
