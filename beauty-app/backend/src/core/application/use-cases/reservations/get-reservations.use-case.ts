import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../domain/entities/reservation.entity';

export interface GetReservationsRequest {
  id?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

@Injectable()
export class GetReservationsUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(request: GetReservationsRequest): Promise<Reservation[]> {
    if (request.id) {
      const reservation = await this.reservationRepository.findById(request.id);
      return reservation ? [reservation] : [];
    }

    if (request.startDate && request.endDate) {
      return this.reservationRepository.findByDateRange(request.startDate, request.endDate);
    }

    if (request.userId) {
      return this.reservationRepository.findByUserId(request.userId);
    }

    return this.reservationRepository.findAll();
  }
} 