import { Reservation } from '../api/reservationApi';
import { Customer } from '../api/customerApi';
import { Service } from '../api/serviceApi';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (
  reservations: Reservation[],
  customers: Record<string, Customer>,
  services: Record<string, Service>
): string => {
  const headers = [
    '予約ID',
    '顧客名',
    'サービス名',
    '日時',
    '料金',
    'ステータス',
    'メモ',
  ];

  const rows = reservations.map((reservation) => [
    reservation.id,
    customers[reservation.customerId]?.name || '不明',
    services[reservation.serviceId]?.name || '不明',
    new Date(reservation.dateTime).toLocaleString('ja-JP'),
    `¥${services[reservation.serviceId]?.price.toLocaleString() || '0'}`,
    getStatusLabel(reservation.status),
    reservation.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

export const exportToPDF = (
  reservations: Reservation[],
  customers: Record<string, Customer>,
  services: Record<string, Service>
): void => {
  const doc = new jsPDF();
  const title = '予約一覧';
  const headers = [
    ['予約ID', '顧客名', 'サービス名', '日時', '料金', 'ステータス', 'メモ'],
  ];

  const rows = reservations.map((reservation) => [
    reservation.id,
    customers[reservation.customerId]?.name || '不明',
    services[reservation.serviceId]?.name || '不明',
    new Date(reservation.dateTime).toLocaleString('ja-JP'),
    `¥${services[reservation.serviceId]?.price.toLocaleString() || '0'}`,
    getStatusLabel(reservation.status),
    reservation.notes || '',
  ]);

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  (doc as any).autoTable({
    startY: 25,
    head: headers,
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 40 },
    },
  });

  doc.save('reservations.pdf');
};

const getStatusLabel = (status: Reservation['status']): string => {
  switch (status) {
    case 'pending':
      return '未確定';
    case 'confirmed':
      return '確定';
    case 'completed':
      return '完了';
    case 'cancelled':
      return 'キャンセル';
    default:
      return '不明';
  }
}; 