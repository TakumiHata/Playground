import { Entity } from './entity';

export interface ServiceProps {
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Service extends Entity<ServiceProps> {
  private constructor(props: ServiceProps, id?: string) {
    super(props, id);
  }

  public static create(props: ServiceProps, id?: string): Service {
    const service = new Service(props, id);
    return service;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get duration(): number {
    return this.props.duration;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }
} 