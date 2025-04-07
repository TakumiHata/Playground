import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRepository } from './service.repository';
import { Service } from '../../domain/entities/service.entity';

describe('ServiceRepository', () => {
  let repository: ServiceRepository;
  let typeOrmRepository: Repository<Service>;

  const mockService = {
    id: '1',
    name: 'Test Service',
    description: 'Test Description',
    price: 1000,
    duration: 60,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceRepository,
        {
          provide: getRepositoryToken(Service),
          useValue: {
            save: jest.fn().mockResolvedValue(mockService),
            find: jest.fn().mockResolvedValue([mockService]),
            findOne: jest.fn().mockResolvedValue(mockService),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    repository = module.get<ServiceRepository>(ServiceRepository);
    typeOrmRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const result = await repository.create(mockService);
      expect(result).toEqual(mockService);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockService);
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const result = await repository.findAll();
      expect(result).toEqual([mockService]);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a service by id', async () => {
      const result = await repository.findById('1');
      expect(result).toEqual(mockService);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if service not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);
      const result = await repository.findById('2');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updatedService = { ...mockService, name: 'Updated Service' };
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(updatedService);
      
      const result = await repository.update('1', { name: 'Updated Service' });
      expect(result).toEqual(updatedService);
      expect(typeOrmRepository.update).toHaveBeenCalledWith('1', { name: 'Updated Service' });
    });

    it('should return null if service not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);
      const result = await repository.update('2', { name: 'Updated Service' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      await repository.delete('1');
      expect(typeOrmRepository.delete).toHaveBeenCalledWith('1');
    });
  });
}); 