import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../domain/entities/reservation.entity';

@Injectable()
export class ListReservationsUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(): Promise<Reservation[]> {
    return this.reservationRepository.findAll();
  }
} 