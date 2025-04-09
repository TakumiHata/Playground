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
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ダミーデータ
  const customer = {
    id: '1',
    name: '山田 太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    address: '東京都渋谷区神宮前1-1-1',
    birthday: '1990-01-01',
    memo: 'アレルギー：なし\n要望：カットの際は耳周りを短めに',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">顧客詳細</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
        >
          一覧に戻る
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="名前"
              value={customer.name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="メールアドレス"
              value={customer.email}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="電話番号"
              value={customer.phone}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="住所"
              value={customer.address}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="生年月日"
              value={customer.birthday}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          label="メモ"
          value={customer.memo}
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
              navigate('/customers');
            }}
          >
            保存
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerDetail; 