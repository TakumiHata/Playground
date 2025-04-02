import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        ようこそ
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="/images/beauty-treatment.jpg"
              alt="ビューティートリートメント"
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最新のトリートメント
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                当店で提供している最新のビューティートリートメントをご紹介します。
              </Typography>
              <Button variant="contained" color="primary">
                詳細を見る
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="/images/products.jpg"
              alt="商品"
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                おすすめ商品
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                厳選された高品質なビューティー商品をご紹介します。
              </Typography>
              <Button variant="contained" color="primary">
                商品一覧
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 