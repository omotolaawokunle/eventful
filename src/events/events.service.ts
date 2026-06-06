import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(dto: CreateEventDto, creatorId: string) {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        venue: dto.venue,
        city: dto.city,
        category: dto.category || 'OTHER',
        totalTickets: dto.totalTickets,
        availableTickets: dto.totalTickets,
        price: dto.price,
        reminderDays: dto.reminderDays,
        bannerUrl: dto.bannerUrl,
        creatorId,
      },
    });

    await this.redis.delPattern('events:*');
    return event;
  }

  async findAll(query: QueryEventDto) {
    const cacheKey = `events:list:${JSON.stringify(query)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: any = { isPublished: true };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { venue: { contains: query.search } },
        { city: { contains: query.search } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.city) where.city = { contains: query.city };

    const skip = ((query.page || 1) - 1) * (query.limit || 20);

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: query.limit || 20,
        orderBy: { date: 'asc' },
        include: {
          creator: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { tickets: true } },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    const result = { events, total, page: query.page || 1, limit: query.limit || 20 };
    await this.redis.set(cacheKey, result, 120);
    return result;
  }

  async findMyEvents(userId: string) {
    const cacheKey = `events:mine:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const events = await this.prisma.event.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tickets: true } } },
    });

    await this.redis.set(cacheKey, events, 120);
    return events;
  }

  async findOne(id: string) {
    const cacheKey = `events:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { tickets: true } },
      },
    });

    if (!event) throw new NotFoundException('Event not found');
    await this.redis.set(cacheKey, event, 300);
    return event;
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.creatorId !== userId) throw new ForbiddenException('Not your event');

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });

    await this.redis.del(`events:${id}`);
    await this.redis.del(`events:mine:${userId}`);
    return updated;
  }

  async publish(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.creatorId !== userId) throw new ForbiddenException('Not your event');

    const updated = await this.prisma.event.update({
      where: { id },
      data: { isPublished: true },
    });

    await this.redis.del(`events:${id}`);
    await this.redis.delPattern('events:*');
    return updated;
  }
}
