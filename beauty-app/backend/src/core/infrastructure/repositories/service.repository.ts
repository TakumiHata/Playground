import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceSchema } from '../persistence/typeorm/schemas/service.schema';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceSchema)
    private readonly typeOrmRepository: Repository<ServiceSchema>,
  ) {}

  async create(service: Service): Promise<Service> {
    const schema = this.toSchema(service);
    const savedSchema = await this.typeOrmRepository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: string): Promise<Service | null> {
    const schema = await this.typeOrmRepository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Service[]> {
    const schemas = await this.typeOrmRepository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async update(id: string, service: Service): Promise<Service> {
    const schema = this.toSchema(service);
    await this.typeOrmRepository.update(id, schema);
    const updatedSchema = await this.typeOrmRepository.findOne({ where: { id } });
    return this.toDomain(updatedSchema!);
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }

  private toSchema(service: Service): ServiceSchema {
    const schema = new ServiceSchema();
    schema.id = service.id;
    schema.name = service.name;
    schema.description = service.description || '';
    schema.price = service.price;
    schema.duration = service.duration;
    schema.isActive = service.isActive;
    schema.createdAt = service.createdAt;
    schema.updatedAt = service.updatedAt;
    return schema;
  }

  private toDomain(schema: ServiceSchema): Service {
    return Service.create(
      {
        name: schema.name,
        description: schema.description,
        price: schema.price,
        duration: schema.duration,
        isActive: schema.isActive,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      },
      schema.id,
    );
  }
} 