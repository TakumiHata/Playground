import { Test, TestingModule } from '@nestjs/testing';
import { DeleteServiceUseCase } from './delete-service.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { ServiceNotFoundException } from '../../../domain/exceptions/service-not-found.exception';

describe('DeleteServiceUseCase', () => {
  let useCase: DeleteServiceUseCase;
  let serviceRepository: jest.Mocked<IServiceRepository>;

  const mockService: Service = {
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
        DeleteServiceUseCase,
        {
          provide: 'IServiceRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockService),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteServiceUseCase>(DeleteServiceUseCase);
    serviceRepository = module.get('IServiceRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a service', async () => {
      await useCase.execute('1');
      expect(serviceRepository.findById).toHaveBeenCalledWith('1');
      expect(serviceRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw ServiceNotFoundException if service not found', async () => {
      serviceRepository.findById.mockResolvedValue(null);
      await expect(useCase.execute('2')).rejects.toThrow(ServiceNotFoundException);
    });
  });
}); 