import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'ユーザーID', example: '1' })
  id: string;

  @ApiProperty({ description: 'ユーザー名', example: '山田太郎' })
  name: string;

  @ApiProperty({ description: 'メールアドレス', example: 'yamada@example.com' })
  email: string;

  @ApiProperty({ description: 'ユーザーロール', enum: ['ADMIN', 'USER'], example: 'USER' })
  role: string;

  @ApiProperty({ description: '作成日時', example: '2024-04-07T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2024-04-07T12:00:00Z' })
  updatedAt: Date;

  static fromDomain(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
} 