import { Injectable, NotFoundException } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

export interface UpdateReservationRequest {
  serviceId?: string;
  staffId?: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  status?: ReservationStatus;
  notes?: string;
}

@Injectable()
export class UpdateReservationUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(id: string, request: UpdateReservationRequest): Promise<Reservation> {
    const existingReservation = await this.reservationRepository.findById(id);
    if (!existingReservation) {
      throw new NotFoundException('Reservation not found');
    }

    const updatedReservation = Reservation.create({
      userId: existingReservation.userId,
      serviceId: request.serviceId ?? existingReservation.serviceId,
      staffId: request.staffId ?? existingReservation.staffId,
      date: request.date ?? existingReservation.date,
      startTime: request.startTime ?? existingReservation.startTime,
      endTime: request.endTime ?? existingReservation.endTime,
      status: request.status ?? existingReservation.status,
      notes: request.notes ?? existingReservation.notes,
    });

    return this.reservationRepository.update(id, updatedReservation);
  }
} 