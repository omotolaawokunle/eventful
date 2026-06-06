import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Eventful (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'TestPass123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('/api/auth/register (POST) should register a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('/api/auth/register (POST) should reject duplicate email', async () => {
      await request(app.getHttpServer()).post('/api/auth/register').send(testUser).expect(409);
    });

    it('/api/auth/login (POST) should login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(201);

      expect(res.body.data.accessToken).toBeDefined();
    });

    it('/api/auth/login (POST) should reject wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrong' })
        .expect(401);
    });
  });

  describe('Events', () => {
    let authToken: string;
    let eventId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'TestPass123' });
      authToken = res.body.data.accessToken;
    });

    it('/api/events (POST) should create an event', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'E2E Test Event',
          description: 'Testing',
          date: '2025-12-25T18:00:00Z',
          venue: 'Test Venue',
          city: 'Lagos',
          totalTickets: 100,
          price: 5000,
        })
        .expect(201);

      eventId = res.body.data.id;
    });

    it('/api/events (GET) should list events', async () => {
      const res = await request(app.getHttpServer()).get('/api/events').expect(200);

      expect(Array.isArray(res.body.data.events)).toBe(true);
    });
  });

  describe('Health', () => {
    it('GET /health should return ok', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);
      expect(res.body).toBeDefined();
    });
  });
});
