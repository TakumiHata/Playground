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
import { useNavigate, useParams } from 'react-router-dom';
import { reservationApi, Reservation, UpdateReservationDto } from '../../api/reservationApi';
import { customerApi, Customer } from '../../api/customerApi';
import { serviceApi, Service } from '../../api/serviceApi';

export const ReservationEditForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [formData, setFormData] = useState<UpdateReservationDto>({
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reservationData, customersData, servicesData] = await Promise.all([
          reservationApi.getReservation(id!),
          customerApi.getCustomers(),
          serviceApi.getServices(),
        ]);
        setReservation(reservationData);
        setFormData({
          status: reservationData.status,
          notes: reservationData.notes || '',
        });
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
  }, [id]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await reservationApi.updateReservation(id!, formData);
      navigate('/reservations');
    } catch (err) {
      setError('予約の更新に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !reservation) {
    return <CircularProgress />;
  }

  if (!reservation) {
    return <Typography color="error">予約が見つかりません</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        予約の編集
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              顧客: {customers.find(c => c.id === reservation.customerId)?.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              サービス: {services.find(s => s.id === reservation.serviceId)?.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              日時: {new Date(reservation.dateTime).toLocaleString('ja-JP')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>ステータス</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="ステータス"
                required
              >
                <MenuItem value="pending">未確定</MenuItem>
                <MenuItem value="confirmed">確定</MenuItem>
                <MenuItem value="completed">完了</MenuItem>
                <MenuItem value="cancelled">キャンセル</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="備考"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
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
                {loading ? <CircularProgress size={24} /> : '更新する'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}; 