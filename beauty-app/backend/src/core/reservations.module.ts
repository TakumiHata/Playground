import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './domain/entities/reservation.entity';
import { TypeOrmReservationRepository } from './infrastructure/persistence/typeorm/repositories/reservation.repository';
import { ReservationsController } from './infrastructure/controllers/reservations.controller';
import { CreateReservationUseCase } from './application/use-cases/reservations/create-reservation.use-case';
import { GetReservationUseCase } from './application/use-cases/reservations/get-reservation.use-case';
import { ListReservationsUseCase } from './application/use-cases/reservations/list-reservations.use-case';
import { UpdateReservationUseCase } from './application/use-cases/reservations/update-reservation.use-case';
import { DeleteReservationUseCase } from './application/use-cases/reservations/delete-reservation.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationsController],
  providers: [
    TypeOrmReservationRepository,
    CreateReservationUseCase,
    GetReservationUseCase,
    ListReservationsUseCase,
    UpdateReservationUseCase,
    DeleteReservationUseCase,
  ],
  exports: [TypeOrmReservationRepository],
})
export class ReservationsModule {} 