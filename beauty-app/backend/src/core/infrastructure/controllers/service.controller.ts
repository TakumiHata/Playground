import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user.entity';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServicesUseCase } from '../../application/use-cases/services/get-services.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';
import { CreateServiceRequestDto } from '../dto/services/create-service-request.dto';
import { UpdateServiceRequestDto } from '../dto/services/update-service-request.dto';
import { ServiceResponseDto } from '../dto/services/service-response.dto';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'サービスを作成する' })
  @ApiResponse({ status: 201, description: 'サービスが作成されました', type: ServiceResponseDto })
  async createService(@Body() request: CreateServiceRequestDto): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(request);
    return ServiceResponseDto.fromEntity(service);
  }

  @Get()
  @ApiOperation({ summary: 'サービス一覧を取得する' })
  @ApiResponse({ status: 200, description: 'サービス一覧', type: [ServiceResponseDto] })
  async getServices(): Promise<ServiceResponseDto[]> {
    const services = await this.getServicesUseCase.execute();
    return services.map(service => ServiceResponseDto.fromEntity(service));
  }

  @Get(':id')
  @ApiOperation({ summary: 'サービス詳細を取得する' })
  @ApiResponse({ status: 200, description: 'サービス詳細', type: ServiceResponseDto })
  async getService(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.getServiceUseCase.execute(id);
    return ServiceResponseDto.fromEntity(service);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'サービスを更新する' })
  @ApiResponse({ status: 200, description: 'サービスが更新されました', type: ServiceResponseDto })
  async updateService(
    @Param('id') id: string,
    @Body() request: UpdateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute(id, request);
    return ServiceResponseDto.fromEntity(service);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'サービスを削除する' })
  @ApiResponse({ status: 200, description: 'サービスが削除されました' })
  async deleteService(@Param('id') id: string): Promise<void> {
    await this.deleteServiceUseCase.execute(id);
  }
} 