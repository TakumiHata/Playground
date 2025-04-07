import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { 
  AuthState, 
  AuthContextType, 
  LoginCredentials, 
  User, 
  AuthToken 
} from '../types/auth';
import { useAuth } from '../hooks/useAuth';

// 初期状態
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// アクションの型定義
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: AuthToken } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'TOKEN_REFRESHED'; payload: AuthToken };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
      };
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

// コンテキストの作成
const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

// APIのベースURL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// プロバイダーコンポーネント
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 