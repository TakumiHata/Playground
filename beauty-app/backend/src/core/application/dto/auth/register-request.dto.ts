import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password123', minLength: 6 })
  password: string;

  @IsString()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole = UserRole.USER;
} 