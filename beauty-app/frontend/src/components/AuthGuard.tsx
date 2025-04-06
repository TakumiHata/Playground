import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: User['role'][];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // ローディング中は何も表示しない
  if (isLoading) {
    return null;
  }

  // 未認証の場合はログインページにリダイレクト
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ロールチェック
  if (requiredRole && !requiredRole.includes(user.role)) {
    // 権限がない場合はホームページにリダイレクト
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 