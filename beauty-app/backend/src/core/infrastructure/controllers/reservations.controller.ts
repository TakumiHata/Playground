import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';
import { Roles } from '../../shared/auth/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { CreateReservationRequestDto } from '../../application/dto/create-reservation.dto';
import { UpdateReservationRequestDto } from '../../application/dto/update-reservation.dto';
import { CreateReservationUseCase } from '../../application/use-cases/reservations/create-reservation.use-case';
import { GetReservationsUseCase } from '../../application/use-cases/reservations/get-reservations.use-case';
import { UpdateReservationUseCase } from '../../application/use-cases/reservations/update-reservation.use-case';
import { DeleteReservationUseCase } from '../../application/use-cases/reservations/delete-reservation.use-case';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
  ) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  create(@Body() createReservationDto: CreateReservationRequestDto) {
    return this.createReservationUseCase.execute(createReservationDto);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  findAll() {
    return this.getReservationsUseCase.execute({});
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.getReservationsUseCase.execute({ id });
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationRequestDto,
  ) {
    return this.updateReservationUseCase.execute(id, updateReservationDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.deleteReservationUseCase.execute(id);
  }
} 