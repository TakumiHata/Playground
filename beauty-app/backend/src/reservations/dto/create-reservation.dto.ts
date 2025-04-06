import { IsString, IsDate, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsString()
  staffId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsString({ each: true })
  serviceIds: string[];
} 