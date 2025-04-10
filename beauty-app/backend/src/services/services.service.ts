import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.create({
      data: {
        name: createServiceDto.name,
        description: createServiceDto.description,
        price: createServiceDto.price,
        duration: createServiceDto.duration,
        category: createServiceDto.category,
        isActive: createServiceDto.isActive ?? true,
      },
    });
    return this.mapToResponseDto(service);
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.prisma.service.findMany();
    return services.map(service => this.mapToResponseDto(service));
  }

  async findOne(id: string): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      throw new Error('Service not found');
    }
    return this.mapToResponseDto(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
    return this.mapToResponseDto(service);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }

  private mapToResponseDto(service: any): ServiceResponseDto {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
} 