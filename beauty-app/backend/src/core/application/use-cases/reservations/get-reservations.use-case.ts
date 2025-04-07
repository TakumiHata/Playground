import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../domain/entities/reservation.entity';

export interface GetReservationsRequest {
  startDate?: Date;
  endDate?: Date;
  staffId?: string;
  userId?: string;
}

@Injectable()
export class GetReservationsUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(request: GetReservationsRequest): Promise<Reservation[]> {
    if (request.startDate && request.endDate) {
      return this.reservationRepository.findByDateRange(
        request.startDate,
        request.endDate,
      );
    }

    if (request.staffId) {
      return this.reservationRepository.findByStaffId(request.staffId);
    }

    if (request.userId) {
      return this.reservationRepository.findByUserId(request.userId);
    }

    return [];
  }
} 