import { DomainException } from './domain.exception';

export class ReservationNotFoundException extends DomainException {
  constructor() {
    super('予約が見つかりません', 'RESERVATION_NOT_FOUND', 404);
  }
}

export class ReservationValidationException extends DomainException {
  constructor(message: string) {
    super(message, 'RESERVATION_VALIDATION_ERROR', 400);
  }
}

export class ReservationStatusException extends DomainException {
  constructor(message: string) {
    super(message, 'RESERVATION_STATUS_ERROR', 400);
  }
} 