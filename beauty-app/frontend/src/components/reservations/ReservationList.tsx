import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  Menu,
  MenuItem as MuiMenuItem,
  Link,
  AlertTitle,
  List as MuiList,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FixedSizeList, ListOnScrollProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { reservationApi, Reservation, GetReservationsParams, ReservationStatus } from '../../api/reservationApi';
import { customerApi, Customer } from '../../api/customerApi';
import { serviceApi, Service } from '../../api/serviceApi';
import { validateFilterForm, ValidationError } from '../../utils/validation';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV, exportToPDF } from '../../utils/export';
import { usePagination } from '../../hooks/usePagination';
import { useCache } from '../../hooks/useCache';
import { 
  logError, 
  getErrorStats, 
  ErrorLog, 
  exportErrorLogs,
  ErrorLogFilter,
  filterErrorLogs,
  searchErrorLogs,
  getErrorLogStats
} from '../../utils/errorLogging';
import { ja } from '../../locales/ja';
import DownloadIcon from '@mui/icons-material/Download';
import { ToastNotification } from '../common/ToastNotification';
import { createDefaultRecoveryStrategies } from '../../utils/errorRecovery';
import {
  Add as AddIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { notificationApi } from '../../api/notificationApi';

const getStatusColor = (status: Reservation['status']): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'primary';
    case 'cancelled':
      return 'error';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: ReservationStatus): string => {
  switch (status) {
    case 'pending':
      return '保留中';
    case 'confirmed':
      return '確認済み';
    case 'cancelled':
      return 'キャンセル';
    case 'completed':
      return '完了';
    default:
      return '不明';
  }
};

const ROW_HEIGHT = 53; // 1行の高さ（px）

