import { Service } from '../entities/service.entity';

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service | null>;
  update(id: string, service: Partial<Service>): Promise<Service | null>;
  delete(id: string): Promise<void>;
} 