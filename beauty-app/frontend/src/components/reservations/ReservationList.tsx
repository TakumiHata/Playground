import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
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
import { reservationApi, Reservation, GetReservationsParams } from '../../api/reservationApi';
import { customerApi, Customer } from '../../api/customerApi';
import { serviceApi, Service } from '../../api/serviceApi';
import { validateFilterForm, ValidationError } from '../../utils/validation';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV, exportToPDF } from '../../utils/export';
import { usePagination } from '../../hooks/usePagination';
import { useCache } from '../../hooks/useCache';

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
  }
};

const getStatusLabel = (status: Reservation['status']) => {
  switch (status) {
    case 'pending':
      return '未確定';
    case 'confirmed':
      return '確定';
    case 'completed':
      return '完了';
    case 'cancelled':
      return 'キャンセル';
  }
};

export const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [services, setServices] = useState<Record<string, Service>>({});
  const [totalItems, setTotalItems] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // キャッシュキーの生成
        const cacheKey = `reservations:${JSON.stringify({ ...filters, page, limit })}`;
        
        // キャッシュからデータを取得
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          setReservations(cachedData.reservations);
          setCustomers(cachedData.customers);
          setServices(cachedData.services);
          setTotalItems(cachedData.totalItems);
          setLoading(false);
          return;
        }

        const response = await reservationApi.getReservations({
          ...filters,
          page,
          limit,
        });

        const newCustomers = response.data.reduce((acc, reservation) => {
          acc[reservation.customerId] = reservation.customer;
          return acc;
        }, {} as Record<string, Customer>);

        const newServices = response.data.reduce((acc, reservation) => {
          const service = reservation.service as Partial<Service>;
          if (!service.description || !service.category) {
            console.warn(`Service ${service.id} is missing required fields:`, {
              description: service.description,
              category: service.category
            });
          }
          
          acc[reservation.serviceId] = {
            id: service.id!,
            name: service.name!,
            description: service.description || '説明なし',
            duration: service.duration!,
            price: service.price!,
            category: service.category || 'その他'
          };
          return acc;
        }, {} as Record<string, Service>);

        setReservations(response.data);
        setCustomers(newCustomers);
        setServices(newServices);
        setTotalItems(response.total);

        // データをキャッシュに保存（5分間有効）
        setCache(cacheKey, {
          reservations: response.data,
          customers: newCustomers,
          services: newServices,
          totalItems: response.total,
        }, 5 * 60 * 1000);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, filters, getCache, setCache]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
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
    } catch (err) {
      setError('予約の削除に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  const handleFilterChange = (key: keyof GetReservationsParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterApply = () => {
    if (validationErrors.length > 0) return;
    resetPagination();
    setFilterDialogOpen(false);
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

  const handleExportCSV = () => {
    const csvContent = exportToCSV(reservations, customers, services);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reservations.csv';
    link.click();
    handleMenuClose();
  };

  const handleExportPDF = () => {
    exportToPDF(reservations, customers, services);
    handleMenuClose();
  };

  if (loading && reservations.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">予約一覧</Typography>
        <Box>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            フィルター
          </Button>
          <Button
            startIcon={<MoreVertIcon />}
            onClick={handleMenuClick}
          >
            エクスポート
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MuiMenuItem onClick={handleExportCSV}>CSVエクスポート</MuiMenuItem>
            <MuiMenuItem onClick={handleExportPDF}>PDFエクスポート</MuiMenuItem>
          </Menu>
        </Box>
      </Box>

      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>予約のフィルター</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="開始日"
                  value={filters.startDate ? moment(filters.startDate) : null}
                  onChange={(date) => handleFilterChange('startDate', date?.format('YYYY-MM-DD') || '')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: validationErrors.some(error => error.field === 'startDate'),
                      helperText: validationErrors.find(error => error.field === 'startDate')?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="終了日"
                  value={filters.endDate ? moment(filters.endDate) : null}
                  onChange={(date) => handleFilterChange('endDate', date?.format('YYYY-MM-DD') || '')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: validationErrors.some(error => error.field === 'endDate'),
                      helperText: validationErrors.find(error => error.field === 'endDate')?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="ステータス"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="pending">予約待ち</MenuItem>
                  <MenuItem value="confirmed">確定</MenuItem>
                  <MenuItem value="cancelled">キャンセル</MenuItem>
                  <MenuItem value="completed">完了</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="顧客名"
                fullWidth
                value={filters.customerName || ''}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
                error={validationErrors.some(error => error.field === 'customerName')}
                helperText={validationErrors.find(error => error.field === 'customerName')?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset}>リセット</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>キャンセル</Button>
          <Button
            onClick={handleFilterApply}
            variant="contained"
            disabled={validationErrors.length > 0}
          >
            適用
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>予約の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この予約を削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {loading && reservations.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>予約ID</TableCell>
              <TableCell>顧客名</TableCell>
              <TableCell>サービス</TableCell>
              <TableCell>日付</TableCell>
              <TableCell>時間</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>料金</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`/reservations/${reservation.id}`}>
                    {reservation.customer.name}
                  </Link>
                </TableCell>
                <TableCell>{reservation.service.name}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>
                  {reservation.startTime} - {reservation.endTime}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(reservation.status)}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>¥{reservation.service.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip title="編集">
                    <IconButton onClick={() => handleEdit(reservation)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="詳細">
                    <IconButton
                      component={RouterLink}
                      to={`/reservations/${reservation.id}`}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="削除">
                    <IconButton onClick={() => handleDeleteClick(reservation)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalItems}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="表示件数"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}件`
          }
        />
      </TableContainer>
    </Box>
  );
}; 