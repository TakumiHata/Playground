import { IsDate, IsOptional, IsString, IsEnum } from 'class-validator';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

export class UpdateReservationRequestDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  serviceId?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
} 