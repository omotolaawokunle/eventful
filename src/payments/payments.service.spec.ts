import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QrcodeService } from '../qrcode/qrcode.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPrisma = {
    user: { findUnique: jest.fn() },
    event: { findUnique: jest.fn(), update: jest.fn() },
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    ticket: { create: jest.fn(), findUnique: jest.fn(), count: jest.fn() },
    $transaction: jest.fn(),
  };

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
  };

  const mockQrcodeService = {
    generateQRCodeData: jest.fn().mockResolvedValue('qr-data'),
    generateQRCodeImage: jest.fn().mockResolvedValue('data:image/png;base64,...'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: QrcodeService, useValue: mockQrcodeService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentHistory', () => {
    it('should throw if event not found', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);
      await expect(service.getPaymentHistory('event-1', 'user-1')).rejects.toThrow();
    });

    it('should throw if user is not the creator', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: 'event-1', creatorId: 'other-user' });
      await expect(service.getPaymentHistory('event-1', 'user-1')).rejects.toThrow();
    });
  });
});
