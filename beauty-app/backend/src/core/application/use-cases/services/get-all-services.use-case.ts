import { Injectable, Inject } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';

@Injectable()
export class GetAllServicesUseCase {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }
} 