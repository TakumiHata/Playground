import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { CreateServiceRequestDto } from '../../dto/services/create-service.dto';

@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(request: CreateServiceRequestDto): Promise<Service> {
    const service = Service.create({
      name: request.name,
      description: request.description ?? '',
      price: request.price,
      duration: request.duration,
      isActive: request.isActive ?? true,
    });

    return this.serviceRepository.create(service);
  }
} 