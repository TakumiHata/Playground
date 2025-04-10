import { Test, TestingModule } from '@nestjs/testing';
import { DeleteServiceUseCase } from './delete-service.use-case';
import { IServiceRepository } from '../../../domain/repositories/service.repository.interface';
import { Service } from '../../../domain/entities/service.entity';

describe('DeleteServiceUseCase', () => {
  let useCase: DeleteServiceUseCase;
  let serviceRepository: IServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteServiceUseCase,
        {
          provide: 'SERVICE_REPOSITORY',
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteServiceUseCase>(DeleteServiceUseCase);
    serviceRepository = module.get<IServiceRepository>('SERVICE_REPOSITORY');
  });

  it('should delete a service', async () => {
    const mockService = Service.create({
      name: 'Test Service',
      description: 'Test Description',
      price: 100,
      duration: 60,
      isActive: true,
    });

    jest.spyOn(serviceRepository, 'findById').mockResolvedValue(mockService);
    jest.spyOn(serviceRepository, 'delete').mockResolvedValue();

    await useCase.execute('1');

    expect(serviceRepository.findById).toHaveBeenCalledWith('1');
    expect(serviceRepository.delete).toHaveBeenCalledWith('1');
  });
}); 