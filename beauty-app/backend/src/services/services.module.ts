import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { Service } from '../core/domain/entities/service.entity';
import { CreateServiceUseCase } from '../core/application/use-cases/services/create-service.use-case';
import { GetServicesUseCase } from '../core/application/use-cases/services/get-services.use-case';
import { GetServiceUseCase } from '../core/application/use-cases/services/get-service.use-case';
import { UpdateServiceUseCase } from '../core/application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../core/application/use-cases/services/delete-service.use-case';
import { ServiceRepository } from '../core/infrastructure/repositories/service.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [
    ServiceRepository,
    CreateServiceUseCase,
    GetServicesUseCase,
    GetServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
  exports: [ServiceRepository],
})
export class ServicesModule {} 