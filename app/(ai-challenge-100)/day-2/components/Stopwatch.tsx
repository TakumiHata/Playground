'use client';

import { useState, useEffect, useRef } from 'react';

interface Lap {
  id: number;
  time: number;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, { id: Date.now(), time }]);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-6xl font-mono">{formatTime(time)}</div>
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
            onClick={handleStop}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            停止
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          リセット
        </button>
        {isRunning && (
          <button
            onClick={handleLap}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ラップ
          </button>
        )}
      </div>
      {laps.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <h3 className="text-lg font-semibold mb-2">ラップタイム</h3>
          <div className="space-y-2">
            {laps.map((lap) => (
              <div
                key={lap.id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded"
              >
                <span>ラップ {laps.indexOf(lap) + 1}</span>
                <span className="font-mono">{formatTime(lap.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 