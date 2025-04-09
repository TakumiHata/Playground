import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ダミーデータ
  const service = {
    id: '1',
    name: 'カット',
    price: 5000,
    duration: 60,
    category: 'ヘア',
    description: 'スタイリストによるカットサービス',
    requirements: '特になし',
    notes: '要予約\nカット後はスタイリングも承ります',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">サービス詳細</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/services')}
        >
          一覧に戻る
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="サービス名"
              value={service.name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>カテゴリー</InputLabel>
              <Select
                value={service.category}
                label="カテゴリー"
              >
                <MenuItem value="ヘア">ヘア</MenuItem>
                <MenuItem value="エステ">エステ</MenuItem>
                <MenuItem value="ネイル">ネイル</MenuItem>
                <MenuItem value="その他">その他</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="料金"
              type="number"
              value={service.price}
              variant="outlined"
              InputProps={{
                startAdornment: '¥',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="所要時間"
              type="number"
              value={service.duration}
              variant="outlined"
              InputProps={{
                endAdornment: '分',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="説明"
              value={service.description}
              multiline
              rows={2}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="必要条件"
              value={service.requirements}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="備考"
              value={service.notes}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              // 保存処理
              navigate('/services');
            }}
          >
            保存
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServiceDetail; 