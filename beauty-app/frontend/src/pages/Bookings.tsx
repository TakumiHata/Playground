import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';

const Bookings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const services = [
    { id: 1, name: 'フェイシャル', duration: '60分', price: '¥8,000' },
    { id: 2, name: 'マッサージ', duration: '90分', price: '¥12,000' },
    { id: 3, name: 'エステティック', duration: '120分', price: '¥15,000' },
  ];

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        予約
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                予約フォーム
              </Typography>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>サービス</InputLabel>
                  <Select
                    value={selectedService}
                    label="サービス"
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name} - {service.duration} ({service.price})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                  <DatePicker
                    label="日付"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>

                <FormControl fullWidth>
                  <InputLabel>時間</InputLabel>
                  <Select
                    value={selectedTime}
                    label="時間"
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="contained" color="primary" size="large">
                  予約を確定する
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                予約内容の確認
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  選択したサービス: {selectedService ? services.find(s => s.id === Number(selectedService))?.name : '未選択'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  選択した日付: {selectedDate ? selectedDate.toLocaleDateString('ja-JP') : '未選択'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  選択した時間: {selectedTime || '未選択'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Bookings; 