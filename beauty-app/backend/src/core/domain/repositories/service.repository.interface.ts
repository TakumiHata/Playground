import { Service } from '../entities/service.entity';

export const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';

export interface IServiceRepository {
  findById(id: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  create(service: Service): Promise<Service>;
  update(id: string, service: Service): Promise<Service>;
  delete(id: string): Promise<void>;
} 