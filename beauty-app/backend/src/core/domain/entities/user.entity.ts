import { Entity } from './entity';
import { UserRole } from '../enums/user-role.enum';

export interface UserProps {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): User {
    const user = new User(props, id);
    return user;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get name(): string {
    return this.props.name || `${this.props.firstName || ''} ${this.props.lastName || ''}`.trim();
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }
} 