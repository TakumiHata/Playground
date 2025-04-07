import axios from 'axios';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
}

const API_BASE_URL = '/api';

export const serviceApi = {
  // サービス一覧を取得
  getServices: async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const response = await axios.get(`${API_BASE_URL}/services`, { params });
    return response.data;
  },

  // サービスを取得
  getService: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/services/${id}`);
    return response.data;
  },

  // サービスを作成
  createService: async (data: CreateServiceDto) => {
    const response = await axios.post(`${API_BASE_URL}/services`, data);
    return response.data;
  },

  // サービスを更新
  updateService: async (id: string, data: UpdateServiceDto) => {
    const response = await axios.patch(`${API_BASE_URL}/services/${id}`, data);
    return response.data;
  },

  // サービスを削除
  deleteService: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/services/${id}`);
  },
}; 