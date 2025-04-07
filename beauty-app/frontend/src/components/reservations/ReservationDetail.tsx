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
import { ReservationHistory } from './ReservationHistory';
import { notificationApi } from '../../api/notificationApi';

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
        <Typography variant="h5">予約詳細</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            編集
          </Button>
          {reservation?.status !== 'cancelled' && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setCancelDialogOpen(true)}
            >
              キャンセル
            </Button>
          )}
        </Box>
      </Box>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="基本情報" />
          <Tab label="変更履歴" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Chip
                label={getStatusLabel(reservation.status)}
                color={getStatusColor(reservation.status)}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="顧客情報"
                    secondary={
                      <Box>
                        <Typography variant="body1">
                          {customer?.name || '不明'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer?.email || 'メールアドレスなし'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer?.phone || '電話番号なし'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="日時"
                    secondary={new Date(reservation.dateTime).toLocaleString('ja-JP')}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="サービス情報"
                    secondary={
                      <Box>
                        <Typography variant="body1">
                          {service?.name || '不明'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ¥{service?.price.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="メモ"
                    secondary={reservation.notes || 'メモなし'}
                  />
                </ListItem>
                {reservation.status === 'cancelled' && reservation.cancelReason && (
                  <>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <CancelIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="キャンセル理由"
                        secondary={reservation.cancelReason}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ReservationHistory />
        </TabPanel>
      </Paper>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>予約のキャンセル</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この予約をキャンセルしてもよろしいですか？
            この操作は取り消せません。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="キャンセル理由"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            disabled={cancelling}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCancelDialogOpen(false);
              setCancelReason('');
            }}
            disabled={cancelling}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            disabled={cancelling || !cancelReason.trim()}
          >
            {cancelling ? 'キャンセル中...' : '予約をキャンセル'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notificationSent}
        autoHideDuration={6000}
        onClose={() => setNotificationSent(false)}
        message="キャンセル通知を送信しました"
      />

      <Snackbar
        open={!!notificationError}
        autoHideDuration={6000}
        onClose={() => setNotificationError(null)}
      >
        <Alert severity="error" onClose={() => setNotificationError(null)}>
          {notificationError}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 