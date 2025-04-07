import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServicesUseCase } from '../../application/use-cases/services/get-services.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';
import { Service } from '../../domain/entities/service.entity';
import { CreateServiceRequestDto } from '../dto/services/create-service-request.dto';
import { UpdateServiceRequestDto } from '../dto/services/update-service-request.dto';
import { ServiceResponseDto } from '../dto/services/service-response.dto';

describe('ServiceController', () => {
  let controller: ServiceController;
  let createServiceUseCase: jest.Mocked<CreateServiceUseCase>;
  let getServicesUseCase: jest.Mocked<GetServicesUseCase>;
  let getServiceUseCase: jest.Mocked<GetServiceUseCase>;
  let updateServiceUseCase: jest.Mocked<UpdateServiceUseCase>;
  let deleteServiceUseCase: jest.Mocked<DeleteServiceUseCase>;

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

  const mockServiceResponse: ServiceResponseDto = {
    id: '1',
    name: 'Test Service',
    description: 'Test Description',
    price: 1000,
    duration: 60,
    isActive: true,
    createdAt: mockService.createdAt,
    updatedAt: mockService.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: CreateServiceUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockService),
          },
        },
        {
          provide: GetServicesUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([mockService]),
          },
        },
        {
          provide: GetServiceUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockService),
          },
        },
        {
          provide: UpdateServiceUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockService),
          },
        },
        {
          provide: DeleteServiceUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    createServiceUseCase = module.get(CreateServiceUseCase);
    getServicesUseCase = module.get(GetServicesUseCase);
    getServiceUseCase = module.get(GetServiceUseCase);
    updateServiceUseCase = module.get(UpdateServiceUseCase);
    deleteServiceUseCase = module.get(DeleteServiceUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const request: CreateServiceRequestDto = {
        name: 'Test Service',
        description: 'Test Description',
        price: 1000,
        duration: 60,
        isActive: true,
      };

      const result = await controller.createService(request);
      expect(result).toEqual(mockServiceResponse);
      expect(createServiceUseCase.execute).toHaveBeenCalledWith(request);
    });
  });

  describe('getServices', () => {
    it('should return an array of services', async () => {
      const result = await controller.getServices();
      expect(result).toEqual([mockServiceResponse]);
      expect(getServicesUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('getService', () => {
    it('should return a service by id', async () => {
      const result = await controller.getService('1');
      expect(result).toEqual(mockServiceResponse);
      expect(getServiceUseCase.execute).toHaveBeenCalledWith('1');
    });
  });

  describe('updateService', () => {
    it('should update a service', async () => {
      const request: UpdateServiceRequestDto = {
        name: 'Updated Service',
        description: 'Updated Description',
      };

      const result = await controller.updateService('1', request);
      expect(result).toEqual(mockServiceResponse);
      expect(updateServiceUseCase.execute).toHaveBeenCalledWith('1', request);
    });
  });

  describe('deleteService', () => {
    it('should delete a service', async () => {
      await controller.deleteService('1');
      expect(deleteServiceUseCase.execute).toHaveBeenCalledWith('1');
    });
  });
}); 