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
  Chip,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotificationTemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ダミーデータ
  const template = {
    id: '1',
    name: '予約確認メール',
    type: 'email',
    subject: '【ご予約確認】{customerName}様のご予約について',
    content: `{customerName}様

ご予約ありがとうございます。
以下の内容でご予約を承りましたのでご確認ください。

日時：{dateTime}
サービス：{serviceName}
担当：{staffName}

ご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。`,
    variables: [
      { name: 'customerName', description: '顧客名' },
      { name: 'dateTime', description: '予約日時' },
      { name: 'serviceName', description: 'サービス名' },
      { name: 'staffName', description: 'スタッフ名' },
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">テンプレート詳細</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/notifications')}
        >
          一覧に戻る
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="テンプレート名"
              value={template.name}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>種類</InputLabel>
              <Select
                value={template.type}
                label="種類"
              >
                <MenuItem value="email">メール</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="件名"
              value={template.subject}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="本文"
              value={template.content}
              multiline
              rows={8}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          使用可能な変数
        </Typography>
        <Box sx={{ mb: 3 }}>
          {template.variables.map((variable) => (
            <Chip
              key={variable.name}
              label={`{${variable.name}} - ${variable.description}`}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              // 保存処理
              navigate('/notifications');
            }}
          >
            保存
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotificationTemplateDetail; 