import { Test, TestingModule } from '@nestjs/testing';
import { GetServicesUseCase } from './get-services.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';

describe('GetServicesUseCase', () => {
  let useCase: GetServicesUseCase;
  let serviceRepository: IServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetServicesUseCase,
        {
          provide: 'SERVICE_REPOSITORY',
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetServicesUseCase>(GetServicesUseCase);
    serviceRepository = module.get<IServiceRepository>('SERVICE_REPOSITORY');
  });

  it('should get all services', async () => {
    const mockServices = [
      Service.create({
        name: 'Test Service 1',
        description: 'Test Description 1',
        price: 100,
        duration: 60,
        isActive: true,
      }),
      Service.create({
        name: 'Test Service 2',
        description: 'Test Description 2',
        price: 200,
        duration: 90,
        isActive: true,
      }),
    ];

    jest.spyOn(serviceRepository, 'findAll').mockResolvedValue(mockServices);

    const result = await useCase.execute();

    expect(result).toBe(mockServices);
    expect(serviceRepository.findAll).toHaveBeenCalled();
  });
}); 