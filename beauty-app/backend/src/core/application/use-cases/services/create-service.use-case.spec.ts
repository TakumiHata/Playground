import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceUseCase } from './create-service.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';

describe('CreateServiceUseCase', () => {
  let useCase: CreateServiceUseCase;
  let serviceRepository: IServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateServiceUseCase,
        {
          provide: 'SERVICE_REPOSITORY',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateServiceUseCase>(CreateServiceUseCase);
    serviceRepository = module.get<IServiceRepository>('SERVICE_REPOSITORY');
  });

  it('should create a service', async () => {
    const request = {
      name: 'Test Service',
      description: 'Test Description',
      price: 100,
      duration: 60,
      isActive: true,
    };

    const mockService = Service.create({
      name: request.name,
      description: request.description,
      price: request.price,
      duration: request.duration,
      isActive: request.isActive,
    });

    jest.spyOn(serviceRepository, 'create').mockResolvedValue(mockService);

    const result = await useCase.execute(request);

    expect(result).toBe(mockService);
    expect(serviceRepository.create).toHaveBeenCalledWith(expect.any(Service));
  });

  it('should create a service without optional fields', async () => {
    const requestWithoutIsActive = {
      name: 'Test Service',
      description: 'Test Description',
      price: 100,
      duration: 60,
    };

    const mockService = Service.create({
      name: requestWithoutIsActive.name,
      description: requestWithoutIsActive.description,
      price: requestWithoutIsActive.price,
      duration: requestWithoutIsActive.duration,
      isActive: true,
    });

    jest.spyOn(serviceRepository, 'create').mockResolvedValue(mockService);

    const result = await useCase.execute(requestWithoutIsActive);

    expect(result).toBe(mockService);
    expect(serviceRepository.create).toHaveBeenCalledWith(expect.any(Service));
  });
}); 