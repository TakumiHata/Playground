import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../../../../domain/entities/reservation.entity';

export class UpdateReservationStatusRequestDto {
  @ApiProperty({ description: '予約ステータス', enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
} 