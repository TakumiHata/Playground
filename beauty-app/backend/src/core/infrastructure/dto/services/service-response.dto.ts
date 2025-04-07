import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../../domain/entities/service.entity';

export class ServiceResponseDto {
  @ApiProperty({
    description: 'サービスID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'サービス名',
    example: 'カット',
  })
  name: string;

  @ApiProperty({
    description: 'サービス説明',
    example: '髪の毛をカットします',
  })
  description: string;

  @ApiProperty({
    description: '価格',
    example: 5000,
  })
  price: number;

  @ApiProperty({
    description: '所要時間（分）',
    example: 60,
  })
  duration: number;

  @ApiProperty({
    description: 'アクティブ状態',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: '作成日時',
    example: '2024-03-20T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新日時',
    example: '2024-03-20T12:00:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(service: Service): ServiceResponseDto {
    const dto = new ServiceResponseDto();
    dto.id = service.id;
    dto.name = service.name;
    dto.description = service.description;
    dto.price = service.price;
    dto.duration = service.duration;
    dto.isActive = service.isActive;
    dto.createdAt = service.createdAt;
    dto.updatedAt = service.updatedAt;
    return dto;
  }
} 