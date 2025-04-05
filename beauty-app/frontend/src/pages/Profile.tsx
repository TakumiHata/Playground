import React from 'react';
import { Typography, Box } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        プロフィール
      </Typography>
      <Typography variant="body1" paragraph>
        プロフィールページです。
      </Typography>
    </Box>
  );
};

export default Profile; 