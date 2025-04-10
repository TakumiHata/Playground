import { UserRole } from '../../../domain/enums/user-role.enum';

export class LoginResponseDto {
  id: string;
  email: string;
  role: UserRole;
  accessToken: string;
} 