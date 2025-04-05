import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ビューティーアプリ
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            ホーム
          </Button>
          <Button color="inherit" component={RouterLink} to="/dashboard">
            ダッシュボード
          </Button>
          <Button color="inherit" component={RouterLink} to="/products">
            商品
          </Button>
          <Button color="inherit" component={RouterLink} to="/bookings">
            予約
          </Button>
          <Button color="inherit" component={RouterLink} to="/profile">
            プロフィール
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 