import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ReservationList from './components/reservations/ReservationList';
import ReservationDetail from './components/reservations/ReservationDetail';
import CustomerList from './components/customers/CustomerList';
import CustomerDetail from './components/customers/CustomerDetail';
import ServiceList from './components/services/ServiceList';
import ServiceDetail from './components/services/ServiceDetail';
import NotificationTemplateList from './components/notifications/NotificationTemplateList';
import NotificationTemplateDetail from './components/notifications/NotificationTemplateDetail';
import PrivateRoute from './components/auth/PrivateRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="reservations">
                <Route index element={<ReservationList />} />
                <Route path=":id" element={<ReservationDetail />} />
              </Route>
              <Route path="customers">
                <Route index element={<CustomerList />} />
                <Route path=":id" element={<CustomerDetail />} />
              </Route>
              <Route path="services">
                <Route index element={<ServiceList />} />
                <Route path=":id" element={<ServiceDetail />} />
              </Route>
              <Route path="notifications">
                <Route index element={<NotificationTemplateList />} />
                <Route path=":id" element={<NotificationTemplateDetail />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 