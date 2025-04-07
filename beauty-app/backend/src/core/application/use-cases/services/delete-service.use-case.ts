import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { ServiceNotFoundException } from '../../../domain/exceptions/service-not-found.exception';

@Injectable()
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new ServiceNotFoundException(id);
    }
    await this.serviceRepository.delete(id);
  }
} 