import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'staff';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // トークンが有効かどうかを確認
      authApi.verifyToken()
        .then((userData) => {
          setIsAuthenticated(true);
          setUser(userData);
          setIsLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (userData: RegisterData) => {
    // Implementation of register function
  };

  const updateUser = async (userData: Partial<User>) => {
    // Implementation of updateUser function
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Implementation of changePassword function
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, register, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 