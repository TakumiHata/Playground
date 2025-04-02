import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

const Profile: React.FC = () => {
  const userInfo = {
    name: '山田 花子',
    email: 'hanako.yamada@example.com',
    phone: '090-1234-5678',
    address: '東京都渋谷区1-1-1',
  };

  const recentBookings = [
    { id: 1, date: '2024-03-15', service: 'フェイシャル', status: '完了' },
    { id: 2, date: '2024-03-20', service: 'マッサージ', status: '予定' },
  ];

  const favoriteProducts = [
    { id: 1, name: '商品A', price: '¥8,000' },
    { id: 2, name: '商品B', price: '¥12,000' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        プロフィール
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
                src="/images/avatar.jpg"
              />
              <Typography variant="h5" gutterBottom>
                {userInfo.name}
              </Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                プロフィールを編集
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                基本情報
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="メールアドレス" secondary={userInfo.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="電話番号" secondary={userInfo.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText primary="住所" secondary={userInfo.address} />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最近の予約
              </Typography>
              <List>
                {recentBookings.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <ListItem>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={booking.service}
                        secondary={`${booking.date} - ${booking.status}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                お気に入り商品
              </Typography>
              <List>
                {favoriteProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <ListItem>
                      <ListItemIcon>
                        <FavoriteIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        secondary={product.price}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 