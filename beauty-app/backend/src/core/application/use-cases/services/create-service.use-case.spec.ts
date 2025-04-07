import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceUseCase } from './create-service.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';
import { CreateServiceRequestDto } from '../../../infrastructure/dto/services/create-service-request.dto';

describe('CreateServiceUseCase', () => {
  let useCase: CreateServiceUseCase;
  let serviceRepository: jest.Mocked<IServiceRepository>;

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

  const mockRequest: CreateServiceRequestDto = {
    name: 'Test Service',
    description: 'Test Description',
    price: 1000,
    duration: 60,
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateServiceUseCase,
        {
          provide: 'IServiceRepository',
          useValue: {
            create: jest.fn().mockResolvedValue(mockService),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateServiceUseCase>(CreateServiceUseCase);
    serviceRepository = module.get('IServiceRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a service', async () => {
      const result = await useCase.execute(mockRequest);
      expect(result).toEqual(mockService);
      expect(serviceRepository.create).toHaveBeenCalledWith(expect.any(Service));
    });

    it('should create a service with default isActive value', async () => {
      const requestWithoutIsActive = { ...mockRequest };
      delete requestWithoutIsActive.isActive;

      const result = await useCase.execute(requestWithoutIsActive);
      expect(result).toEqual(mockService);
      expect(serviceRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          isActive: true,
        }),
      );
    });
  });
}); 