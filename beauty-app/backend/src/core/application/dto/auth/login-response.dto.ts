import { UserRole } from '../../../domain/enums/user-role.enum';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export class LoginResponseDto {
  accessToken: string;
  user: UserResponseDto;
} 