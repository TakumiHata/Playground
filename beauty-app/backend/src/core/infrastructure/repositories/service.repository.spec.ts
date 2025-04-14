import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { TypeOrmServiceRepository } from '../persistence/typeorm/repositories/service.repository';
import { ServiceSchema } from '../persistence/typeorm/schemas/service.schema';
import { Service } from '../../domain/entities/service.entity';

describe('TypeOrmServiceRepository', () => {
  let repository: TypeOrmServiceRepository;
  let typeOrmRepository: Repository<ServiceSchema>;

  const mockService = Service.create({
    name: 'Test Service',
    description: 'Test Description',
    price: 100,
    duration: 60,
    isActive: true,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmServiceRepository,
        {
          provide: getRepositoryToken(ServiceSchema),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeOrmServiceRepository>(TypeOrmServiceRepository);
    typeOrmRepository = module.get<Repository<ServiceSchema>>(getRepositoryToken(ServiceSchema));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const savedService = {
        id: '1',
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        duration: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(savedService);

      const result = await repository.create(mockService);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Service');
      expect(typeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a service by id', async () => {
      const foundService = {
        id: '1',
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        duration: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(foundService);

      const result = await repository.findById('1');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Service');
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if service not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findById('1');

      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('findAll', () => {
    it('should find all services', async () => {
      const foundServices = [
        {
          id: '1',
          name: 'Test Service 1',
          description: 'Test Description 1',
          price: 100,
          duration: 60,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Test Service 2',
          description: 'Test Description 2',
          price: 200,
          duration: 90,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(foundServices);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Test Service 1');
      expect(result[1].name).toBe('Test Service 2');
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updatedService = {
        id: '1',
        name: 'Updated Service',
        description: 'Updated Description',
        price: 150,
        duration: 75,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(updatedService);
      jest.spyOn(typeOrmRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await repository.update('1', Service.create({
        name: 'Updated Service',
        description: 'Updated Description',
        price: 150,
        duration: 75,
        isActive: true,
      }));

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Service');
      expect(typeOrmRepository.update).toHaveBeenCalled();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw error if service not found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(typeOrmRepository, 'update').mockResolvedValue({ affected: 0 } as UpdateResult);

      await expect(repository.update('2', Service.create({
        name: 'Updated Service',
        description: 'Updated Description',
        price: 150,
        duration: 75,
        isActive: true,
      }))).rejects.toThrow('Service not found after update');
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      jest.spyOn(typeOrmRepository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);

      await repository.delete('1');

      expect(typeOrmRepository.delete).toHaveBeenCalledWith('1');
    });
  });
}); 