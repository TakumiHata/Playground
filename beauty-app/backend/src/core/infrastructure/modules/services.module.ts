import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchema } from '../persistence/typeorm/entities/service.schema';
import { TypeOrmServiceRepository } from '../persistence/typeorm/repositories/service.repository';
import { ServicesController } from '../controllers/services.controller';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';
import { GetAllServicesUseCase } from '../../application/use-cases/services/get-all-services.use-case';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';

const SERVICE_REPOSITORY = 'SERVICE_REPOSITORY';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSchema])],
  controllers: [ServicesController],
  providers: [
    {
      provide: SERVICE_REPOSITORY,
      useClass: TypeOrmServiceRepository,
    },
    CreateServiceUseCase,
    GetServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
    GetAllServicesUseCase,
  ],
  exports: [
    SERVICE_REPOSITORY,
    CreateServiceUseCase,
    GetServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
    GetAllServicesUseCase,
  ],
})
export class ServicesModule {} 