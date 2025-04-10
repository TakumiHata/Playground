import { Injectable, NotFoundException } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';

@Injectable()
export class DeleteReservationUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(id: string): Promise<void> {
    const existingReservation = await this.reservationRepository.findById(id);
    if (!existingReservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.reservationRepository.delete(id);
  }
} 