import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../../domain/entities/service.entity';

export class ServiceResponseDto {
  @ApiProperty({ description: 'サービスID' })
  id: string;

  @ApiProperty({ description: 'サービス名' })
  name: string;

  @ApiProperty({ description: 'サービス説明' })
  description: string;

  @ApiProperty({ description: '価格' })
  price: number;

  @ApiProperty({ description: '所要時間（分）' })
  duration: number;

  @ApiProperty({ description: 'アクティブ状態' })
  isActive: boolean;

  @ApiProperty({ description: '作成日時' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時' })
  updatedAt: Date;

  static fromEntity(service: Service): ServiceResponseDto {
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