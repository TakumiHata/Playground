import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { ReservationNotFoundException } from '../../../shared/domain/exceptions/reservation.exception';
import { ReservationStatusException } from '../../../shared/domain/exceptions/reservation.exception';
import { ReservationStatus } from '../../../domain/entities/reservation.entity';

@Injectable()
export class DeleteReservationUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) {
      throw new ReservationNotFoundException();
    }

    // 完了済みの予約は削除できない
    if (reservation.status === ReservationStatus.COMPLETED) {
      throw new ReservationStatusException('完了済みの予約は削除できません');
    }

    await this.reservationRepository.delete(id);
  }
} 