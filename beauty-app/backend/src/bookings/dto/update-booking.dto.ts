import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsString()
  @IsOptional()
  staffId?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  notes?: string;
} 