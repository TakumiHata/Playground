import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { CreateServiceRequestDto } from '../../../infrastructure/dto/services/create-service-request.dto';

@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(request: CreateServiceRequestDto): Promise<Service> {
    const service = new Service();
    service.name = request.name;
    service.description = request.description;
    service.price = request.price;
    service.duration = request.duration;
    service.isActive = request.isActive ?? true;

    return this.serviceRepository.create(service);
  }
} 