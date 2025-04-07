import axios from 'axios';

export interface ReservationHistory {
  id: string;
  reservationId: string;
  changedBy: string;
  changedAt: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export const reservationHistoryApi = {
  getReservationHistory: async (reservationId: string): Promise<ReservationHistory[]> => {
    const response = await axios.get(`/api/reservations/${reservationId}/history`);
    return response.data;
  },
}; 