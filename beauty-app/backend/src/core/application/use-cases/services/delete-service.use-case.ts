import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    await this.serviceRepository.delete(id);
  }
} 