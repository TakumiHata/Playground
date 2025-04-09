import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface LoginResponse {
  token: string;
  user: User;
}

const API_BASE_URL = '/api';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  },

  verifyToken: async (): Promise<User> => {
    const response = await axios.get(`${API_BASE_URL}/auth/verify`);
    return response.data;
  },
}; 