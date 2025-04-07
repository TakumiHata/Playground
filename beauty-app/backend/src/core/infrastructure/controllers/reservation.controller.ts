import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user.entity';
import { CreateReservationUseCase } from '../../application/use-cases/reservations/create-reservation.use-case';
import { GetReservationsUseCase } from '../../application/use-cases/reservations/get-reservations.use-case';
import { GetReservationUseCase } from '../../application/use-cases/reservations/get-reservation.use-case';
import { UpdateReservationStatusUseCase } from '../../application/use-cases/reservations/update-reservation-status.use-case';
import { DeleteReservationUseCase } from '../../application/use-cases/reservations/delete-reservation.use-case';
import { CreateReservationRequestDto } from '../dto/reservations/create-reservation-request.dto';
import { UpdateReservationStatusRequestDto } from '../dto/reservations/update-reservation-status-request.dto';
import { ReservationResponseDto } from '../dto/reservations/reservation-response.dto';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
  ) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: '予約を作成する' })
  @ApiResponse({ status: 201, description: '予約が作成されました', type: ReservationResponseDto })
  async createReservation(@Body() request: CreateReservationRequestDto): Promise<ReservationResponseDto> {
    const reservation = await this.createReservationUseCase.execute(request);
    return ReservationResponseDto.fromEntity(reservation);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '予約一覧を取得する' })
  @ApiResponse({ status: 200, description: '予約一覧', type: [ReservationResponseDto] })
  async getReservations(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('staffId') staffId?: string,
    @Query('userId') userId?: string,
  ): Promise<ReservationResponseDto[]> {
    const reservations = await this.getReservationsUseCase.execute({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      staffId,
      userId,
    });
    return reservations.map(reservation => ReservationResponseDto.fromEntity(reservation));
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '予約詳細を取得する' })
  @ApiResponse({ status: 200, description: '予約詳細', type: ReservationResponseDto })
  async getReservation(@Param('id') id: string): Promise<ReservationResponseDto> {
    const reservation = await this.getReservationUseCase.execute(id);
    return ReservationResponseDto.fromEntity(reservation);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '予約のステータスを更新する' })
  @ApiResponse({ status: 200, description: '予約のステータスが更新されました', type: ReservationResponseDto })
  async updateReservationStatus(
    @Param('id') id: string,
    @Body() request: UpdateReservationStatusRequestDto,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.updateReservationStatusUseCase.execute({
      id,
      status: request.status,
    });
    return ReservationResponseDto.fromEntity(reservation);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '予約を削除する' })
  @ApiResponse({ status: 200, description: '予約が削除されました' })
  async deleteReservation(@Param('id') id: string): Promise<void> {
    await this.deleteReservationUseCase.execute(id);
  }
} 