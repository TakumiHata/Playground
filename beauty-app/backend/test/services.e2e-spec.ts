import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../src/core/domain/entities/service.entity';
import { UserRole } from '../src/core/domain/entities/user.entity';
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

    it('should not get all services (unauthorized)', () => {
      return request(app.getHttpServer())
        .get('/services')
        .expect(401);
    });
  });

  describe('GET /services/:id', () => {
    let serviceId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockService);
      serviceId = response.body.id;
    });

    it('should get a service by id (admin)', () => {
      return request(app.getHttpServer())
        .get(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(serviceId);
          expect(res.body.name).toBe(mockService.name);
        });
    });

    it('should get a service by id (user)', () => {
      return request(app.getHttpServer())
        .get(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(serviceId);
          expect(res.body.name).toBe(mockService.name);
        });
    });

    it('should not get a service by id (unauthorized)', () => {
      return request(app.getHttpServer())
        .get(`/services/${serviceId}`)
        .expect(401);
    });

    it('should not get a non-existent service', () => {
      return request(app.getHttpServer())
        .get('/services/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PUT /services/:id', () => {
    let serviceId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockService);
      serviceId = response.body.id;
    });

    it('should update a service (admin)', () => {
      const updateData = {
        name: 'カット（更新）',
        price: 6000,
      };

      return request(app.getHttpServer())
        .put(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(serviceId);
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.price).toBe(updateData.price);
        });
    });

    it('should not update a service (user)', () => {
      return request(app.getHttpServer())
        .put(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'カット（更新）' })
        .expect(403);
    });

    it('should not update a service (unauthorized)', () => {
      return request(app.getHttpServer())
        .put(`/services/${serviceId}`)
        .send({ name: 'カット（更新）' })
        .expect(401);
    });

    it('should not update a non-existent service', () => {
      return request(app.getHttpServer())
        .put('/services/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'カット（更新）' })
        .expect(404);
    });
  });

  describe('DELETE /services/:id', () => {
    let serviceId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockService);
      serviceId = response.body.id;
    });

    it('should delete a service (admin)', () => {
      return request(app.getHttpServer())
        .delete(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should not delete a service (user)', () => {
      return request(app.getHttpServer())
        .delete(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should not delete a service (unauthorized)', () => {
      return request(app.getHttpServer())
        .delete(`/services/${serviceId}`)
        .expect(401);
    });

    it('should not delete a non-existent service', () => {
      return request(app.getHttpServer())
        .delete('/services/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
}); 