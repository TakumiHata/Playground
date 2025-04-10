import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ReservationStatus } from '../../../../domain/enums/reservation-status.enum';
import { UserSchema } from './user.schema';
import { ServiceSchema } from './service.schema';

@Entity('reservations')
export class ReservationSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  serviceId: string;

  @Column({ nullable: true })
  staffId?: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'userId' })
  user: UserSchema;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'staffId' })
  staff?: UserSchema;

  @ManyToOne(() => ServiceSchema)
  @JoinColumn({ name: 'serviceId' })
  service: ServiceSchema;
} 