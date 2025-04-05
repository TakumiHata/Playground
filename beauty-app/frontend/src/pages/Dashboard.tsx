import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        ダッシュボード
      </Typography>

      <Grid container spacing={3}>
        {/* お知らせセクション */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              お知らせ
            </Typography>
            <Box>
              <Typography variant="body2" paragraph>
                新商品が入荷しました！
              </Typography>
              <Typography variant="body2" paragraph>
                4月のキャンペーン情報
              </Typography>
              <Typography variant="body2" paragraph>
                システムメンテナンスのお知らせ
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* スキンケア商品紹介セクション */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              スキンケア商品紹介
            </Typography>
            <Box>
              <Typography variant="subtitle1">
                薬用美白美容液
              </Typography>
              <Typography variant="body2" paragraph>
                メラニンの生成を抑え、シミ・そばかすを防ぎます。
              </Typography>
              <Typography variant="subtitle1">
                高保湿クリーム
              </Typography>
              <Typography variant="body2" paragraph>
                乾燥肌を集中的にケアし、うるおいを与えます。
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* スキンケアtipセクション */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              スキンケアtip
            </Typography>
            <Box>
              <Typography variant="subtitle1">
                朝のスキンケア
              </Typography>
              <Typography variant="body2" paragraph>
                1. 洗顔
                2. 化粧水
                3. 美容液
                4. 乳液・クリーム
                5. 日焼け止め
              </Typography>
              <Typography variant="subtitle1">
                夜のスキンケア
              </Typography>
              <Typography variant="body2" paragraph>
                1. クレンジング
                2. 洗顔
                3. 化粧水
                4. 美容液
                5. ナイトクリーム
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 