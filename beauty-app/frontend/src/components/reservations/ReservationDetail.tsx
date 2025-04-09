import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate, useParams } from 'react-router-dom';
import { reservationApi, Reservation } from '../../api/reservationApi';
import { customerApi, Customer } from '../../api/customerApi';
import { serviceApi, Service } from '../../api/serviceApi';
import { ReservationHistoryView } from './ReservationHistory';
import { notificationApi } from '../../api/notificationApi';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const getStatusColor = (status: Reservation['status']) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'success';
    case 'completed':
      return 'default';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Reservation['status']): string => {
  switch (status) {
    case 'pending':
      return '未確定';
    case 'confirmed':
      return '確定';
    case 'completed':
      return '完了';
    case 'cancelled':
      return 'キャンセル';
    default:
      return '不明';
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reservation-tabpanel-${index}`}
      aria-labelledby={`reservation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [reservationData, customerData, serviceData] = await Promise.all([
          reservationApi.getReservation(id),
          customerApi.getCustomer(id),
          serviceApi.getService(id),
        ]);

        setReservation(reservationData);
        setCustomer(customerData);
        setService(serviceData);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    if (reservation) {
      navigate(`/reservations/${reservation.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!reservation) return;

    try {
      setLoading(true);
      await reservationApi.deleteReservation(reservation.id);
      navigate('/reservations');
    } catch (err) {
      setError('予約の削除に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCancel = async () => {
    if (!reservation || !customer) return;

    try {
      setCancelling(true);
      const updatedReservation = await reservationApi.cancelReservation(reservation.id, cancelReason);
      setReservation(updatedReservation);

      // 通知を送信
      try {
        await notificationApi.sendReservationCancellation(
          reservation.id,
          customer.email,
          customer.name,
          service?.name || '不明',
          reservation.dateTime,
          cancelReason
        );
        setNotificationSent(true);
      } catch (err) {
        console.error('通知の送信に失敗しました:', err);
        setNotificationError('通知の送信に失敗しました');
      }

      setCancelDialogOpen(false);
      setCancelReason('');
    } catch (err) {
      setError('予約のキャンセルに失敗しました');
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !reservation) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || '予約が見つかりません'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">予約詳細</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reservations')}
        >
          一覧に戻る
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="顧客名"
              value={reservation.customer.name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="電話番号"
              value={reservation.customer.phone}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="サービス"
              value={reservation.service.name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="担当者"
              value={reservation.staff?.name || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="予約日時"
              type="datetime-local"
              value={reservation.dateTime}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={reservation.status}
                label="ステータス"
              >
                <MenuItem value="confirmed">確定</MenuItem>
                <MenuItem value="pending">未確定</MenuItem>
                <MenuItem value="cancelled">キャンセル</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          label="メモ"
          value={reservation.notes}
          multiline
          rows={4}
          variant="outlined"
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              // 保存処理
              navigate('/reservations');
            }}
          >
            保存
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReservationDetail; 