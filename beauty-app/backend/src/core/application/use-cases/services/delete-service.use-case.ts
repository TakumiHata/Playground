import { Injectable, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';

@Injectable()
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string): Promise<void> {
    const existingService = await this.serviceRepository.findById(id);
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    await this.serviceRepository.delete(id);
  }
} 