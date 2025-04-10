import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  role?: UserRole;
} 