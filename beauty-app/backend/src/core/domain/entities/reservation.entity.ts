import { Entity } from './entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

export interface ReservationProps {
  userId: string;
  serviceId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation extends Entity<ReservationProps> {
  private constructor(props: ReservationProps, id?: string) {
    super(props, id);
  }

  public static create(props: ReservationProps, id?: string): Reservation {
    const reservation = new Reservation(props, id);
    return reservation;
  }

  get userId(): string {
    return this.props.userId;
  }

  get serviceId(): string {
    return this.props.serviceId;
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

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }

  public updateStatus(status: ReservationStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  public updateNotes(notes: string): void {
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }
} 
} 