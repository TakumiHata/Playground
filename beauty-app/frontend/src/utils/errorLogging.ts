import axios from 'axios';

const STORAGE_KEY = 'error_logs';
const MAX_STORED_LOGS = 1000;

export interface ErrorLog {
  timestamp: string;
  operation: string;
  errorCode?: string;
  errorMessage: string;
  stackTrace?: string;
  retryCount: number;
  statusCode?: number;
  url?: string;
}

export interface ErrorStats {
  totalErrors: number;
  errorsByOperation: Record<string, number>;
  errorsByCode: Record<string, number>;
  errorsByStatusCode: Record<number, number>;
  errorsByDate: Record<string, number>;
  lastError?: ErrorLog;
}

export interface ErrorLogFilter {
  operation?: string;
  errorCode?: string;
  statusCode?: number;
  startDate?: string;
  endDate?: string;
  searchText?: string;
}

let errorLogs: ErrorLog[] = [];
let errorStats: ErrorStats = {
  totalErrors: 0,
  errorsByOperation: {},
  errorsByCode: {},
  errorsByStatusCode: {},
  errorsByDate: {},
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      errorLogs = parsed.logs;
      errorStats = parsed.stats;
    }
  } catch (err) {
    console.error('Failed to load error logs from storage:', err);
  }
};

const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      logs: errorLogs.slice(-MAX_STORED_LOGS),
      stats: errorStats,
    }));
  } catch (err) {
    console.error('Failed to save error logs to storage:', err);
  }
};

loadFromStorage();

export const logError = (error: any, operation: string, retryCount: number = 0): ErrorLog => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    operation,
    errorCode: error.response?.data?.code,
    errorMessage: error.response?.data?.message || error.message || '予期せぬエラーが発生しました',
    stackTrace: error.stack,
    retryCount,
    statusCode: error.response?.status,
    url: error.config?.url,
  };

  errorLogs.push(errorLog);
  updateErrorStats(errorLog);
  saveToStorage();

  return errorLog;
};

const updateErrorStats = (errorLog: ErrorLog) => {
  errorStats.totalErrors++;
  
  if (errorLog.operation) {
    errorStats.errorsByOperation[errorLog.operation] = 
      (errorStats.errorsByOperation[errorLog.operation] || 0) + 1;
  }

  if (errorLog.errorCode) {
    errorStats.errorsByCode[errorLog.errorCode] = 
      (errorStats.errorsByCode[errorLog.errorCode] || 0) + 1;
  }

  if (errorLog.statusCode) {
    errorStats.errorsByStatusCode[errorLog.statusCode] = 
      (errorStats.errorsByStatusCode[errorLog.statusCode] || 0) + 1;
  }

  const date = new Date(errorLog.timestamp).toISOString().split('T')[0];
  errorStats.errorsByDate[date] = (errorStats.errorsByDate[date] || 0) + 1;

  errorStats.lastError = errorLog;
};

export const getErrorLogs = (): ErrorLog[] => {
  return [...errorLogs];
};

export const getErrorStats = (): ErrorStats => {
  return { ...errorStats };
};

export const clearErrorLogs = () => {
  errorLogs.length = 0;
  errorStats.totalErrors = 0;
  errorStats.errorsByOperation = {};
  errorStats.errorsByCode = {};
  errorStats.errorsByStatusCode = {};
  errorStats.errorsByDate = {};
  errorStats.lastError = undefined;
  saveToStorage();
};

export const exportErrorLogs = (format: 'csv' | 'json' = 'json'): string => {
  if (format === 'csv') {
    const headers = ['timestamp', 'operation', 'errorCode', 'errorMessage', 'retryCount', 'statusCode', 'url'];
    const rows = errorLogs.map(log => [
      log.timestamp,
      log.operation,
      log.errorCode || '',
      log.errorMessage,
      log.retryCount,
      log.statusCode || '',
      log.url || '',
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  return JSON.stringify(errorLogs, null, 2);
};

export const filterErrorLogs = (logs: ErrorLog[], filter: ErrorLogFilter): ErrorLog[] => {
  return logs.filter(log => {
    if (filter.operation && !log.operation.includes(filter.operation)) return false;
    if (filter.errorCode && log.errorCode !== filter.errorCode) return false;
    if (filter.statusCode && log.statusCode !== filter.statusCode) return false;
    if (filter.startDate && new Date(log.timestamp) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(log.timestamp) > new Date(filter.endDate)) return false;
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      return (
        log.operation.toLowerCase().includes(searchLower) ||
        (log.errorCode?.toLowerCase().includes(searchLower) ?? false) ||
        log.errorMessage.toLowerCase().includes(searchLower) ||
        (log.url?.toLowerCase().includes(searchLower) ?? false)
      );
    }
    return true;
  });
};

export const searchErrorLogs = (logs: ErrorLog[], searchText: string): ErrorLog[] => {
  if (!searchText) return logs;
  const searchLower = searchText.toLowerCase();
  return logs.filter(log => 
    log.operation.toLowerCase().includes(searchLower) ||
    (log.errorCode?.toLowerCase().includes(searchLower) ?? false) ||
    log.errorMessage.toLowerCase().includes(searchLower) ||
    (log.url?.toLowerCase().includes(searchLower) ?? false)
  );
};

export const getErrorLogStats = (logs: ErrorLog[]): {
  totalErrors: number;
  errorsByOperation: Record<string, number>;
  errorsByCode: Record<string, number>;
  errorsByStatusCode: Record<number, number>;
  errorsByDate: Record<string, number>;
} => {
  const stats = {
    totalErrors: logs.length,
    errorsByOperation: {} as Record<string, number>,
    errorsByCode: {} as Record<string, number>,
    errorsByStatusCode: {} as Record<number, number>,
    errorsByDate: {} as Record<string, number>,
  };

  logs.forEach(log => {
    // 操作別の集計
    stats.errorsByOperation[log.operation] = (stats.errorsByOperation[log.operation] || 0) + 1;

    // エラーコード別の集計
    if (log.errorCode) {
      stats.errorsByCode[log.errorCode] = (stats.errorsByCode[log.errorCode] || 0) + 1;
    }

    // ステータスコード別の集計
    if (log.statusCode) {
      stats.errorsByStatusCode[log.statusCode] = (stats.errorsByStatusCode[log.statusCode] || 0) + 1;
    }

    // 日付別の集計
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    stats.errorsByDate[date] = (stats.errorsByDate[date] || 0) + 1;
  });

  return stats;
}; 