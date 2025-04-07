import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../entities/user.schema';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async save(user: User): Promise<User> {
    const schema = this.toSchema(user);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const schema = this.toSchema(user as User);
    await this.repository.update(id, schema);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: UserSchema): User {
    const user = new User();
    user.id = schema.id;
    user.email = schema.email;
    user.password = schema.password;
    user.name = schema.name;
    user.role = schema.role;
    user.createdAt = schema.createdAt;
    user.updatedAt = schema.updatedAt;
    return user;
  }

  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    schema.id = user.id;
    schema.email = user.email;
    schema.password = user.password;
    schema.name = user.name;
    schema.role = user.role;
    schema.createdAt = user.createdAt;
    schema.updatedAt = user.updatedAt;
    return schema;
  }
} 