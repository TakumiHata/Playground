import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IServiceRepository } from '../../../../domain/repositories/service.repository.interface';
import { Service } from '../../../../domain/entities/service.entity';
import { ServiceSchema } from '../entities/service.schema';

@Injectable()
export class TypeOrmServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceSchema)
    private readonly repository: Repository<ServiceSchema>,
  ) {}

  async findById(id: string): Promise<Service | null> {
    const service = await this.repository.findOne({ where: { id } });
    return service ? this.toDomain(service) : null;
  }

  async findAll(): Promise<Service[]> {
    const services = await this.repository.find();
    return services.map(this.toDomain);
  }

  async create(service: Service): Promise<Service> {
    const schema = this.toSchema(service);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(id: string, service: Service): Promise<Service> {
    const schema = this.toSchema(service);
    await this.repository.update(id, schema);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: ServiceSchema): Service {
    const service = new Service();
    service.id = schema.id;
    service.name = schema.name;
    service.description = schema.description;
    service.price = schema.price;
    service.duration = schema.duration;
    service.isActive = schema.isActive;
    service.createdAt = schema.createdAt;
    service.updatedAt = schema.updatedAt;
    return service;
  }

  private toSchema(service: Service): ServiceSchema {
    const schema = new ServiceSchema();
    schema.id = service.id;
    schema.name = service.name;
    schema.description = service.description;
    schema.price = service.price;
    schema.duration = service.duration;
    schema.isActive = service.isActive;
    schema.createdAt = service.createdAt;
    schema.updatedAt = service.updatedAt;
    return schema;
  }
} 