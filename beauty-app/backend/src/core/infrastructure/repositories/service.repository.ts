import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../domain/entities/service.entity';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';

@Injectable()
export class ServiceRepository implements IServiceRepository {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
  ) {}

  async create(service: Service): Promise<Service> {
    return this.repository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Service | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, service: Partial<Service>): Promise<Service | null> {
    await this.repository.update(id, service);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
} 