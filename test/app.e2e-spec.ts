import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should reject unauthenticated dashboard access', () => {
    return request(app.getHttpServer())
      .get('/api/v1/dashboard')
      .expect(401);
  });

  it('should reject unauthenticated categories access', () => {
    return request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(401);
  });

  it('should reject register when password is shorter than 8 characters', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual(
          expect.arrayContaining([
            expect.stringMatching(/password/i),
          ]),
        );
      });
  });

  it('should reject register with non-whitelisted properties', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'validpass123',
        role: 'admin',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual(
          expect.arrayContaining(['property role should not exist']),
        );
      });
  });
});
