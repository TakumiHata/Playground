import { Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { RegisterRequestDto } from '../../dto/auth/register-request.dto';
import { UserRole } from '../../../domain/enums/user-role.enum';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(registerDto: RegisterRequestDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = User.create({
      email: registerDto.email,
      password: registerDto.password,
      role: registerDto.role ?? UserRole.USER,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    return this.userRepository.create(user);
  }
} 