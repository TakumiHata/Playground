import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IReservationRepository } from '../../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../../domain/entities/reservation.entity';
import { ReservationSchema } from '../schemas/reservation.schema';
import { User } from '../../../../domain/entities/user.entity';
import { Service } from '../../../../domain/entities/service.entity';
import { UserSchema } from '../schemas/user.schema';
import { ServiceSchema } from '../schemas/service.schema';

@Injectable()
export class TypeOrmReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationSchema)
    private readonly repository: Repository<ReservationSchema>,
  ) {}

  async create(reservation: Reservation): Promise<Reservation> {
    const schema = this.toSchema(reservation);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Reservation | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Reservation[]> {
    const schemas = await this.repository.find();
    return schemas.map(schema => this.toDomain(schema));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });
    return schemas.map(schema => this.toDomain(schema));
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: { userId },
    });
    return schemas.map(schema => this.toDomain(schema));
  }

  async update(id: string, reservation: Reservation): Promise<Reservation> {
    const schema = this.toSchema(reservation);
    await this.repository.update(id, schema);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Reservation not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toSchema(reservation: Reservation): Omit<ReservationSchema, 'user' | 'staff' | 'service'> & {
    user?: Partial<UserSchema>;
    staff?: Partial<UserSchema>;
    service?: Partial<ServiceSchema>;
  } {
    const schema: Partial<ReservationSchema> = {
      id: reservation.id,
      userId: reservation.userId,
      serviceId: reservation.serviceId,
      staffId: reservation.staffId,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      notes: reservation.notes,
    };

    if (reservation.user) {
      schema.user = this.userDomainToSchema(reservation.user);
    }

    if (reservation.staff) {
      schema.staff = this.userDomainToSchema(reservation.staff);
    }

    if (reservation.service) {
      schema.service = this.serviceDomainToSchema(reservation.service);
    }

    return schema as Omit<ReservationSchema, 'user' | 'staff' | 'service'> & {
      user?: Partial<UserSchema>;
      staff?: Partial<UserSchema>;
      service?: Partial<ServiceSchema>;
    };
  }

  private toDomain(schema: ReservationSchema): Reservation {
    return Reservation.create({
      userId: schema.userId,
      serviceId: schema.serviceId,
      staffId: schema.staffId,
      date: schema.date,
      startTime: schema.startTime,
      endTime: schema.endTime,
      status: schema.status,
      notes: schema.notes,
      user: schema.user ? this.userSchemaToDomain(schema.user as UserSchema) : undefined,
      staff: schema.staff ? this.userSchemaToDomain(schema.staff as UserSchema) : undefined,
      service: schema.service ? this.serviceSchemaToDomain(schema.service as ServiceSchema) : undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }, schema.id);
  }

  private userSchemaToDomain(schema: UserSchema): User {
    return User.create({
      email: schema.email,
      password: schema.password,
      firstName: schema.firstName,
      lastName: schema.lastName,
      role: schema.role,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }, schema.id);
  }

  private userDomainToSchema(user: User): UserSchema {
    const schema = new UserSchema();
    if (user.id) {
      schema.id = user.id;
    }
    schema.email = user.email;
    schema.password = user.password;
    schema.firstName = user.firstName;
    schema.lastName = user.lastName;
    schema.role = user.role;
    schema.createdAt = user.createdAt;
    schema.updatedAt = user.updatedAt;
    return schema;
  }

  private serviceSchemaToDomain(schema: ServiceSchema): Service {
    return Service.create({
      name: schema.name,
      description: schema.description,
      price: schema.price,
      duration: schema.duration,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }, schema.id);
  }

  private serviceDomainToSchema(service: Service): Partial<ServiceSchema> {
    const schema = new ServiceSchema();
    schema.id = service.id;
    schema.name = service.name;
    schema.description = service.description;
    schema.price = service.price;
    schema.duration = service.duration;
    schema.isActive = service.isActive;
    schema.createdAt = service.createdAt;
    schema.updatedAt = service.updatedAt;
    return schema;
  }
} 