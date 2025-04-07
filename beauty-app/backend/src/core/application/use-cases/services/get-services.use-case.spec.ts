import { Test, TestingModule } from '@nestjs/testing';
import { GetServicesUseCase } from './get-services.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';

describe('GetServicesUseCase', () => {
  let useCase: GetServicesUseCase;
  let serviceRepository: jest.Mocked<IServiceRepository>;

  const mockServices: Service[] = [
    {
      id: '1',
      name: 'Test Service 1',
      description: 'Test Description 1',
      price: 1000,
      duration: 60,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Service 2',
      description: 'Test Description 2',
      price: 2000,
      duration: 90,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetServicesUseCase,
        {
          provide: 'IServiceRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockServices),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetServicesUseCase>(GetServicesUseCase);
    serviceRepository = module.get('IServiceRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return an array of services', async () => {
      const result = await useCase.execute();
      expect(result).toEqual(mockServices);
      expect(serviceRepository.findAll).toHaveBeenCalled();
    });

    it('should return an empty array if no services found', async () => {
      serviceRepository.findAll.mockResolvedValue([]);
      const result = await useCase.execute();
      expect(result).toEqual([]);
    });
  });
}); 