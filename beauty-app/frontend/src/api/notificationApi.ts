import axios from 'axios';

export interface Notification {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

export interface CreateNotificationDto {
  type: 'email' | 'sms';
  recipient: string;
  subject: string;
  content: string;
}

export interface SendNotificationWithTemplateDto {
  templateId: string;
  recipient: string;
  variables: Record<string, string>;
}

const API_BASE_URL = '/api';

export const notificationApi = {
  createNotification: async (data: CreateNotificationDto): Promise<Notification> => {
    const response = await axios.post(`${API_BASE_URL}/notifications`, data);
    return response.data;
  },

  sendNotificationWithTemplate: async (
    data: SendNotificationWithTemplateDto
  ): Promise<Notification> => {
    const response = await axios.post(`${API_BASE_URL}/notifications/template`, data);
    return response.data;
  },

  sendReservationCancellation: async (
    reservationId: string,
    customerEmail: string,
    customerName: string,
    serviceName: string,
    dateTime: string,
    cancelReason: string
  ): Promise<Notification> => {
    return notificationApi.sendNotificationWithTemplate({
      templateId: 'reservation-cancellation',
      recipient: customerEmail,
      variables: {
        customerName,
        serviceName,
        dateTime: new Date(dateTime).toLocaleString('ja-JP'),
        cancelReason,
      },
    });
  },
}; 