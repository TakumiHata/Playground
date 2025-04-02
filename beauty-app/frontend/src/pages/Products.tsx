import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, TextField } from '@mui/material';

const Products: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        商品一覧
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="商品を検索"
          sx={{ mb: 2 }}
        />
      </Box>

      <Grid container spacing={4}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`/images/product-${item}.jpg`}
                alt={`商品${item}`}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  商品名 {item}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  商品の説明文がここに表示されます。
                </Typography>
                <Typography variant="h6" color="primary">
                  ¥{10000 + item * 1000}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  詳細を見る
                </Button>
                <Button size="small" color="primary">
                  カートに追加
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products; 