import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { StaffModule } from './staff/staff.module';
import { ServicesModule } from './services/services.module';
import { PrismaService } from './prisma/prisma.service';
import { validate } from './config/env.validation';
import { ReservationSchema } from './core/infrastructure/persistence/typeorm/entities/reservation.schema';
import { TypeOrmReservationRepository } from './core/infrastructure/persistence/typeorm/repositories/reservation.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [ReservationSchema],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ReservationSchema]),
    AuthModule,
    UsersModule,
    ReservationsModule,
    StaffModule,
    ServicesModule,
  ],
  providers: [
    PrismaService,
    {
      provide: 'IReservationRepository',
      useClass: TypeOrmReservationRepository,
    },
  ],
  exports: ['IReservationRepository'],
})
export class AppModule {} 