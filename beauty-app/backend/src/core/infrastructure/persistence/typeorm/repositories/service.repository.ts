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
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Service[]> {
    const schemas = await this.repository.find();
    return schemas.map(this.toDomain);
  }

  async save(service: Service): Promise<void> {
    const schema = this.toSchema(service);
    await this.repository.save(schema);
  }

  async update(service: Service): Promise<void> {
    const schema = this.toSchema(service);
    await this.repository.update(schema.id, schema);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: ServiceSchema): Service {
    return Service.create({
      id: schema.id,
      name: schema.name,
      description: schema.description,
      price: schema.price,
      durationInMinutes: schema.durationInMinutes,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(domain: Service): ServiceSchema {
    const schema = new ServiceSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.description = domain.description;
    schema.price = domain.price;
    schema.durationInMinutes = domain.durationInMinutes;
    schema.isActive = domain.isActive;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
} 