import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/auth/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { CreateReservationUseCase } from '../../application/use-cases/reservations/create-reservation.use-case';
import { GetReservationUseCase } from '../../application/use-cases/reservations/get-reservation.use-case';
import { ListReservationsUseCase } from '../../application/use-cases/reservations/list-reservations.use-case';
import { UpdateReservationUseCase } from '../../application/use-cases/reservations/update-reservation.use-case';
import { DeleteReservationUseCase } from '../../application/use-cases/reservations/delete-reservation.use-case';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';
import { UpdateReservationDto } from '../../application/dto/update-reservation.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly listReservationsUseCase: ListReservationsUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.USER)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.createReservationUseCase.execute(createReservationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAll() {
    return this.listReservationsUseCase.execute();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.getReservationUseCase.execute(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.updateReservationUseCase.execute(id, updateReservationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  remove(@Param('id') id: string) {
    return this.deleteReservationUseCase.execute(id);
  }
} 