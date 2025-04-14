import { Entity } from './entity';
import { Service } from './service.entity';
import { User } from './user.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

export interface ReservationProps {
  userId: string;
  serviceId: string;
  staffId?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  notes?: string;
  user?: User;
  staff?: User;
  service?: Service;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation extends Entity<ReservationProps> {
  private constructor(props: ReservationProps, id?: string) {
    super(props, id);
  }

  public static create(props: ReservationProps, id?: string): Reservation {
    return new Reservation(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get serviceId(): string {
    return this.props.serviceId;
  }

  get staffId(): string | undefined {
    return this.props.staffId;
  }

  get date(): Date {
    return this.props.date;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get status(): ReservationStatus {
    return this.props.status;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get user(): User | undefined {
    return this.props.user;
  }

  get staff(): User | undefined {
    return this.props.staff;
  }

  get service(): Service | undefined {
    return this.props.service;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  confirm(): void {
    this.props.status = ReservationStatus.CONFIRMED;
  }

  cancel(): void {
    this.props.status = ReservationStatus.CANCELLED;
  }

  complete(): void {
    this.props.status = ReservationStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.props.status === ReservationStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.props.status === ReservationStatus.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.props.status === ReservationStatus.CANCELLED;
  }

  isCompleted(): boolean {
    return this.props.status === ReservationStatus.COMPLETED;
  }
} 