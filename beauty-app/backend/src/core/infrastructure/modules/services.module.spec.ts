import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from '../../application/controllers/services.controller';
import { ServicesModule } from './services.module';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { GetServicesUseCase } from '../../application/use-cases/services/get-services.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';

describe('ServicesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ServicesModule],
      providers: [
        {
          provide: 'IServiceRepository',
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        CreateServiceUseCase,
        GetServiceUseCase,
        GetServicesUseCase,
        UpdateServiceUseCase,
        DeleteServiceUseCase,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ServicesController', () => {
    const controller = module.get<ServicesController>(ServicesController);
    expect(controller).toBeDefined();
  });

  it('should have CreateServiceUseCase', () => {
    const useCase = module.get<CreateServiceUseCase>(CreateServiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have GetServiceUseCase', () => {
    const useCase = module.get<GetServiceUseCase>(GetServiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have GetServicesUseCase', () => {
    const useCase = module.get<GetServicesUseCase>(GetServicesUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have UpdateServiceUseCase', () => {
    const useCase = module.get<UpdateServiceUseCase>(UpdateServiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have DeleteServiceUseCase', () => {
    const useCase = module.get<DeleteServiceUseCase>(DeleteServiceUseCase);
    expect(useCase).toBeDefined();
  });
}); 