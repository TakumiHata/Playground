import { Entity } from './entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

interface ReservationProps {
  userId: string;
  serviceId: string;
  staffId?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  notes?: string;
}

export class Reservation extends Entity<ReservationProps> {
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

  static create(props: ReservationProps): Reservation {
    return new Reservation(props);
  }

  private constructor(props: ReservationProps) {
    super(props);
  }
} 
} 