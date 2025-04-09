import axios from 'axios';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  customerId: string;
  serviceId: string;
  dateTime: string;
  status: ReservationStatus;
  notes?: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    description?: string;
    category?: string;
  };
  staff?: {
    id: string;
    name: string;
  };
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetReservationsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  customerName?: string;
}

export interface GetReservationsResponse {
  reservations: Reservation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateReservationDto {
  customerId: string;
  serviceId: string;
  dateTime: string;
  notes?: string;
}

export interface UpdateReservationDto {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface CancelReservationDto {
  reason: string;
}

const API_BASE_URL = '/api';

export const reservationApi = {
  // 予約一覧を取得
  getReservations: async (params: GetReservationsParams): Promise<GetReservationsResponse> => {
    const response = await axios.get('/reservations', { params });
    return response.data;
  },

  // 予約を取得
  getReservation: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/reservations/${id}`);
    return response.data;
  },

  // 予約を作成
  createReservation: async (data: CreateReservationDto) => {
    const response = await axios.post(`${API_BASE_URL}/reservations`, data);
    return response.data;
  },

  // 予約を更新
  updateReservation: async (id: string, data: UpdateReservationDto) => {
    const response = await axios.patch(`${API_BASE_URL}/reservations/${id}`, data);
    return response.data;
  },

  // 予約を削除
  deleteReservation: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/reservations/${id}`);
  },

  cancelReservation: async (id: string, reason: string): Promise<Reservation> => {
    const response = await axios.patch(`${API_BASE_URL}/reservations/${id}/cancel`, { reason });
    return response.data;
  },
}; 