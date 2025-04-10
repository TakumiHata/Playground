import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from '../../../../domain/entities/reservation.entity';
import { IReservationRepository } from '../../../../domain/repositories/reservation.repository.interface';
import { ReservationSchema } from '../schemas/reservation.schema';

@Injectable()
export class TypeOrmReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationSchema)
    private readonly reservationRepository: Repository<ReservationSchema>,
  ) {}

  async create(reservation: Reservation): Promise<Reservation> {
    const schema = this.toSchema(reservation);
    const savedSchema = await this.reservationRepository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: string): Promise<Reservation | null> {
    const schema = await this.reservationRepository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<Reservation[]> {
    const schemas = await this.reservationRepository.find();
    return schemas.map(schema => this.toDomain(schema));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const schemas = await this.reservationRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
    });
    return schemas.map(schema => this.toDomain(schema));
  }

  async findByStaffId(staffId: string): Promise<Reservation[]> {
    const schemas = await this.reservationRepository.find({
      where: { staffId },
    });
    return schemas.map(schema => this.toDomain(schema));
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const schemas = await this.reservationRepository.find({
      where: { userId },
    });
    return schemas.map(schema => this.toDomain(schema));
  }

  async update(id: string, reservation: Reservation): Promise<Reservation> {
    const schema = this.toSchema(reservation);
    await this.reservationRepository.update(id, schema);
    const updatedSchema = await this.reservationRepository.findOne({ where: { id } });
    if (!updatedSchema) {
      throw new Error('Reservation not found after update');
    }
    return this.toDomain(updatedSchema);
  }

  async delete(id: string): Promise<void> {
    await this.reservationRepository.delete(id);
  }

  private toSchema(reservation: Reservation): ReservationSchema {
    const schema = new ReservationSchema();
    schema.userId = reservation.userId;
    schema.serviceId = reservation.serviceId;
    schema.staffId = reservation.staffId;
    schema.date = reservation.date;
    schema.startTime = reservation.startTime;
    schema.endTime = reservation.endTime;
    schema.status = reservation.status;
    schema.notes = reservation.notes;
    return schema;
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
    });
  }
} 