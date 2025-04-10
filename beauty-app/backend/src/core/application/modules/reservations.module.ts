import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from '../controllers/reservations.controller';
import { GetReservationsUseCase } from '../use-cases/reservations/get-reservations.use-case';
import { CreateReservationUseCase } from '../use-cases/reservations/create-reservation.use-case';
import { UpdateReservationUseCase } from '../use-cases/reservations/update-reservation.use-case';
import { DeleteReservationUseCase } from '../use-cases/reservations/delete-reservation.use-case';
import { TypeOrmReservationRepository } from '../../infrastructure/persistence/typeorm/repositories/reservation.repository';
import { ReservationSchema } from '../../infrastructure/persistence/typeorm/schemas/reservation.schema';
import { AuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationSchema]),
    AuthModule,
  ],
  controllers: [ReservationsController],
  providers: [
    GetReservationsUseCase,
    CreateReservationUseCase,
    UpdateReservationUseCase,
    DeleteReservationUseCase,
    {
      provide: 'IReservationRepository',
      useClass: TypeOrmReservationRepository,
    },
  ],
  exports: [
    GetReservationsUseCase,
    CreateReservationUseCase,
    UpdateReservationUseCase,
    DeleteReservationUseCase,
  ],
})
export class ReservationsModule {} 