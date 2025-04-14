import { IsString, IsDate, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

export class CreateReservationRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
} 