import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('EventsService', () => {
  let service: EventsService;

  const mockPrisma = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const dto = {
        title: 'Test Event',
        description: 'A test event',
        date: '2025-12-25T18:00:00Z',
        venue: 'Test Venue',
        city: 'Lagos',
        totalTickets: 100,
        price: 5000,
      };

      mockPrisma.event.create.mockResolvedValue({ id: '1', ...dto, availableTickets: 100 });

      const result = await service.create(dto, 'user-1');
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Event');
      expect(mockRedis.delPattern).toHaveBeenCalledWith('events:*');
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const event = {
        id: '1',
        title: 'Test Event',
        creator: { id: '1', firstName: 'John', lastName: 'Doe' },
        _count: { tickets: 0 },
      };
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.event.findUnique.mockResolvedValue(event as any);

      const result = await service.findOne('1');
      expect((result as any).id).toBe('1');
    });

    it('should throw NotFoundException for non-existent event', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException if not the creator', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: '1', creatorId: 'other-user' });

      await expect(service.update('1', { title: 'Updated' }, 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
