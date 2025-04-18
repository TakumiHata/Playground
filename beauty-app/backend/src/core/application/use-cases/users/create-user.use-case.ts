import { Injectable, Inject } from '@nestjs/common';
import { CreateUserRequestDto } from '../../../shared/dto/users/create-user-request.dto';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserRequestDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = User.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    return this.userRepository.create(user);
  }
} 