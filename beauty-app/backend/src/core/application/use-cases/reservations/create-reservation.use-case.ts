import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

export interface CreateReservationRequest {
  userId: string;
  serviceId: string;
  staffId?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status?: ReservationStatus;
  notes?: string;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(request: CreateReservationRequest): Promise<Reservation> {
    const reservation = Reservation.create({
      userId: request.userId,
      serviceId: request.serviceId,
      staffId: request.staffId,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      status: request.status ?? ReservationStatus.PENDING,
      notes: request.notes,
    });

    return this.reservationRepository.create(reservation);
  }
} 