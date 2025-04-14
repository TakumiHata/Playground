import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ description: 'ユーザーID', example: '1' })
  id: string;

  @ApiProperty({ description: 'ユーザー名', example: '山田太郎' })
  firstName: string;

  @ApiProperty({ description: 'ユーザー名', example: '山田太郎' })
  lastName: string;

  @ApiProperty({ description: 'メールアドレス', example: 'yamada@example.com' })
  email: string;

  @ApiProperty({ description: 'ユーザーロール', enum: ['ADMIN', 'USER'], example: 'USER' })
  role: UserRole;

  @ApiProperty({ description: '作成日時', example: '2024-04-07T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: '更新日時', example: '2024-04-07T12:00:00Z' })
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.role = user.role;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
} 