import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../../../../domain/enums/user-role.enum';

@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 