import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../domain/enums/role.enum';
import { CreateServiceRequestDto } from '../dto/services/create-service-request.dto';
import { UpdateServiceRequestDto } from '../dto/services/update-service-request.dto';
import { ServiceResponseDto } from '../dto/services/service-response.dto';
import { CreateServiceUseCase } from '../../application/use-cases/services/create-service.use-case';
import { GetServiceUseCase } from '../../application/use-cases/services/get-service.use-case';
import { GetAllServicesUseCase } from '../../application/use-cases/services/get-all-services.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/services/delete-service.use-case';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly getServiceUseCase: GetServiceUseCase,
    private readonly getAllServicesUseCase: GetAllServicesUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully', type: ServiceResponseDto })
  async createService(@Body() dto: CreateServiceRequestDto): Promise<ServiceResponseDto> {
    const service = await this.createServiceUseCase.execute(dto);
    return ServiceResponseDto.fromDomain(service);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Service found', type: ServiceResponseDto })
  async getService(@Param('id') id: string): Promise<ServiceResponseDto> {
    const service = await this.getServiceUseCase.execute(id);
    return ServiceResponseDto.fromDomain(service);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'List of services', type: [ServiceResponseDto] })
  async getAllServices(): Promise<ServiceResponseDto[]> {
    const services = await this.getAllServicesUseCase.execute();
    return services.map(ServiceResponseDto.fromDomain);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully', type: ServiceResponseDto })
  async updateService(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.updateServiceUseCase.execute(id, dto);
    return ServiceResponseDto.fromDomain(service);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 204, description: 'Service deleted successfully' })
  async deleteService(@Param('id') id: string): Promise<void> {
    await this.deleteServiceUseCase.execute(id);
  }
} 