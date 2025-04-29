'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  targetDate: string;
  createdAt: string;
}

export default function DateCounter() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const savedEvents = localStorage.getItem('dateCounterEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dateCounterEvents', JSON.stringify(events));
  }, [events]);

  const calculateDaysLeft = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetDate) {
      alert('イベント名と目標日を入力してください');
      return;
    }

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id
          ? { ...event, title, targetDate }
          : event
      ));
      setEditingEvent(null);
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        title,
        targetDate,
        createdAt: new Date().toISOString(),
      };
      setEvents([...events, newEvent]);
    }

    setTitle('');
    setTargetDate('');
  };

  const handleEdit = (event: Event) => {
    setTitle(event.title);
    setTargetDate(event.targetDate);
    setEditingEvent(event);
  };

  const handleDelete = (id: string) => {
    if (confirm('このイベントを削除してもよろしいですか？')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">日付カウンター</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            イベント名
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="イベント名を入力"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            目標日
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {editingEvent ? '更新' : '追加'}
        </button>
      </form>

      <div className="space-y-4">
        {events.map((event) => {
          const daysLeft = calculateDaysLeft(event.targetDate);
          const isPast = daysLeft < 0;

          return (
            <div
              key={event.id}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>

              <div className="text-gray-600 mb-2">
                目標日: {formatDate(event.targetDate)}
              </div>

              <div className={`text-2xl font-bold ${isPast ? 'text-red-500' : 'text-green-500'}`}>
                {isPast
                  ? `${Math.abs(daysLeft)}日経過`
                  : `${daysLeft}日後`}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                作成日: {formatDate(event.createdAt)}
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center text-gray-500">
            イベントがありません。新しいイベントを追加してください。
          </div>
        )}
      </div>
    </div>
  );
} 