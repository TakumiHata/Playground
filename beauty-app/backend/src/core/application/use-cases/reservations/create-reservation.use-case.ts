import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../../../domain/repositories/reservation.repository.interface';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Reservation, ReservationStatus } from '../../../domain/entities/reservation.entity';
import { UserNotFoundException } from '../../../shared/domain/exceptions/auth.exception';
import { ServiceNotFoundException } from '../../../shared/domain/exceptions/service.exception';
import { ReservationValidationException } from '../../../shared/domain/exceptions/reservation.exception';

export interface CreateReservationRequest {
  userId: string;
  staffId: string;
  serviceIds: string[];
  date: Date;
  notes?: string;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly serviceRepository: IServiceRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: CreateReservationRequest): Promise<Reservation> {
    // ユーザーの存在確認
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // スタッフの存在確認
    const staff = await this.userRepository.findById(request.staffId);
    if (!staff) {
      throw new UserNotFoundException();
    }

    // サービスの存在確認
    for (const serviceId of request.serviceIds) {
      const service = await this.serviceRepository.findById(serviceId);
      if (!service) {
        throw new ServiceNotFoundException();
      }
    }

    // 予約の重複チェック
    const existingReservations = await this.reservationRepository.findByDateRange(
      new Date(request.date.setHours(0, 0, 0, 0)),
      new Date(request.date.setHours(23, 59, 59, 999)),
    );

    const hasConflict = existingReservations.some(
      (reservation) =>
        reservation.staffId === request.staffId &&
        reservation.status !== ReservationStatus.CANCELLED,
    );

    if (hasConflict) {
      throw new ReservationValidationException('指定された時間帯は既に予約が入っています');
    }

    const reservation = Reservation.create({
      userId: request.userId,
      staffId: request.staffId,
      serviceIds: request.serviceIds,
      date: request.date,
      status: ReservationStatus.PENDING,
      notes: request.notes,
    });

    await this.reservationRepository.save(reservation);

    return reservation;
  }
} 