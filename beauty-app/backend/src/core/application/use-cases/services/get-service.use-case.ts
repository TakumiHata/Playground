import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';

@Injectable()
export class GetServiceUseCase {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }
} 