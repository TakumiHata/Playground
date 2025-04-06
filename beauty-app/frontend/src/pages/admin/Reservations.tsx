import React from 'react';
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
  Button,
  Chip,
} from '@mui/material';

// 予約状態の型定義
type ReservationStatus = '予約済' | 'キャンセル' | '完了';

// 予約データの型定義
interface Reservation {
  id: string;
  customerName: string;
  service: string;
  dateTime: string;
  staff: string;
  status: ReservationStatus;
}

const ReservationManagement: React.FC = () => {
  // サンプルデータ
  const reservations: Reservation[] = [
    {
      id: '1',
      customerName: '田中太郎',
      service: 'カット＆カラー',
      dateTime: '2024-04-05 13:00',
      staff: '山田花子',
      status: '予約済',
    },
    {
      id: '2',
      customerName: '佐藤美咲',
      service: 'トリートメント',
      dateTime: '2024-04-05 15:00',
      staff: '鈴木一郎',
      status: '完了',
    },
    {
      id: '3',
      customerName: '高橋和子',
      service: 'ヘッドスパ',
      dateTime: '2024-04-05 17:00',
      staff: '山田花子',
      status: 'キャンセル',
    },
  ];

  // 状態に応じたチップの色を返す
  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case '予約済':
        return 'primary';
      case '完了':
        return 'success';
      case 'キャンセル':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        予約管理
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
          新規予約
        </Button>
        <Button variant="outlined">
          カレンダー表示
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>予約ID</TableCell>
              <TableCell>顧客名</TableCell>
              <TableCell>サービス</TableCell>
              <TableCell>日時</TableCell>
              <TableCell>担当者</TableCell>
              <TableCell>状態</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.service}</TableCell>
                <TableCell>{reservation.dateTime}</TableCell>
                <TableCell>{reservation.staff}</TableCell>
                <TableCell>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" sx={{ mr: 1 }}>
                    詳細
                  </Button>
                  <Button size="small" color="error">
                    キャンセル
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReservationManagement; 