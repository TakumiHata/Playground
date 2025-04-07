import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateServiceRequestDto {
  @ApiProperty({ description: 'サービス名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'サービス説明', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '価格', required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: '所要時間（分）', required: false })
  @IsOptional()
  @IsNumber()
  durationInMinutes?: number;

  @ApiProperty({ description: 'アクティブ状態', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 