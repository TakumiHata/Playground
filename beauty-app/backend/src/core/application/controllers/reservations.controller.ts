import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GetReservationsUseCase } from '../use-cases/reservations/get-reservations.use-case';
import { CreateReservationUseCase, CreateReservationRequest } from '../use-cases/reservations/create-reservation.use-case';
import { UpdateReservationUseCase, UpdateReservationRequest } from '../use-cases/reservations/update-reservation.use-case';
import { DeleteReservationUseCase } from '../use-cases/reservations/delete-reservation.use-case';
import { CreateReservationRequestDto } from '../dto/reservations/create-reservation.dto';
import { UpdateReservationRequestDto } from '../dto/reservations/update-reservation.dto';
import { JwtAuthGuard } from '../../shared/auth/guards/jwt-auth.guard';
import { Roles } from '../../shared/auth/decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { RolesGuard } from '../../shared/auth/guards/roles.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
  ) {}

  @Get()
  async getReservations(
    @Request() req: RequestWithUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('staffId') staffId?: string,
  ) {
    return this.getReservationsUseCase.execute({
      userId: req.user.role === UserRole.USER ? req.user.id : undefined,
      staffId: req.user.role === UserRole.STAFF ? req.user.id : staffId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Post()
  async createReservation(
    @Request() req: RequestWithUser,
    @Body() createReservationDto: CreateReservationRequestDto,
  ) {
    const request: CreateReservationRequest = {
      userId: req.user.id,
      serviceId: createReservationDto.serviceId,
      staffId: createReservationDto.staffId,
      date: new Date(createReservationDto.date),
      startTime: new Date(createReservationDto.startTime),
      endTime: new Date(createReservationDto.endTime),
      notes: createReservationDto.notes,
    };

    return this.createReservationUseCase.execute(request);
  }

  @Put(':id')
  async updateReservation(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationRequestDto,
  ) {
    const request: UpdateReservationRequest = {
      serviceId: updateReservationDto.serviceId,
      staffId: updateReservationDto.staffId,
      date: updateReservationDto.date ? new Date(updateReservationDto.date) : undefined,
      startTime: updateReservationDto.startTime ? new Date(updateReservationDto.startTime) : undefined,
      endTime: updateReservationDto.endTime ? new Date(updateReservationDto.endTime) : undefined,
      status: updateReservationDto.status,
      notes: updateReservationDto.notes,
    };

    return this.updateReservationUseCase.execute(id, request);
  }

  @Delete(':id')
  async deleteReservation(@Param('id') id: string) {
    return this.deleteReservationUseCase.execute(id);
  }
} 