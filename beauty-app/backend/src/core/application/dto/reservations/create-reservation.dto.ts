import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateReservationRequestDto {
  @IsString()
  serviceId: string;

  @IsString()
  @IsOptional()
  staffId?: string;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsOptional()
  notes?: string;
} 