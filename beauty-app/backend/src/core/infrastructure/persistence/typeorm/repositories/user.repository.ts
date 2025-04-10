import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserSchema } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
  ) {}

  async create(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const hashedPassword = await bcrypt.hash(schema.password, 10);
    schema.password = hashedPassword;
    const savedSchema = await this.userRepository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.userRepository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.userRepository.findOne({ where: { email } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<User[]> {
    const schemas = await this.userRepository.find();
    return schemas.map(schema => this.toDomain(schema));
  }

  async update(id: string, user: User): Promise<User> {
    const schema = this.toSchema(user);
    await this.userRepository.update(id, schema);
    const updatedSchema = await this.userRepository.findOne({ where: { id } });
    if (!updatedSchema) {
      throw new Error('User not found after update');
    }
    return this.toDomain(updatedSchema);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    schema.email = user.email;
    schema.password = user.password;
    schema.role = user.role;
    schema.firstName = user.firstName;
    schema.lastName = user.lastName;
    return schema;
  }

  private toDomain(schema: UserSchema): User {
    return User.create({
      email: schema.email,
      password: schema.password,
      role: schema.role,
      firstName: schema.firstName,
      lastName: schema.lastName,
    });
  }
} 