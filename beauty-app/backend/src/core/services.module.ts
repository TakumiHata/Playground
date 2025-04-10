import { Module } from '@nestjs/common';
import { ServicesController } from './application/controllers/services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSchema } from './infrastructure/persistence/typeorm/schemas/service.schema';
import { ServiceRepository } from './infrastructure/repositories/service.repository';
import { IServiceRepository } from './domain/repositories/service.repository.interface';
import { CreateServiceUseCase } from './application/use-cases/services/create-service.use-case';
import { GetServicesUseCase } from './application/use-cases/services/get-services.use-case';
import { UpdateServiceUseCase } from './application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from './application/use-cases/services/delete-service.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceSchema])],
  controllers: [ServicesController],
  providers: [
    {
      provide: 'SERVICE_REPOSITORY',
      useClass: ServiceRepository,
    },
    CreateServiceUseCase,
    GetServicesUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
  exports: ['SERVICE_REPOSITORY'],
})
export class ServicesModule {} 