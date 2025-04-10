import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from '../controllers/services.controller';
import { GetServicesUseCase } from '../use-cases/services/get-services.use-case';
import { CreateServiceUseCase } from '../use-cases/services/create-service.use-case';
import { UpdateServiceUseCase } from '../use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../use-cases/services/delete-service.use-case';
import { TypeOrmServiceRepository } from '../../infrastructure/persistence/typeorm/repositories/service.repository';
import { ServiceSchema } from '../../infrastructure/persistence/typeorm/schemas/service.schema';
import { AuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceSchema]),
    AuthModule,
  ],
  controllers: [ServicesController],
  providers: [
    GetServicesUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
    {
      provide: 'IServiceRepository',
      useClass: TypeOrmServiceRepository,
    },
  ],
  exports: [
    GetServicesUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
})
export class ServicesModule {} 