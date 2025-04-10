import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../domain/entities/reservation.entity';

export interface GetReservationsRequest {
  userId?: string;
  staffId?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class GetReservationsUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(request: GetReservationsRequest): Promise<Reservation[]> {
    if (request.userId) {
      return this.reservationRepository.findByUserId(request.userId);
    }

    if (request.staffId) {
      return this.reservationRepository.findByStaffId(request.staffId);
    }

    if (request.startDate && request.endDate) {
      return this.reservationRepository.findByDateRange(request.startDate, request.endDate);
    }

    return this.reservationRepository.findAll();
  }
} 