import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={() => navigate('/')}>
            ホーム
          </Button>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            ダッシュボード
          </Button>
          <Button color="inherit" onClick={() => navigate('/products')}>
            商品一覧
          </Button>
          <Button color="inherit" onClick={() => navigate('/bookings')}>
            予約管理
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            プロフィール
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 