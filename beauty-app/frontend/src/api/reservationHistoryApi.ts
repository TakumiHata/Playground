import axios from 'axios';

export interface ReservationHistory {
  id: string;
  reservationId: string;
  changedAt: string;
  changedBy: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface GetReservationHistoryParams {
  startDate?: string;
  endDate?: string;
  changedBy?: string;
  field?: string;
}

const API_BASE_URL = '/api';

export const reservationHistoryApi = {
  // 特定の予約の履歴を取得
  getReservationHistory: async (reservationId: string): Promise<ReservationHistory[]> => {
    const response = await axios.get(`${API_BASE_URL}/reservations/${reservationId}/history`);
    return response.data;
  },

  // 予約履歴を検索
  searchReservationHistory: async (params: GetReservationHistoryParams): Promise<ReservationHistory[]> => {
    const response = await axios.get(`${API_BASE_URL}/reservations/history`, { params });
    return response.data;
  },

  // 予約履歴の統計情報を取得
  getReservationHistoryStats: async (): Promise<{
    totalChanges: number;
    changesByUser: { [key: string]: number };
    changesByField: { [key: string]: number };
    changesByDate: { [key: string]: number };
  }> => {
    const response = await axios.get(`${API_BASE_URL}/reservations/history/stats`);
    return response.data;
  },
}; 