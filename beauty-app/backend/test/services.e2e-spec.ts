import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../src/core/domain/entities/service.entity';
import { UserRole } from '../src/core/domain/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';

describe('Services (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let adminToken: string;
  let userToken: string;

  const mockService = {
    name: 'カット',
    description: '髪の毛をカットします',
    price: 5000,
    duration: 60,
    isActive: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Service],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    adminToken = jwtService.sign({ role: UserRole.ADMIN });
    userToken = jwtService.sign({ role: UserRole.USER });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /services', () => {
    it('should create a service (admin)', () => {
      return request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockService)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(mockService.name);
          expect(res.body.description).toBe(mockService.description);
          expect(res.body.price).toBe(mockService.price);
          expect(res.body.duration).toBe(mockService.duration);
          expect(res.body.isActive).toBe(mockService.isActive);
        });
    });

    it('should not create a service (user)', () => {
      return request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockService)
        .expect(403);
    });

    it('should not create a service (unauthorized)', () => {
      return request(app.getHttpServer())
        .post('/services')
        .send(mockService)
        .expect(401);
    });
  });

  describe('GET /services', () => {
    it('should get all services (admin)', () => {
      return request(app.getHttpServer())
        .get('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get all services (user)', () => {
      return request(app.getHttpServer())
        .get('/services')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
}); 