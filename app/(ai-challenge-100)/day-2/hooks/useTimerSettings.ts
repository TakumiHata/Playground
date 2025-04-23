import { useState, useEffect } from 'react';

interface TimerSettings {
  minutes: number;
  soundEnabled: boolean;
  visualAlertEnabled: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  minutes: 5,
  soundEnabled: true,
  visualAlertEnabled: true,
};

export function useTimerSettings() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // ローカルストレージから設定を読み込む
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // 設定が変更されたらローカルストレージに保存
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
  };
} 