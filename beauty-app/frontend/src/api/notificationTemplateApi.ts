import axios from 'axios';

export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms';
  name: string;
  subject: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationTemplateDto {
  type: 'email' | 'sms';
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

export interface UpdateNotificationTemplateDto {
  name?: string;
  type?: 'email' | 'sms';
  subject?: string;
  content?: string;
  variables?: string[];
  initialVariables?: Record<string, string>;
}

export interface PreviewTemplateDto {
  templateId: string;
  variables: Record<string, string>;
}

export interface PreviewResult {
  subject: string;
  content: string;
}

export interface TemplateHistory {
  id: string;
  templateId: string;
  originalName: string;
  newName: string;
  duplicatedAt: string;
  duplicatedBy: string;
}

const API_BASE_URL = '/api';

export const notificationTemplateApi = {
  getTemplates: async (): Promise<NotificationTemplate[]> => {
    const response = await axios.get(`${API_BASE_URL}/notification-templates`);
    return response.data;
  },

  getTemplate: async (id: string): Promise<NotificationTemplate> => {
    const response = await axios.get(`${API_BASE_URL}/notification-templates/${id}`);
    return response.data;
  },

  createTemplate: async (data: CreateNotificationTemplateDto): Promise<NotificationTemplate> => {
    const response = await axios.post(`${API_BASE_URL}/notification-templates`, data);
    return response.data;
  },

  updateTemplate: async (id: string, data: UpdateNotificationTemplateDto): Promise<NotificationTemplate> => {
    const response = await axios.patch(`${API_BASE_URL}/notification-templates/${id}`, data);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/notification-templates/${id}`);
  },

  previewTemplate: async (data: PreviewTemplateDto): Promise<PreviewResult> => {
    const response = await axios.post(`${API_BASE_URL}/notification-templates/preview`, data);
    return response.data;
  },

  duplicateTemplate: async (id: string): Promise<NotificationTemplate> => {
    const response = await axios.post(`${API_BASE_URL}/notification-templates/${id}/duplicate`);
    return response.data;
  },

  getTemplateHistory: async (templateId: string): Promise<TemplateHistory[]> => {
    const response = await axios.get(`${API_BASE_URL}/notification-templates/${templateId}/history`);
    return response.data;
  },
}; 