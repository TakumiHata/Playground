import { Service } from '../entities/service.entity';
import { IServiceRepository } from './service.repository.interface';

export class ServiceRepository implements IServiceRepository {
  private services: Service[] = [];

  async findOne(where: { id: string }): Promise<Service | undefined> {
    return this.services.find(service => service.id === where.id);
  }

  async findById(id: string): Promise<Service> {
    const service = await this.findOne({ id });
    if (!service) {
      throw new Error(`Service with id ${id} not found`);
    }
    return service;
  }

  async findAll(): Promise<Service[]> {
    return this.services;
  }

  async create(service: Service): Promise<Service> {
    this.services.push(service);
    return service;
  }

  async update(id: string, service: Service): Promise<Service> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Service with id ${id} not found`);
    }
    this.services[index] = service;
    return service;
  }

  async delete(id: string): Promise<void> {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Service with id ${id} not found`);
    }
    this.services.splice(index, 1);
  }
} 