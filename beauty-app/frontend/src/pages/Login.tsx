import React from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#F0F0F0',
  borderRadius: '16px',
  maxWidth: '500px',
  width: '100%',
  margin: 'auto',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  backgroundColor: '#2ECC71',
  color: 'white',
  '&:hover': {
    backgroundColor: '#27AE60',
  },
  width: '100%',
}));

const Login: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          backgroundColor: '#C8E6C9',
          top: '-20%',
          left: '-20%',
          zIndex: 0,
        }}
      />
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <StyledPaper elevation={3}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            GlowInspi
          </Typography>
          
          <Box component="form" width="100%" noValidate>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Username
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="example@glowinspi.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              sx={{ mb: 3, backgroundColor: 'white' }}
            />
            
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Password
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              variant="outlined"
              sx={{ mb: 2, backgroundColor: 'white' }}
            />

            <StyledButton type="submit" fullWidth>
              Sign Up
            </StyledButton>

            <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                dis
              </Typography>
            </Box>

            <StyledButton
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#2ECC71' }}
            >
              Get inspired
            </StyledButton>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Login; 