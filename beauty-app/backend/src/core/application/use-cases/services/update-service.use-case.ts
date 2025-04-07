import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { UpdateServiceRequestDto } from '../../../infrastructure/dto/services/update-service-request.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(id: string, updateServiceDto: UpdateServiceRequestDto): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    if (updateServiceDto.name) {
      service.name = updateServiceDto.name;
    }
    if (updateServiceDto.description) {
      service.description = updateServiceDto.description;
    }
    if (updateServiceDto.price) {
      service.price = updateServiceDto.price;
    }
    if (updateServiceDto.duration) {
      service.duration = updateServiceDto.duration;
    }
    if (updateServiceDto.isActive !== undefined) {
      service.isActive = updateServiceDto.isActive;
    }

    return this.serviceRepository.update(id, service);
  }
} 