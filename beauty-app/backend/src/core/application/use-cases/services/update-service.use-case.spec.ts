import { Test, TestingModule } from '@nestjs/testing';
import { UpdateServiceUseCase } from './update-service.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { ServiceNotFoundException } from '../../../domain/exceptions/service-not-found.exception';
import { UpdateServiceRequestDto } from '../../../infrastructure/dto/services/update-service-request.dto';

describe('UpdateServiceUseCase', () => {
  let useCase: UpdateServiceUseCase;
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

  const mockUpdatedService: Service = {
    ...mockService,
    name: 'Updated Service',
    description: 'Updated Description',
  };

  const mockRequest: UpdateServiceRequestDto = {
    name: 'Updated Service',
    description: 'Updated Description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateServiceUseCase,
        {
          provide: 'IServiceRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockService),
            update: jest.fn().mockResolvedValue(mockUpdatedService),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateServiceUseCase>(UpdateServiceUseCase);
    serviceRepository = module.get('IServiceRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a service', async () => {
      const result = await useCase.execute('1', mockRequest);
      expect(result).toEqual(mockUpdatedService);
      expect(serviceRepository.findById).toHaveBeenCalledWith('1');
      expect(serviceRepository.update).toHaveBeenCalledWith('1', mockRequest);
    });

    it('should throw ServiceNotFoundException if service not found', async () => {
      serviceRepository.findById.mockResolvedValue(null);
      await expect(useCase.execute('2', mockRequest)).rejects.toThrow(ServiceNotFoundException);
    });

    it('should update only provided fields', async () => {
      const partialRequest = { name: 'Updated Service' };
      const result = await useCase.execute('1', partialRequest);
      expect(result).toEqual(mockUpdatedService);
      expect(serviceRepository.update).toHaveBeenCalledWith('1', partialRequest);
    });
  });
}); 