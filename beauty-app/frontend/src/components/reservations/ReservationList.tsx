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
import { reservationApi, Reservation } from '../../api/reservationApi';
import { customerApi, Customer } from '../../api/customerApi';
import { serviceApi, Service } from '../../api/serviceApi';
import { validateFilterForm, ValidationError } from '../../utils/validation';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCSV, exportToPDF } from '../../utils/export';

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

interface FilterState {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  status: string;
  customerName: string;
}

export const ReservationList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [services, setServices] = useState<Record<string, Service>>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    status: '',
    customerName: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // デバウンスされたフィルター値
  const debouncedStartDate = useDebounce(filters.startDate, 500);
  const debouncedEndDate = useDebounce(filters.endDate, 500);
  const debouncedCustomerName = useDebounce(filters.customerName, 500);

  // リアルタイムバリデーション
  useEffect(() => {
    const errors = validateFilterForm(
      debouncedStartDate,
      debouncedEndDate,
      debouncedCustomerName
    );
    setValidationErrors(errors);
  }, [debouncedStartDate, debouncedEndDate, debouncedCustomerName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reservationsData, customersData, servicesData] = await Promise.all([
          reservationApi.getReservations(),
          customerApi.getCustomers(),
          serviceApi.getServices(),
        ]);

        setReservations(reservationsData);
        setCustomers(
          customersData.reduce((acc, customer) => {
            acc[customer.id] = customer;
            return acc;
          }, {} as Record<string, Customer>)
        );
        setServices(
          servicesData.reduce((acc, service) => {
            acc[service.id] = service;
            return acc;
          }, {} as Record<string, Service>)
        );
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleFilterChange = (name: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = async () => {
    if (validationErrors.length > 0) {
      return;
    }

    try {
      setLoading(true);
      const params: any = {};
      if (filters.startDate) {
        params.startDate = filters.startDate.format('YYYY-MM-DD');
      }
      if (filters.endDate) {
        params.endDate = filters.endDate.format('YYYY-MM-DD');
      }
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.customerName) {
        params.customerName = filters.customerName;
      }

      const data = await reservationApi.getReservations(params);
      setReservations(data);
      setPage(0);
      setFilterDialogOpen(false);
    } catch (err) {
      setError('フィルタリングに失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterReset = async () => {
    setFilters({
      startDate: null,
      endDate: null,
      status: '',
      customerName: '',
    });
    setValidationErrors([]);
    try {
      setLoading(true);
      const data = await reservationApi.getReservations();
      setReservations(data);
      setPage(0);
    } catch (err) {
      setError('データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
      setFilterDialogOpen(false);
    }
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
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">予約一覧</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setFilterDialogOpen(true)}>
            <FilterListIcon />
          </IconButton>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MuiMenuItem onClick={handleExportCSV}>CSVでエクスポート</MuiMenuItem>
            <MuiMenuItem onClick={handleExportPDF}>PDFでエクスポート</MuiMenuItem>
          </Menu>
        </Box>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>顧客名</TableCell>
              <TableCell>サービス</TableCell>
              <TableCell>日時</TableCell>
              <TableCell>料金</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/reservations/${reservation.id}`}
                      color="inherit"
                      underline="hover"
                    >
                      {customers[reservation.customerId]?.name || '不明'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {services[reservation.serviceId]?.name || '不明'}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.dateTime).toLocaleString('ja-JP')}
                  </TableCell>
                  <TableCell>
                    ¥{services[reservation.serviceId]?.price.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="詳細">
                        <IconButton
                          size="small"
                          component={RouterLink}
                          to={`/reservations/${reservation.id}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="編集">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(reservation)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="削除">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(reservation)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={reservations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="表示件数"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} / ${count}件`
        }
      />

      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>フィルター</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="開始日"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: validationErrors.some(error => error.field === 'dateRange'),
                      helperText: validationErrors.find(error => error.field === 'dateRange')?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="終了日"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: validationErrors.some(error => error.field === 'dateRange'),
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="ステータス"
                >
                  <MenuItem value="">すべて</MenuItem>
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
                label="顧客名"
                value={filters.customerName}
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
            onClick={handleFilterSubmit}
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
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}; 