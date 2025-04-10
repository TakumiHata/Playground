import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 