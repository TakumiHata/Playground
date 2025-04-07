import { DomainException } from './domain.exception';

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('無効な認証情報です', 'INVALID_CREDENTIALS', 401);
  }
}

export class UserNotFoundException extends DomainException {
  constructor() {
    super('ユーザーが見つかりません', 'USER_NOT_FOUND', 404);
  }
}

export class UnauthorizedException extends DomainException {
  constructor() {
    super('認証が必要です', 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenException extends DomainException {
  constructor() {
    super('アクセス権限がありません', 'FORBIDDEN', 403);
  }
} 