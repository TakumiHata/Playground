import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { ServiceNotFoundException } from '../../../domain/exceptions/service-not-found.exception';
import { UpdateServiceRequestDto } from '../../../infrastructure/dto/services/update-service-request.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string, request: UpdateServiceRequestDto): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new ServiceNotFoundException(id);
    }

    const updatedService = await this.serviceRepository.update(id, {
      name: request.name ?? service.name,
      description: request.description ?? service.description,
      price: request.price ?? service.price,
      duration: request.duration ?? service.duration,
      isActive: request.isActive ?? service.isActive,
    });

    if (!updatedService) {
      throw new ServiceNotFoundException(id);
    }

    return updatedService;
  }
} 