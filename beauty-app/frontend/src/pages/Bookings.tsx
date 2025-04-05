import React from 'react';
import { Typography, Box } from '@mui/material';

const Bookings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        予約管理
      </Typography>
      <Typography variant="body1" paragraph>
        予約管理ページです。
      </Typography>
    </Box>
  );
};

export default Bookings; 