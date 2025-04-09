import axios from 'axios';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const API_BASE_URL = '/api';

export const customerApi = {
  // 顧客一覧を取得
  getCustomers: async (params?: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    const response = await axios.get(`${API_BASE_URL}/customers`, { params });
    return response.data;
  },

  // 顧客を取得
  getCustomer: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  },

  // 顧客を作成
  createCustomer: async (data: CreateCustomerDto) => {
    const response = await axios.post(`${API_BASE_URL}/customers`, data);
    return response.data;
  },

  // 顧客を更新
  updateCustomer: async (id: string, data: UpdateCustomerDto) => {
    const response = await axios.patch(`${API_BASE_URL}/customers/${id}`, data);
    return response.data;
  },

  // 顧客を削除
  deleteCustomer: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/customers/${id}`);
  },
}; 