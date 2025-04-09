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
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ServiceList: React.FC = () => {
  const navigate = useNavigate();

  // ダミーデータ
  const services = [
    {
      id: '1',
      name: 'カット',
      price: 5000,
      duration: 60,
      category: 'ヘア',
      description: 'スタイリストによるカットサービス',
    },
    {
      id: '2',
      name: 'カラー',
      price: 8000,
      duration: 90,
      category: 'ヘア',
      description: 'スタイリストによるカラーリングサービス',
    },
    {
      id: '3',
      name: 'フェイシャル',
      price: 10000,
      duration: 60,
      category: 'エステ',
      description: 'プロフェッショナルによるフェイシャルケア',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">サービス一覧</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/services/new')}
        >
          新規サービス
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>サービス名</TableCell>
              <TableCell>カテゴリー</TableCell>
              <TableCell>料金</TableCell>
              <TableCell>所要時間</TableCell>
              <TableCell>説明</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>
                  <Chip label={service.category} color="primary" size="small" />
                </TableCell>
                <TableCell>¥{service.price.toLocaleString()}</TableCell>
                <TableCell>{service.duration}分</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceList; 