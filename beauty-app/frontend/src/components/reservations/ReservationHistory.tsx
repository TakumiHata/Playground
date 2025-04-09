import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useParams } from 'react-router-dom';
import { reservationHistoryApi, type ReservationHistory, type GetReservationHistoryParams } from '../../api/reservationHistoryApi';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';

const getFieldIcon = (field: string) => {
  switch (field) {
    case 'customerId':
      return <PersonIcon />;
    case 'dateTime':
      return <EventIcon />;
    case 'serviceId':
      return <AttachMoneyIcon />;
    case 'notes':
      return <DescriptionIcon />;
    default:
      return <HistoryIcon />;
  }
};

const getFieldLabel = (field: string): string => {
  switch (field) {
    case 'customerId':
      return '顧客';
    case 'dateTime':
      return '日時';
    case 'serviceId':
      return 'サービス';
    case 'notes':
      return 'メモ';
    case 'status':
      return 'ステータス';
    default:
      return field;
  }
};

const formatValue = (field: string, value: any): string => {
  if (value === null || value === undefined) {
    return 'なし';
  }

  switch (field) {
    case 'dateTime':
      return new Date(value).toLocaleString('ja-JP');
    case 'status':
      return getStatusLabel(value);
    default:
      return String(value);
  }
};

const getStatusLabel = (status: string): string => {
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
      return status;
  }
};

export const ReservationHistoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ReservationHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await reservationHistoryApi.getReservationHistory(id);
        setHistory(data);
      } catch (err) {
        setError('履歴の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (history.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        履歴がありません
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        変更履歴
      </Typography>
      <List>
        {history.map((record) => (
          <React.Fragment key={record.id}>
            <ListItem>
              <ListItemText
                primary={
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Typography variant="subtitle1">
                        {new Date(record.changedAt).toLocaleString('ja-JP')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        label={record.changedBy}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                }
                secondary={
                  <List disablePadding>
                    {record.changes.map((change, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon>{getFieldIcon(change.field)}</ListItemIcon>
                        <ListItemText
                          primary={getFieldLabel(change.field)}
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                              >
                                変更前: {formatValue(change.field, change.oldValue)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                                sx={{ ml: 1 }}
                              >
                                変更後: {formatValue(change.field, change.newValue)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}; 