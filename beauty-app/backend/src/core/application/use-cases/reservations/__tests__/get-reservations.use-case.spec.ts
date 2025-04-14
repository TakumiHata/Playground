import { Test, TestingModule } from '@nestjs/testing';
import { GetReservationsUseCase } from '../get-reservations.use-case';
import { IReservationRepository } from '../../../../domain/repositories/reservation.repository.interface';
import { Reservation } from '../../../../domain/entities/reservation.entity';
import { User } from '../../../../domain/entities/user.entity';
import { Service } from '../../../../domain/entities/service.entity';
import { UserRole } from '../../../../domain/enums/user-role.enum';
import { ReservationStatus } from '../../../../domain/enums/reservation-status.enum';

describe('GetReservationsUseCase', () => {
  let useCase: GetReservationsUseCase;
  let mockReservationRepository: jest.Mocked<IReservationRepository>;

  const mockUser = User.create({
    email: 'test@example.com',
    password: 'password',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
  });

  const mockService = Service.create({
    name: 'Test Service',
    description: 'Test Description',
    price: 100,
    duration: 60,
    isActive: true,
  });

  const mockReservation = Reservation.create({
    userId: mockUser.id,
    serviceId: mockService.id,
    date: new Date(),
    startTime: new Date('2024-01-01T10:00:00Z'),
    endTime: new Date('2024-01-01T11:00:00Z'),
    status: ReservationStatus.PENDING,
    user: mockUser,
    service: mockService,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetReservationsUseCase,
        {
          provide: 'IReservationRepository',
          useValue: {
            findAll: jest.fn(),
            findByDateRange: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetReservationsUseCase>(GetReservationsUseCase);
    mockReservationRepository = module.get('IReservationRepository');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return all reservations when no filters are provided', async () => {
    mockReservationRepository.findAll.mockResolvedValue([mockReservation]);

    const result = await useCase.execute({});

    expect(result).toEqual([mockReservation]);
    expect(mockReservationRepository.findAll).toHaveBeenCalled();
  });

  it('should return reservations by date range', async () => {
    const startDate = new Date();
    const endDate = new Date();
    mockReservationRepository.findByDateRange.mockResolvedValue([mockReservation]);

    const result = await useCase.execute({ startDate, endDate });

    expect(result).toEqual([mockReservation]);
    expect(mockReservationRepository.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
  });

  it('should return reservations by user ID', async () => {
    mockReservationRepository.findByUserId.mockResolvedValue([mockReservation]);

    const result = await useCase.execute({ userId: mockUser.id });

    expect(result).toEqual([mockReservation]);
    expect(mockReservationRepository.findByUserId).toHaveBeenCalledWith(mockUser.id);
  });
}); 