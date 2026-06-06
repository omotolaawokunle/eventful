import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EVENTEE',
        password: 'hashed',
      });

      const result = await service.register({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.accessToken).toBe('test-token');
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw ConflictException for duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });

      await expect(
        service.register({
          email: 'test@test.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'EVENTEE',
      });

      const result = await service.login({ email: 'test@test.com', password: 'password123' });
      expect(result.accessToken).toBe('test-token');
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'wronghash',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EVENTEE',
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
