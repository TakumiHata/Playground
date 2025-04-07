import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ReservationCalendar } from './components/reservations/ReservationCalendar';
import { ReservationForm } from './components/reservations/ReservationForm';
import { ReservationList } from './components/reservations/ReservationList';
import { ReservationEditForm } from './components/reservations/ReservationEditForm';
import { ReservationDetail } from './components/reservations/ReservationDetail';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import ReservationManagement from './pages/admin/Reservations';
import { AuthGuard } from './components/AuthGuard';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservations" element={<ReservationList />} />
            <Route path="/reservations/calendar" element={<ReservationCalendar />} />
            <Route path="/reservations/new" element={<ReservationForm />} />
            <Route path="/reservations/:id/edit" element={<ReservationEditForm />} />
            <Route path="/reservations/:id" element={<ReservationDetail />} />
            <Route path="/admin" element={
              <AuthGuard requiredRole={['admin']}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/reservations" element={<ReservationManagement />} />
                  </Routes>
                </Layout>
              </AuthGuard>
            } />
            <Route path="/" element={
              <AuthGuard>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </Layout>
              </AuthGuard>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}; 