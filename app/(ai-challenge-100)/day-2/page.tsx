'use client';

import { useState } from 'react';
import Timer from './components/Timer';
import Stopwatch from './components/Stopwatch';
import { useTimerSettings } from './hooks/useTimerSettings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'timer' | 'stopwatch'>('timer');
  const { settings, updateSettings } = useTimerSettings();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">デジタルタイマー</h1>
      
      <div className="max-w-md mx-auto">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-4 py-2 rounded ${
              activeTab === 'timer'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            タイマー
          </button>
          <button
            onClick={() => setActiveTab('stopwatch')}
            className={`px-4 py-2 rounded ${
              activeTab === 'stopwatch'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            ストップウォッチ
          </button>
        </div>

        {activeTab === 'timer' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label htmlFor="minutes">時間（分）:</label>
              <input
                type="number"
                id="minutes"
                min="1"
                max="60"
                value={settings.minutes}
                onChange={(e) => updateSettings({ minutes: Number(e.target.value) })}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
            <Timer initialTime={settings.minutes * 60} />
          </div>
        )}

        {activeTab === 'stopwatch' && <Stopwatch />}
      </div>
    </main>
  );
} 