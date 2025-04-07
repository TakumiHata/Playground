import { EntityRepository, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async findById(id: string): Promise<Service | undefined> {
    return this.findOne({ where: { id } });
  }

  async findAll(): Promise<Service[]> {
    return this.find();
  }

  async createService(service: Service): Promise<Service> {
    return this.save(service);
  }

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    await this.update(id, service);
    return this.findById(id);
  }

  async deleteService(id: string): Promise<void> {
    await this.delete(id);
  }
} 