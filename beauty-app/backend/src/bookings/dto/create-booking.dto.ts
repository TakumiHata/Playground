import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  staffId: string;

  @IsDate()
  date: Date;

  @IsString()
  @IsOptional()
  notes?: string;
} 