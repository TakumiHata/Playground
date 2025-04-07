import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateServiceUseCase, CreateServiceRequest } from '../../application/use-cases/services/create-service.use-case';
import { UpdateServiceUseCase, UpdateServiceRequest } from '../../application/use-cases/services/update-service.use-case';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../domain/entities/user.entity';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'サービスを作成' })
  @ApiResponse({ status: 201, description: '作成成功' })
  async createService(@Body() request: CreateServiceRequest) {
    const service = await this.createServiceUseCase.execute(request);
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'サービスを更新' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateService(
    @Param('id') id: string,
    @Body() request: Omit<UpdateServiceRequest, 'id'>,
  ) {
    const service = await this.updateServiceUseCase.execute({
      id,
      ...request,
    });
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    };
  }
} 