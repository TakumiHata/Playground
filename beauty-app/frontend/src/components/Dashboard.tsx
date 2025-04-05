import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ダッシュボード
      </Typography>
      
      <Grid container spacing={3}>
        {/* お知らせセクション */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                お知らせ
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  - 新商品「美白美容液」が発売されました
                </Typography>
                <Typography variant="body1">
                  - 春のスキンケアセミナー開催のお知らせ
                </Typography>
                <Typography variant="body1">
                  - システムメンテナンスのお知らせ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* スキンケア商品紹介セクション */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                スキンケア商品紹介
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Item>
                    <Typography variant="subtitle1">美白美容液</Typography>
                    <Typography variant="body2">
                      ビタミンC配合で透明感のある肌へ
                    </Typography>
                  </Item>
                </Grid>
                <Grid item xs={12}>
                  <Item>
                    <Typography variant="subtitle1">保湿クリーム</Typography>
                    <Typography variant="body2">
                      乾燥知らずの潤い肌を実現
                    </Typography>
                  </Item>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* スキンケアtipセクション */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                スキンケア tip
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Item>
                    <Typography variant="subtitle1">朝のスキンケア</Typography>
                    <Typography variant="body2">
                      洗顔後はすぐに保湿を心がけましょう
                    </Typography>
                  </Item>
                </Grid>
                <Grid item xs={12}>
                  <Item>
                    <Typography variant="subtitle1">夜のスキンケア</Typography>
                    <Typography variant="body2">
                      クレンジングは優しく丁寧に行いましょう
                    </Typography>
                  </Item>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 