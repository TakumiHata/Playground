import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsBoolean, IsOptional } from 'class-validator';

export class CreateServiceRequestDto {
  @ApiProperty({ description: 'サービス名' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'サービス説明' })
  @IsString()
  description: string;

  @ApiProperty({ description: '価格' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: '所要時間（分）' })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ description: 'アクティブ状態', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 