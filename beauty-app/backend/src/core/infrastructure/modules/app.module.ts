import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../core/auth.module';
import { UsersModule } from '../../../core/users.module';
import { ServicesModule } from '../../../core/services.module';
import { ReservationsModule } from '../../../core/reservations.module';
import { UserSchema } from '../persistence/typeorm/schemas/user.schema';
import { ServiceSchema } from '../persistence/typeorm/schemas/service.schema';
import { ReservationSchema } from '../persistence/typeorm/schemas/reservation.schema';
import { swaggerConfig } from '../config/swagger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'beauty_app',
      entities: [UserSchema, ServiceSchema, ReservationSchema],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    ServicesModule,
    ReservationsModule,
  ],
})
export class AppModule {
  static createNestApplication() {
    return this;
  }

  static setupSwagger(app: any) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }
} 