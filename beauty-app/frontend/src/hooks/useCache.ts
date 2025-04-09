import { useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

interface UseCacheReturn<T> {
  get: (key: string) => T | null;
  set: (key: string, data: T, expiresIn?: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCache = <T>(): UseCacheReturn<T> => {
  const [cache, setCache] = useState<Record<string, CacheItem<T>>>({});

  useEffect(() => {
    // 期限切れのキャッシュを定期的にクリーンアップ
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (newCache[key].timestamp + newCache[key].expiresIn < now) {
            delete newCache[key];
          }
        });
        return newCache;
      });
    }, 60000); // 1分ごとにクリーンアップ

    return () => clearInterval(cleanupInterval);
  }, []);

  const get = (key: string): T | null => {
    const item = cache[key];
    if (!item) return null;

    const now = Date.now();
    if (item.timestamp + item.expiresIn < now) {
      remove(key);
      return null;
    }

    return item.data;
  };

  const set = (key: string, data: T, expiresIn: number = 5 * 60 * 1000) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now(),
        expiresIn,
      },
    }));
  };

  const remove = (key: string) => {
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[key];
      return newCache;
    });
  };

  const clear = () => {
    setCache({});
  };

  return { get, set, remove, clear };
}; 