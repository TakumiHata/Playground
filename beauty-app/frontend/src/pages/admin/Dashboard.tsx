import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        管理者ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        {/* 予約状況 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              本日の予約状況
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="13:00 - 髪質改善トリートメント" 
                  secondary="担当: 山田花子" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="15:00 - カット＆カラー" 
                  secondary="担当: 鈴木一郎" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* 売上サマリー */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              売上サマリー
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h5">¥123,456</Typography>
                <Typography color="textSecondary">
                  今月の売上（速報）
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* 在庫アラート */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              在庫アラート
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="トリートメント液 残り2本" 
                  secondary="発注推奨" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="カラー剤 (ブラウン) 残り1本" 
                  secondary="要発注" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* スタッフシフト */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              本日のスタッフシフト
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="山田花子" 
                  secondary="10:00 - 19:00" 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="鈴木一郎" 
                  secondary="12:00 - 21:00" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 