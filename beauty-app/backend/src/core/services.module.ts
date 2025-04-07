import { Module } from '@nestjs/common';
import { ServicesController } from './infrastructure/controllers/services.controller';
import { CreateServiceUseCase } from './application/use-cases/services/create-service.use-case';
import { GetServiceUseCase } from './application/use-cases/services/get-service.use-case';
import { GetAllServicesUseCase } from './application/use-cases/services/get-all-services.use-case';
import { UpdateServiceUseCase } from './application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from './application/use-cases/services/delete-service.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchema } from './infrastructure/persistence/typeorm/entities/service.schema';
import { TypeOrmServiceRepository } from './infrastructure/persistence/typeorm/repositories/service.repository';
import { SERVICE_REPOSITORY } from './domain/repositories/service.repository.interface';

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
    GetAllServicesUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicesModule {} 