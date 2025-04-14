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

  private toSchema(reservation: Reservation): ReservationSchema {
    const schema = new ReservationSchema();
    schema.id = reservation.id;
    schema.userId = reservation.userId;
    schema.serviceId = reservation.serviceId;
    schema.date = reservation.date;
    schema.startTime = reservation.startTime;
    schema.endTime = reservation.endTime;
    schema.status = reservation.status;
    schema.createdAt = reservation.createdAt || new Date();
    schema.updatedAt = reservation.updatedAt || new Date();

    if (reservation.user) {
      const userSchema = new UserSchema();
      userSchema.id = reservation.user.id || '';
      userSchema.email = reservation.user.email;
      userSchema.firstName = reservation.user.firstName || '';
      userSchema.lastName = reservation.user.lastName || '';
      userSchema.role = reservation.user.role;
      schema.user = userSchema;
    }

    if (reservation.service) {
      const serviceSchema = new ServiceSchema();
      serviceSchema.id = reservation.service.id || '';
      serviceSchema.name = reservation.service.name;
      serviceSchema.description = reservation.service.description || '';
      serviceSchema.price = reservation.service.price;
      serviceSchema.duration = reservation.service.duration;
      serviceSchema.isActive = reservation.service.isActive;
      schema.service = serviceSchema;
    }

    return schema;
  }

  private toDomain(schema: ReservationSchema): Reservation {
    const user = schema.user ? this.userSchemaToDomain(schema.user as UserSchema) : undefined;
    const service = schema.service ? this.serviceSchemaToDomain(schema.service as ServiceSchema) : undefined;

    return Reservation.create({
      userId: schema.userId,
      serviceId: schema.serviceId,
      date: schema.date,
      startTime: schema.startTime,
      endTime: schema.endTime,
      status: schema.status,
      user,
      service,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }, schema.id);
  }

  private userSchemaToDomain(schema: UserSchema): User {
    return User.create({
      email: schema.email,
      password: schema.password,
      firstName: schema.firstName || '',
      lastName: schema.lastName || '',
      role: schema.role,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }, schema.id);
  }

  private serviceSchemaToDomain(schema: ServiceSchema): Service {
    return Service.create({
      name: schema.name,
      description: schema.description || '',
      price: schema.price,
      duration: schema.duration,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }, schema.id);
  }
} 