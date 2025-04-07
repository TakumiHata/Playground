import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './services.module';
import { Service } from '../../domain/entities/service.entity';
import { ServicesController } from '../controllers/services.controller';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';
import { GetAllServicesUseCase } from '../../application/use-cases/services/get-all-services.use-case';
import { ServiceRepository } from '../../domain/repositories/service.repository';

describe('ServicesModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Service],
          synchronize: true,
        }),
        ServicesModule,
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

  it('should have UpdateServiceUseCase', () => {
    const useCase = module.get<UpdateServiceUseCase>(UpdateServiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have DeleteServiceUseCase', () => {
    const useCase = module.get<DeleteServiceUseCase>(DeleteServiceUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have GetAllServicesUseCase', () => {
    const useCase = module.get<GetAllServicesUseCase>(GetAllServicesUseCase);
    expect(useCase).toBeDefined();
  });

  it('should have ServiceRepository', () => {
    const repository = module.get<ServiceRepository>(ServiceRepository);
    expect(repository).toBeDefined();
  });
}); 