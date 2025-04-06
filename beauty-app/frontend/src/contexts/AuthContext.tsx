import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import { 
  AuthState, 
  AuthContextType, 
  LoginCredentials, 
  User, 
  AuthToken 
} from '../types/auth';

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
const AuthContext = createContext<AuthContextType | null>(null);

// APIのベースURL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// プロバイダーコンポーネント
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ログイン処理
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const { user, token } = response.data;

      // トークンをローカルストレージに保存
      localStorage.setItem('token', JSON.stringify(token));

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error instanceof Error ? error.message : '認証に失敗しました'
      });
      throw error;
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  // トークンリフレッシュ処理
  const refreshToken = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        throw new Error('リフレッシュトークンが見つかりません');
      }

      const { refreshToken } = JSON.parse(currentToken);
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newToken = response.data.token;
      localStorage.setItem('token', JSON.stringify(newToken));

      dispatch({ type: 'TOKEN_REFRESHED', payload: newToken });
    } catch (error) {
      dispatch({ type: 'AUTH_LOGOUT' });
      throw error;
    }
  }, []);

  // APIリクエストのインターセプター設定
  React.useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = state.token?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await refreshToken();
            const token = state.token?.accessToken;
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // クリーンアップ
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token, refreshToken]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 