import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../../../domain/entities/service.entity';
import { IServiceRepository } from '../../../../domain/repositories/service.repository.interface';
import { ServiceSchema } from '../schemas/service.schema';

@Injectable()
export class TypeOrmServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceSchema)
    private readonly serviceRepository: Repository<ServiceSchema>,
  ) {}

  async create(service: Service): Promise<Service> {
    const schema = this.toSchema(service);
    const savedSchema = await this.serviceRepository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: string): Promise<Service | null> {
    const schema = await this.serviceRepository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Service[]> {
    const schemas = await this.serviceRepository.find();
    return schemas.map(schema => this.toDomain(schema));
  }

  async update(id: string, service: Service): Promise<Service> {
    const schema = this.toSchema(service);
    await this.serviceRepository.update(id, schema);
    const updatedSchema = await this.serviceRepository.findOne({ where: { id } });
    if (!updatedSchema) {
      throw new Error('Service not found after update');
    }
    return this.toDomain(updatedSchema);
  }

  async delete(id: string): Promise<void> {
    await this.serviceRepository.delete(id);
  }

  private toSchema(service: Service): ServiceSchema {
    const schema = new ServiceSchema();
    schema.name = service.name;
    schema.description = service.description || null;
    schema.price = service.price;
    schema.duration = service.duration;
    schema.isActive = service.isActive;
    return schema;
  }

  private toDomain(schema: ServiceSchema): Service {
    return Service.create({
      name: schema.name,
      description: schema.description,
      price: schema.price,
      duration: schema.duration,
      isActive: schema.isActive,
    });
  }
} 