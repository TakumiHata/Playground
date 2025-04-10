import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateServiceRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 