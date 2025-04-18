import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchema } from '../persistence/typeorm/schemas/service.schema';
import { TypeOrmServiceRepository } from '../persistence/typeorm/repositories/service.repository';
import { ServicesController } from '../../application/controllers/services.controller';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';
import { GetServicesUseCase } from '../../application/use-cases/services/get-services.use-case';
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
    GetServicesUseCase,
  ],
  exports: [
    SERVICE_REPOSITORY,
    CreateServiceUseCase,
    GetServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
    GetServicesUseCase,
  ],
})
export class ServicesModule {} 