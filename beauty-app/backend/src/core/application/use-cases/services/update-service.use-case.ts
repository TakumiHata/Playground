import { Injectable, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { UpdateServiceRequestDto } from '../../dto/services/update-service.dto';

@Injectable()
export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async execute(id: string, request: UpdateServiceRequestDto): Promise<Service> {
    const existingService = await this.serviceRepository.findById(id);
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = Service.create({
      name: request.name ?? existingService.name,
      description: request.description ?? existingService.description,
      price: request.price ?? existingService.price,
      duration: request.duration ?? existingService.duration,
      isActive: request.isActive ?? existingService.isActive,
    });

    return this.serviceRepository.update(id, updatedService);
  }
} 