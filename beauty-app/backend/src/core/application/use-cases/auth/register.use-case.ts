import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { RegisterRequestDto } from '../../dto/register.dto';
import { UserAlreadyExistsException } from '../../../shared/domain/exceptions/auth.exception';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(registerDto: RegisterRequestDto) {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const user = await this.userRepository.create(registerDto);
    return user;
  }
} 