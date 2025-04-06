import { IsString, IsDate, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto {
  @IsString()
  @IsOptional()
  staffId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serviceIds?: string[];
} 