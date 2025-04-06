import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReservationsModule } from './reservations/reservations.module';
import { StaffModule } from './staff/staff.module';
import { ServicesModule } from './services/services.module';
import { PrismaService } from './prisma/prisma.service';
import { validate } from './config/env.validation';

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
    AuthModule,
    UsersModule,
    ReservationsModule,
    StaffModule,
    ServicesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {} 