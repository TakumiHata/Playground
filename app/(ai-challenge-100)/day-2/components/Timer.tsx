'use client';

import { useState, useEffect, useRef } from 'react';
import { useTimerSettings } from '../hooks/useTimerSettings';

interface TimerProps {
  initialTime: number; // 秒単位
}

export default function Timer({ initialTime }: TimerProps) {
  const { settings, updateSettings } = useTimerSettings();
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const alertRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // アラート音の準備
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsAlerting(true);
            if (settings.soundEnabled && audioRef.current) {
              audioRef.current.play();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, settings.soundEnabled]);

  useEffect(() => {
    if (isAlerting && settings.visualAlertEnabled) {
      alertRef.current = setInterval(() => {
        document.body.classList.toggle('bg-red-100');
      }, 500);
    } else {
      if (alertRef.current) {
        clearInterval(alertRef.current);
        document.body.classList.remove('bg-red-100');
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (alertRef.current) {
        clearInterval(alertRef.current);
        document.body.classList.remove('bg-red-100');
      }
    };
  }, [isAlerting, settings.visualAlertEnabled]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsAlerting(false);
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsAlerting(false);
    setTime(initialTime);
  };
  const handleStopAlert = () => {
    setIsAlerting(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="rounded"
            />
            <span>音声アラート</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.visualAlertEnabled}
              onChange={(e) => updateSettings({ visualAlertEnabled: e.target.checked })}
              className="rounded"
            />
            <span>視覚アラート</span>
          </label>
        </div>
      </div>

      <div className={`text-6xl font-mono ${isAlerting ? 'text-red-500 animate-pulse' : ''}`}>
        {formatTime(time)}
      </div>
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            開始
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            一時停止
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          リセット
        </button>
        {isAlerting && (
          <button
            onClick={handleStopAlert}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            アラート停止
          </button>
        )}
      </div>
    </div>
  );
} 