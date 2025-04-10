import { Reservation } from '../entities/reservation.entity';

export interface IReservationRepository {
  create(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]>;
  findByStaffId(staffId: string): Promise<Reservation[]>;
  findByUserId(userId: string): Promise<Reservation[]>;
  update(id: string, reservation: Reservation): Promise<Reservation>;
  delete(id: string): Promise<void>;
} 