interface VirtualizedTableProps {
  reservations: Reservation[];
  customers: Record<string, Customer>;
  services: Record<string, Service>;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
  onView: (reservation: Reservation) => void;
  onScroll: (props: ListOnScrollProps) => void;
  loading: boolean;
}

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({ 
  reservations, 
  customers, 
  services, 
  onEdit, 
  onDelete, 
  onView,
  onScroll,
  loading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderReservationRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const reservation = reservations[index];
    const customer = customers[reservation.customerId];
    const service = services[reservation.serviceId];

    return (
      <TableRow style={style}>
        <TableCell>{formatDateTime(reservation.dateTime)}</TableCell>
        <TableCell>{customer?.name || '読み込み中...'}</TableCell>
        <TableCell>{service?.name || '読み込み中...'}</TableCell>
        <TableCell>
          <Chip
            label={getStatusLabel(reservation.status)}
            color={getStatusColor(reservation.status)}
            size={isMobile ? "small" : "medium"}
            sx={{
              margin: '4px'
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => onEdit(reservation)}
            disabled={loading}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(reservation)}
            disabled={loading}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ height: 'calc(100vh - 300px)' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {!isMobile && <TableCell>開始日時</TableCell>}
            <TableCell>顧客名</TableCell>
            <TableCell>サービス</TableCell>
            <TableCell>ステータス</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                itemCount={reservations.length}
                itemSize={ROW_HEIGHT}
                width={width}
                onScroll={onScroll}
              >
                {renderReservationRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface ErrorState {
  message: string;
  code?: string;
  retryable: boolean;
  retryCount: number;
}

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 2000; // 2秒

export default function ReservationList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [services, setServices] = useState<Record<string, Service>>({});
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  const [errorStats, setErrorStats] = useState(getErrorStats());
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [showErrorStats, setShowErrorStats] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('json');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('error');
  const errorRecovery = useMemo(() => createDefaultRecoveryStrategies(), []);

  const { get: getCache, set: setCache } = useCache<{
    reservations: Reservation[];
    customers: Record<string, Customer>;
    services: Record<string, Service>;
    totalItems: number;
  }>();

  const {
    page,
    limit,
    totalPages,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
  } = usePagination({
    initialPage: 1,
    initialLimit: 10,
    totalItems,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [filters, setFilters] = useState<GetReservationsParams>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // デバウンスされたフィルター値
  const debouncedStartDate = useDebounce(filters.startDate, 500);
  const debouncedEndDate = useDebounce(filters.endDate, 500);
  const debouncedCustomerName = useDebounce(filters.customerName, 500);

  // リアルタイムバリデーション
  useEffect(() => {
    const errors = validateFilterForm(
      debouncedStartDate ? moment(debouncedStartDate) : null,
      debouncedEndDate ? moment(debouncedEndDate) : null,
      debouncedCustomerName || ''
    );
    setValidationErrors(errors);
  }, [debouncedStartDate, debouncedEndDate, debouncedCustomerName]);

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleError = useCallback(async (err: any, operation: string) => {
    const errorLog = logError(err, operation);
    const errorMessage = err.response?.data?.message || err.message || ja.errors.unexpected;
    const errorCode = err.response?.data?.code;
    const isRetryable = err.response?.status !== 400 && err.response?.status !== 404;

    // 自動リカバリーを試みる
    const recovered = await errorRecovery.handleError(err, operation);
    if (recovered) {
      showToast(`${operation}のリカバリーに成功しました`, 'success');
      return;
    }

    setError({
      message: `${ja.errors.operation[operation as keyof typeof ja.errors.operation] || operation}中にエラーが発生しました: ${errorMessage}`,
      code: errorCode,
      retryable: isRetryable,
      retryCount: 0
    });

    if (isRetryable) {
      const timeout = setTimeout(() => {
        setError(prev => {
          if (!prev) return null;
          if (prev.retryCount >= MAX_RETRY_COUNT) {
            return { ...prev, retryable: false };
          }
          return { ...prev, retryCount: prev.retryCount + 1 };
        });
      }, RETRY_DELAY);
      setRetryTimeout(timeout);
    }

    setErrorStats(getErrorStats());
    setErrorLogs([...errorLogs, errorLog]);
    showToast(errorMessage);
  }, [errorLogs, errorRecovery]);

  const handleRetry = useCallback(() => {
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      setRetryTimeout(null);
    }
    setError(null);
    loadMore();
  }, [retryTimeout]);

  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return;

    try {
      setIsFetching(true);
      const nextPage = page + 1;
      const response = await reservationApi.getReservations({
        ...filters,
        page: nextPage,
        limit,
      });

      if (response.reservations.length === 0) {
        setHasMore(false);
        return;
      }

      const newCustomers = response.reservations.reduce((acc: Record<string, Customer>, reservation: Reservation) => {
        acc[reservation.customerId] = reservation.customer;
        return acc;
      }, {});

      const newServices = response.reservations.reduce((acc: Record<string, Service>, reservation: Reservation) => {
        const service = reservation.service as Partial<Service>;
        acc[reservation.serviceId] = {
          id: service.id!,
          name: service.name!,
          description: service.description || '説明なし',
          duration: service.duration!,
          price: service.price!,
          category: service.category || 'その他'
        };
        return acc;
      }, {});

      setReservations(prev => [...prev, ...response.reservations]);
      setCustomers(prev => ({ ...prev, ...newCustomers }));
      setServices(prev => ({ ...prev, ...newServices }));
      setPage(nextPage);
    } catch (err) {
      handleError(err, 'データの取得');
    } finally {
      setIsFetching(false);
    }
  }, [page, limit, filters, hasMore, isFetching]);

  const handleScroll = useCallback((props: ListOnScrollProps) => {
    const { scrollOffset, scrollUpdateWasRequested } = props;
    if (scrollUpdateWasRequested) return;

    const { scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollOffset <= clientHeight * 1.5) {
      loadMore();
    }
  }, [loadMore]);

  const handleChangePage = async (event: unknown, newPage: number) => {
    try {
      setLoading(true);
      const response = await reservationApi.getReservations({
        ...filters,
        page: newPage + 1,
        limit,
      });

      const newCustomers = response.reservations.reduce((acc: Record<string, Customer>, reservation: Reservation) => {
        acc[reservation.customerId] = reservation.customer;
        return acc;
      }, {});

      const newServices = response.reservations.reduce((acc: Record<string, Service>, reservation: Reservation) => {
        const service = reservation.service as Partial<Service>;
        acc[reservation.serviceId] = {
          id: service.id!,
          name: service.name!,
          description: service.description || '説明なし',
          duration: service.duration!,
          price: service.price!,
          category: service.category || 'その他'
        };
        return acc;
      }, {});

      setReservations(response.reservations);
      setCustomers(prev => ({ ...prev, ...newCustomers }));
      setServices(prev => ({ ...prev, ...newServices }));
      setPage(newPage + 1);
      setHasMore(response.reservations.length === limit);
    } catch (err) {
      handleError(err, 'ページの切り替え');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    try {
      setLoading(true);
      const response = await reservationApi.getReservations({
        ...filters,
        page: 1,
        limit: newLimit,
      });

      const newCustomers = response.reservations.reduce((acc: Record<string, Customer>, reservation: Reservation) => {
        acc[reservation.customerId] = reservation.customer;
        return acc;
      }, {});

      const newServices = response.reservations.reduce((acc: Record<string, Service>, reservation: Reservation) => {
        const service = reservation.service as Partial<Service>;
        acc[reservation.serviceId] = {
          id: service.id!,
          name: service.name!,
          description: service.description || '説明なし',
          duration: service.duration!,
          price: service.price!,
          category: service.category || 'その他'
        };
        return acc;
      }, {});

      setReservations(response.reservations);
      setCustomers(newCustomers);
      setServices(newServices);
      setPage(1);
      setLimit(newLimit);
      setHasMore(response.reservations.length === newLimit);
    } catch (err) {
      handleError(err, '表示件数の変更');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reservation: Reservation) => {
    navigate(`/reservations/${reservation.id}/edit`);
  };

  const handleDeleteClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReservation) return;

    try {
      setLoading(true);
      await reservationApi.deleteReservation(selectedReservation.id);
      setReservations(prev =>
        prev.filter(reservation => reservation.id !== selectedReservation.id)
      );
      setDeleteDialogOpen(false);
      setSelectedReservation(null);

      const customer = customers[selectedReservation.customerId];
      const service = services[selectedReservation.serviceId];

      // メールアドレスが存在する場合のみ通知を送信
      if (customer?.email) {
        try {
          await notificationApi.sendReservationCancellation(
            selectedReservation.id,
            customer.email,
            customer.name,
            service?.name || '不明',
            selectedReservation.dateTime,
            '理由なし'
          );
        } catch (notificationError) {
          console.error('キャンセル通知の送信に失敗しました:', notificationError);
          // 通知の失敗は予約の削除を妨げない
        }
      } else {
        console.warn(`顧客 ${customer?.name} (ID: ${customer?.id}) のメールアドレスが設定されていません。キャンセル通知は送信されませんでした。`);
      }
    } catch (err) {
      handleError(err, '予約の削除');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof GetReservationsParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterApply = async () => {
    if (validationErrors.length > 0) return;

    try {
      setLoading(true);
      const response = await reservationApi.getReservations({
        ...filters,
        page: 1,
        limit,
      });

      const newCustomers = response.reservations.reduce((acc: Record<string, Customer>, reservation: Reservation) => {
        acc[reservation.customerId] = reservation.customer;
        return acc;
      }, {});

      const newServices = response.reservations.reduce((acc: Record<string, Service>, reservation: Reservation) => {
        const service = reservation.service as Partial<Service>;
        acc[reservation.serviceId] = {
          id: service.id!,
          name: service.name!,
          description: service.description || '説明なし',
          duration: service.duration!,
          price: service.price!,
          category: service.category || 'その他'
        };
        return acc;
      }, {});

      setReservations(response.reservations);
      setCustomers(newCustomers);
      setServices(newServices);
      setPage(1);
      setHasMore(response.reservations.length === limit);
      setFilterDialogOpen(false);
    } catch (err) {
      handleError(err, 'フィルターの適用');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterReset = () => {
    setFilters({});
    resetPagination();
    setFilterDialogOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const csvContent = exportToCSV(reservations, customers, services);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'reservations.csv';
      link.click();
      handleMenuClose();
    } catch (err) {
      handleError(err, 'CSVエクスポート');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      await exportToPDF(reservations, customers, services);
      handleMenuClose();
    } catch (err) {
      handleError(err, 'PDFエクスポート');
    } finally {
      setLoading(false);
    }
  };

  const handleExportErrorLogs = () => {
    try {
      const content = exportErrorLogs(exportFormat);
      const blob = new Blob([content], { 
        type: exportFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json' 
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `error_logs.${exportFormat}`;
      link.click();
    } catch (err) {
      handleError(err, 'エラーログのエクスポート');
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const cachedCustomer = customers[customerId];
      if (cachedCustomer) return cachedCustomer;

      const response = await customerApi.getCustomer(customerId);
      setCustomers(prev => ({ ...prev, [customerId]: response }));
      return response;
    } catch (err) {
      handleError(err, '顧客情報の取得');
      return null;
    }
  };

  const fetchServiceDetails = async (serviceId: string) => {
    try {
      const cachedService = services[serviceId];
      if (cachedService) return cachedService;

      const response = await serviceApi.getService(serviceId);
      setServices(prev => ({ ...prev, [serviceId]: response }));
      return response;
    } catch (err) {
      handleError(err, 'サービス情報の取得');
      return null;
    }
  };

  const [errorLogFilter, setErrorLogFilter] = useState<ErrorLogFilter>({});
  const [searchText, setSearchText] = useState('');
  const [filteredErrorLogs, setFilteredErrorLogs] = useState<ErrorLog[]>([]);

  useEffect(() => {
    let filtered = errorLogs;
    if (searchText) {
      filtered = searchErrorLogs(filtered, searchText);
    }
    if (Object.keys(errorLogFilter).length > 0) {
      filtered = filterErrorLogs(filtered, errorLogFilter);
    }
    setFilteredErrorLogs(filtered);
  }, [errorLogs, searchText, errorLogFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationApi.getReservations({
        page: page,
        limit: limit,
        ...filters
      });
      setReservations(response.reservations);
      setTotalItems(response.total);
    } catch (error) {
      console.error('予約の取得に失敗しました:', error);
      setError({
        message: '予約の取得に失敗しました',
        code: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
        retryable: true,
        retryCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && reservations.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">予約一覧</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate('/reservations/calendar')}
          >
            カレンダー表示
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/reservations/new')}
          >
            新規予約
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="検索"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as string)}
              label="ステータス"
            >
              <MenuItem value="">すべて</MenuItem>
              <MenuItem value="pending">予約済み</MenuItem>
              <MenuItem value="confirmed">確定</MenuItem>
              <MenuItem value="cancelled">キャンセル</MenuItem>
              <MenuItem value="completed">完了</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFilterDialogOpen(true)}
            fullWidth
            size={isMobile ? 'small' : 'medium'}
          >
            フィルター
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleMenuClose();
              handleExportErrorLogs();
            }}
            startIcon={<DownloadIcon />}
          >
            エクスポート
          </Button>
        </Grid>
      </Grid>

      <VirtualizedTable
        reservations={reservations}
        customers={customers}
        services={services}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onView={(reservation) => navigate(`/reservations/${reservation.id}`)}
        onScroll={handleScroll}
        loading={loading}
      />

      {isFetching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={isMobile ? '表示件数' : '1ページあたりの表示件数'}
        labelDisplayedRows={({ from, to, count }) =>
          isMobile
            ? `${from}-${to} / ${count}`
            : `${from}-${to} 件中 ${count !== -1 ? count : `${to}以上`} 件`
        }
      />

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>予約の削除</DialogTitle>
        <DialogContent>
          <Typography>
            この予約を削除してもよろしいですか？この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}