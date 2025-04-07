import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { hash } from 'bcrypt';
import { RegisterRequestDto } from '../../dto/register.dto';
import { UserAlreadyExistsException } from '../../../shared/domain/exceptions/auth.exception';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: RegisterRequestDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await hash(request.password, 10);

    const user = User.create({
      email: request.email,
      password: hashedPassword,
      name: request.name,
      role: request.role,
    });

    await this.userRepository.save(user);

    return user;
  }
} 