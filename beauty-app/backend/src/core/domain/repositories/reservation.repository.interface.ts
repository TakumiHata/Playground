import { Reservation } from '../entities/reservation.entity';

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]>;
  findByStaffId(staffId: string): Promise<Reservation[]>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findByStaffIdAndDateRange(
    staffId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Reservation[]>;
  findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Reservation[]>;
  findConflictingReservations(
    staffId: string,
    date: Date,
    durationInMinutes: number,
  ): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<void>;
  update(reservation: Reservation): Promise<void>;
  delete(id: string): Promise<void>;
} 