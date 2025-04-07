import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ja';
import { reservationApi, Reservation } from '../../api/reservationApi';
import { useNavigate } from 'react-router-dom';

moment.locale('ja');
const localizer = momentLocalizer(moment);

export const ReservationCalendar: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await reservationApi.getReservations();
        setReservations(data);
      } catch (err) {
        setError('予約の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleSelectEvent = (event: Reservation) => {
    navigate(`/reservations/${event.id}`);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    navigate('/reservations/new', {
      state: { start: slotInfo.start, end: slotInfo.end },
    });
  };

  const eventStyleGetter = (event: Reservation) => {
    let backgroundColor = '#3174ad';
    switch (event.status) {
      case 'pending':
        backgroundColor = '#ff9800';
        break;
      case 'confirmed':
        backgroundColor = '#4caf50';
        break;
      case 'completed':
        backgroundColor = '#9e9e9e';
        break;
      case 'cancelled':
        backgroundColor = '#f44336';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (loading) {
    return <Typography>読み込み中...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">予約カレンダー</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/reservations/new')}
        >
          新規予約
        </Button>
      </Box>
      <Calendar
        localizer={localizer}
        events={reservations.map(reservation => ({
          ...reservation,
          title: `${reservation.customerId} - ${reservation.serviceId}`,
          start: new Date(reservation.dateTime),
          end: new Date(reservation.dateTime),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        messages={{
          next: '次へ',
          previous: '前へ',
          today: '今日',
          month: '月',
          week: '週',
          day: '日',
          agenda: '予定表',
          date: '日付',
          time: '時間',
          event: '予約',
        }}
      />
    </Paper>
  );
}; 