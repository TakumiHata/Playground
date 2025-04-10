import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import { reservationApi, CreateReservationDto } from '../../api/reservationApi';
import { customerApi, Customer } from '../../api/customerApi';
import { serviceApi, Service } from '../../api/serviceApi';

export const ReservationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [formData, setFormData] = useState<CreateReservationDto>({
    customerId: '',
    serviceId: '',
    dateTime: location.state?.start?.toISOString() || new Date().toISOString(),
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersData, servicesData] = await Promise.all([
          customerApi.getCustomers(),
          serviceApi.getServices(),
        ]);
        setCustomers(customersData);
        setServices(servicesData);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (date: moment.Moment | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateTime: date.toISOString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await reservationApi.createReservation(formData);
      navigate('/reservations');
    } catch (err) {
      setError('予約の作成に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.customerId) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        新規予約
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>顧客</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                label="顧客"
                required
              >
                {customers.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.phone})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>サービス</InputLabel>
              <Select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                label="サービス"
                required
              >
                {services.map(service => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} ({service.duration}分) - ¥{service.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="日時"
                value={moment(formData.dateTime)}
                onChange={handleDateTimeChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="備考"
              name="notes"
              value={formData.notes}
              onChange={() => handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/reservations')}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '予約する'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}; 