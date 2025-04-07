import { DomainException } from './domain.exception';

export class ServiceNotFoundException extends DomainException {
  constructor() {
    super('サービスが見つかりません', 'SERVICE_NOT_FOUND', 404);
  }
}

export class ServiceValidationException extends DomainException {
  constructor(message: string) {
    super(message, 'SERVICE_VALIDATION_ERROR', 400);
  }
}

export class ServiceStatusException extends DomainException {
  constructor(message: string) {
    super(message, 'SERVICE_STATUS_ERROR', 400);
  }
} 