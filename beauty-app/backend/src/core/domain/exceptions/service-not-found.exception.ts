import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Service with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
} 