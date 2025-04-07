import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          ダッシュボード
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          ログアウト
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ユーザー情報
            </Typography>
            <Typography>名前: {user?.name}</Typography>
            <Typography>メール: {user?.email}</Typography>
            <Typography>権限: {user?.role}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              クイックアクセス
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/reservations')}
              >
                予約管理
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/services')}
              >
                サービス管理
              </Button>
              {user?.role === 'ADMIN' && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/users')}
                >
                  ユーザー管理
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 