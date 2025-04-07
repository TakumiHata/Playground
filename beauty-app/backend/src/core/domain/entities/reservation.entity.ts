import { Entity } from '../../../shared/domain/entity.base';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface ReservationProps {
  id?: string;
  userId: string;
  staffId: string;
  serviceIds: string[];
  date: Date;
  status: ReservationStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reservation extends Entity<ReservationProps> {
  private constructor(props: ReservationProps) {
    super(props);
  }

  public static create(props: ReservationProps): Reservation {
    const reservation = new Reservation({
      ...props,
      status: props.status ?? ReservationStatus.PENDING,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });

    return reservation;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get staffId(): string {
    return this.props.staffId;
  }

  get serviceIds(): string[] {
    return this.props.serviceIds;
  }

  get date(): Date {
    return this.props.date;
  }

  get status(): ReservationStatus {
    return this.props.status;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
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