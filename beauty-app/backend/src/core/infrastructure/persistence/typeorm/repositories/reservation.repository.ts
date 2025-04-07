import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { IReservationRepository } from '../../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../../domain/entities/reservation.entity';
import { ReservationSchema } from '../entities/reservation.schema';

@Injectable()
export class TypeOrmReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationSchema)
    private readonly repository: Repository<ReservationSchema>,
  ) {}

  async findById(id: string): Promise<Reservation | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });
    return schemas.map(this.toDomain);
  }

  async findByStaffId(staffId: string): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: { staffId },
    });
    return schemas.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: { userId },
    });
    return schemas.map(this.toDomain);
  }

  async findByStaffIdAndDateRange(
    staffId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: {
        staffId,
        date: Between(startDate, endDate),
      },
    });
    return schemas.map(this.toDomain);
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Reservation[]> {
    const schemas = await this.repository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
    });
    return schemas.map(this.toDomain);
  }

  async findConflictingReservations(
    staffId: string,
    date: Date,
    durationInMinutes: number,
  ): Promise<Reservation[]> {
    const endDate = new Date(date.getTime() + durationInMinutes * 60000);
    const schemas = await this.repository.find({
      where: {
        staffId,
        date: Between(date, endDate),
      },
    });
    return schemas.map(this.toDomain);
  }

  async save(reservation: Reservation): Promise<void> {
    const schema = this.toSchema(reservation);
    await this.repository.save(schema);
  }

  async update(reservation: Reservation): Promise<void> {
    const schema = this.toSchema(reservation);
    await this.repository.update(schema.id, schema);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: ReservationSchema): Reservation {
    return Reservation.create({
      id: schema.id,
      userId: schema.userId,
      staffId: schema.staffId,
      serviceIds: schema.serviceIds,
      date: schema.date,
      status: schema.status,
      notes: schema.notes,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(domain: Reservation): ReservationSchema {
    const schema = new ReservationSchema();
    schema.id = domain.id;
    schema.userId = domain.userId;
    schema.staffId = domain.staffId;
    schema.serviceIds = domain.serviceIds;
    schema.date = domain.date;
    schema.status = domain.status;
    schema.notes = domain.notes;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
} 