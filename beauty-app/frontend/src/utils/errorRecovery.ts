import axios from 'axios';

export interface RecoveryStrategy {
  condition: (error: any) => boolean;
  action: () => Promise<void>;
  maxRetries: number;
  retryDelay: number;
}

export class ErrorRecovery {
  private strategies: RecoveryStrategy[] = [];
  private retryCounts: Map<string, number> = new Map();

  addStrategy(strategy: RecoveryStrategy) {
    this.strategies.push(strategy);
  }

  async handleError(error: any, operation: string): Promise<boolean> {
    const strategy = this.strategies.find(s => s.condition(error));
    if (!strategy) return false;

    const key = `${operation}-${strategy.condition.toString()}`;
    const retryCount = this.retryCounts.get(key) || 0;

    if (retryCount >= strategy.maxRetries) {
      this.retryCounts.delete(key);
      return false;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, strategy.retryDelay));
      await strategy.action();
      this.retryCounts.set(key, retryCount + 1);
      return true;
    } catch (err) {
      console.error('Recovery attempt failed:', err);
      return false;
    }
  }

  resetRetryCount(operation: string) {
    for (const key of this.retryCounts.keys()) {
      if (key.startsWith(operation)) {
        this.retryCounts.delete(key);
      }
    }
  }
}

export const createDefaultRecoveryStrategies = () => {
  const recovery = new ErrorRecovery();

  // ネットワークエラーのリカバリー
  recovery.addStrategy({
    condition: (error) => axios.isAxiosError(error) && !error.response,
    action: async () => {
      // ネットワーク接続を確認
      await axios.get('/api/health');
    },
    maxRetries: 3,
    retryDelay: 2000,
  });

  // サーバーエラーのリカバリー
  recovery.addStrategy({
    condition: (error) => axios.isAxiosError(error) && error.response?.status >= 500,
    action: async () => {
      // サーバーの状態を確認
      await axios.get('/api/health');
    },
    maxRetries: 3,
    retryDelay: 5000,
  });

  // 認証エラーのリカバリー
  recovery.addStrategy({
    condition: (error) => axios.isAxiosError(error) && error.response?.status === 401,
    action: async () => {
      // トークンのリフレッシュを試みる
      await axios.post('/api/auth/refresh');
    },
    maxRetries: 1,
    retryDelay: 1000,
  });

  return recovery;
}; 