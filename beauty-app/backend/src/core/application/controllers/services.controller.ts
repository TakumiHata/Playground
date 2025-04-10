import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { GetServicesUseCase } from '../use-cases/services/get-services.use-case';
import { CreateServiceUseCase } from '../use-cases/services/create-service.use-case';
import { UpdateServiceUseCase } from '../use-cases/services/update-service.use-case';
import { DeleteServiceUseCase } from '../use-cases/services/delete-service.use-case';
import { CreateServiceRequestDto } from '../dto/services/create-service.dto';
import { UpdateServiceRequestDto } from '../dto/services/update-service.dto';
import { JwtAuthGuard } from '../../shared/auth/guards/jwt-auth.guard';
import { Roles } from '../../shared/auth/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(
    private readonly getServicesUseCase: GetServicesUseCase,
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  @Get()
  async getServices() {
    return this.getServicesUseCase.execute();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createService(@Body() createServiceDto: CreateServiceRequestDto) {
    return this.createServiceUseCase.execute(createServiceDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceRequestDto,
  ) {
    return this.updateServiceUseCase.execute(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteService(@Param('id') id: string) {
    return this.deleteServiceUseCase.execute(id);
  }
} 