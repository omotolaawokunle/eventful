import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import cron from 'node-cron';
import { PrismaService } from './database/prisma.service';
import { RedisService } from './redis/redis.service';
import { QrcodeService } from './qrcode/qrcode.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { EventsService } from './events/events.service';
import { TicketsService } from './tickets/tickets.service';
import { PaymentsService } from './payments/payments.service';
import { NotificationsService } from './notifications/notifications.service';
import { AnalyticsService } from './analytics/analytics.service';
import { ShareService } from './share/share.service';
import { createAuthRouter } from './routes/auth.routes';
import { createUsersRouter } from './routes/users.routes';
import { createEventsRouter } from './routes/events.routes';
import { createTicketsRouter } from './routes/tickets.routes';
import { createPaymentsRouter } from './routes/payments.routes';
import { createNotificationsRouter } from './routes/notifications.routes';
import { createAnalyticsRouter } from './routes/analytics.routes';
import { createShareRouter } from './routes/share.routes';
import { errorHandler } from './middleware/error.middleware';
import { transformResponse } from './middleware/response.middleware';

async function bootstrap() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Eventful API',
      version: '1.0.0',
      description: 'Eventful - Event Ticketing Platform API',
    },
    servers: [{ url: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['CREATOR', 'EVENTEE'] },
            phone: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time', nullable: true },
            venue: { type: 'string' },
            city: { type: 'string' },
            category: {
              type: 'string',
              enum: [
                'CONCERT',
                'THEATER',
                'SPORTS',
                'CULTURAL',
                'CONFERENCE',
                'FESTIVAL',
                'WORKSHOP',
                'OTHER',
              ],
            },
            bannerUrl: { type: 'string', nullable: true },
            totalTickets: { type: 'integer' },
            availableTickets: { type: 'integer' },
            price: { type: 'number' },
            isPublished: { type: 'boolean' },
            creatorId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            qrCodeData: { type: 'string' },
            qrCodeImage: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'USED', 'CANCELLED', 'REFUNDED'] },
            scannedAt: { type: 'string', format: 'date-time', nullable: true },
            eventId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            paymentId: { type: 'string', format: 'uuid' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'SUCCESS', 'FAILED'] },
            reference: { type: 'string' },
            eventId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Reminder: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            remindAt: { type: 'string', format: 'date-time' },
            isSent: { type: 'boolean' },
            type: { type: 'string' },
            eventId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['CREATOR', 'EVENTEE'] },
            phone: { type: 'string' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        CreateEventInput: {
          type: 'object',
          required: ['title', 'description', 'date', 'venue', 'city', 'totalTickets', 'price'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            venue: { type: 'string' },
            city: { type: 'string' },
            category: {
              type: 'string',
              enum: [
                'CONCERT',
                'THEATER',
                'SPORTS',
                'CULTURAL',
                'CONFERENCE',
                'FESTIVAL',
                'WORKSHOP',
                'OTHER',
              ],
            },
            totalTickets: { type: 'integer', minimum: 1 },
            price: { type: 'number', minimum: 0 },
            reminderDays: { type: 'integer' },
            bannerUrl: { type: 'string' },
          },
        },
        InitializePaymentInput: {
          type: 'object',
          required: ['eventId', 'quantity'],
          properties: {
            eventId: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer', minimum: 1 },
          },
        },
        CreateReminderInput: {
          type: 'object',
          required: ['eventId'],
          properties: {
            eventId: { type: 'string', format: 'uuid' },
            remindAt: { type: 'string', format: 'date-time' },
            daysBefore: { type: 'integer', minimum: 1 },
          },
        },
        UpdateUserInput: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            avatarUrl: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } },
            },
          },
          responses: {
            '201': {
              description: 'User registered',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            '409': {
              description: 'Email already registered',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/api/auth/profile': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User profile',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
            '401': {
              description: 'Unauthorized',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/api/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Current user',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update current user',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/UpdateUserInput' } },
            },
          },
          responses: {
            '200': {
              description: 'User updated',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
          },
        },
      },
      '/api/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            '200': {
              description: 'User found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
            '404': { description: 'User not found' },
          },
        },
      },
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'List published events',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            {
              name: 'category',
              in: 'query',
              schema: {
                type: 'string',
                enum: [
                  'CONCERT',
                  'THEATER',
                  'SPORTS',
                  'CULTURAL',
                  'CONFERENCE',
                  'FESTIVAL',
                  'WORKSHOP',
                  'OTHER',
                ],
              },
            },
            { name: 'city', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, default: 20 } },
          ],
          responses: {
            '200': {
              description: 'Paginated events list',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      events: { type: 'array', items: { $ref: '#/components/schemas/Event' } },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Events'],
          summary: 'Create an event',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CreateEventInput' } },
            },
          },
          responses: {
            '201': {
              description: 'Event created',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } },
            },
            '403': { description: 'Only creators can create events' },
          },
        },
      },
      '/api/events/mine': {
        get: {
          tags: ['Events'],
          summary: 'Get my events',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Creator events',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } },
                },
              },
            },
          },
        },
      },
      '/api/events/{id}': {
        get: {
          tags: ['Events'],
          summary: 'Get event by ID',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            '200': {
              description: 'Event found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } },
            },
            '404': { description: 'Event not found' },
          },
        },
        patch: {
          tags: ['Events'],
          summary: 'Update event',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CreateEventInput' } },
            },
          },
          responses: {
            '200': {
              description: 'Event updated',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } },
            },
          },
        },
      },
      '/api/events/{id}/publish': {
        patch: {
          tags: ['Events'],
          summary: 'Publish event',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            '200': {
              description: 'Event published',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } },
            },
          },
        },
      },
      '/api/tickets/mine': {
        get: {
          tags: ['Tickets'],
          summary: 'Get my tickets',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User tickets',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } },
                },
              },
            },
          },
        },
      },
      '/api/tickets/verify/{qrCodeData}': {
        get: {
          tags: ['Tickets'],
          summary: 'Verify ticket by QR code',
          parameters: [
            { name: 'qrCodeData', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': {
              description: 'Ticket verified',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
            },
            '400': { description: 'Ticket already used/cancelled' },
            '404': { description: 'Ticket not found' },
          },
        },
      },
      '/api/tickets/scan/{qrCodeData}': {
        post: {
          tags: ['Tickets'],
          summary: 'Scan ticket (mark as used)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'qrCodeData', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': {
              description: 'Ticket scanned',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } },
            },
          },
        },
      },
      '/api/tickets/event/{eventId}': {
        get: {
          tags: ['Tickets'],
          summary: 'Get event attendees',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '200': {
              description: 'Event attendees',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } },
                },
              },
            },
          },
        },
      },
      '/api/payments/initialize': {
        post: {
          tags: ['Payments'],
          summary: 'Initialize payment',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/InitializePaymentInput' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Payment initialized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      paymentUrl: { type: 'string' },
                      reference: { type: 'string' },
                      accessCode: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/payments/verify/{reference}': {
        get: {
          tags: ['Payments'],
          summary: 'Verify payment',
          parameters: [
            { name: 'reference', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Payment verification result' } },
        },
      },
      '/api/payments/webhook': {
        post: {
          tags: ['Payments'],
          summary: 'Paystack webhook',
          responses: { '200': { description: 'Webhook received' } },
        },
      },
      '/api/payments': {
        get: {
          tags: ['Payments'],
          summary: 'Get all payments for creator',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Payments list',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } },
                },
              },
            },
          },
        },
      },
      '/api/payments/event/{eventId}': {
        get: {
          tags: ['Payments'],
          summary: 'Get payment history for event',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '200': {
              description: 'Event payments',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Payment' } },
                },
              },
            },
          },
        },
      },
      '/api/notifications/reminders': {
        post: {
          tags: ['Notifications'],
          summary: 'Create reminder',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CreateReminderInput' } },
            },
          },
          responses: {
            '201': {
              description: 'Reminder created',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Reminder' } },
              },
            },
          },
        },
        get: {
          tags: ['Notifications'],
          summary: 'Get my reminders',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Reminders list',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Reminder' } },
                },
              },
            },
          },
        },
      },
      '/api/notifications/reminders/{id}': {
        delete: {
          tags: ['Notifications'],
          summary: 'Delete reminder',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: { '200': { description: 'Reminder deleted' } },
        },
      },
      '/api/analytics/overview': {
        get: {
          tags: ['Analytics'],
          summary: 'Get creator overview analytics',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Analytics overview' } },
        },
      },
      '/api/analytics/sales': {
        get: {
          tags: ['Analytics'],
          summary: 'Get sales analytics',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Sales analytics' } },
        },
      },
      '/api/analytics/event/{eventId}': {
        get: {
          tags: ['Analytics'],
          summary: 'Get event-specific analytics',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: { '200': { description: 'Event analytics' } },
        },
      },
      '/api/share/{eventId}': {
        get: {
          tags: ['Share'],
          summary: 'Get share links for event',
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '200': {
              description: 'Share links',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { url: { type: 'string' }, platforms: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: { '200': { description: 'Server is running' } },
        },
      },
    },
  };
  app.get('/api/docs/spec.json', (req, res) => res.json(swaggerSpec));
  const swaggerUi = require('swagger-ui-express');
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, { swaggerUrl: '/api/docs/spec.json' }),
  );
  console.log('Swagger docs loaded');

  app.use(transformResponse);

  const prisma = new PrismaService();
  const redis = new RedisService();
  const qrcode = new QrcodeService();
  const share = new ShareService();
  const auth = new AuthService(prisma, redis);
  const users = new UsersService(prisma, redis);
  const events = new EventsService(prisma, redis);
  const tickets = new TicketsService(prisma, redis);
  const payments = new PaymentsService(prisma, redis, qrcode);
  const notifications = new NotificationsService(prisma);
  const analytics = new AnalyticsService(prisma, redis);

  await prisma.onModuleInit();
  await redis.onModuleInit();

  app.use('/api/auth', createAuthRouter(auth, users));
  app.use('/api/users', createUsersRouter(users));
  app.use('/api/events', createEventsRouter(events));
  app.use('/api/tickets', createTicketsRouter(tickets));
  app.use('/api/payments', createPaymentsRouter(payments));
  app.use('/api/notifications', createNotificationsRouter(notifications));
  app.use('/api/analytics', createAnalyticsRouter(analytics));
  app.use('/api/share', createShareRouter(events, share));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const clientDir = path.resolve(process.cwd(), 'dist', 'client');
  app.use(express.static(clientDir, { index: false }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(clientDir, 'index.html'), (err: any) => {
      if (err) {
        res
          .status(200)
          .type('html')
          .send(
            '<h1>Eventful API</h1><p>Frontend not available. Build the client with <code>npm run client:build</code>.</p>',
          );
      }
    });
  });

  app.use(errorHandler);

  cron.schedule('* * * * *', () => {
    notifications.processReminders().catch((err) => {
      console.error('Reminder processing failed:', err);
    });
  });

  const port = process.env.PORT || 3000;
  app.listen(Number(port), () => {
    console.log(`Eventful API running on http://localhost:${port}`);
    if (process.env.SWAGGER_ENABLED !== 'false') {
      console.log(`Swagger docs at http://localhost:${port}/api/docs`);
    }
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
