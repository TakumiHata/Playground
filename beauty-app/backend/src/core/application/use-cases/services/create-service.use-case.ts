import { Injectable, Inject } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { CreateServiceRequestDto } from '../../../infrastructure/dto/services/create-service-request.dto';

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(createServiceDto: CreateServiceRequestDto): Promise<Service> {
    const service = new Service();
    service.name = createServiceDto.name;
    service.description = createServiceDto.description;
    service.price = createServiceDto.price;
    service.duration = createServiceDto.duration;
    service.isActive = createServiceDto.isActive;

    return this.serviceRepository.create(service);
  }
} 