'use client';

import { useState } from 'react';
import { AccessibleButton } from '@/components/ui/AccessibleButton';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      service: 'Haircut',
      date: '2024-04-20',
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: 2,
      service: 'Hair Coloring',
      date: '2024-04-25',
      time: '15:30',
      status: 'pending',
    },
  ]);

  const handleCancel = (id: number) => {
    // TODO: Implement cancellation logic
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Reservations</h1>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">{reservation.service}</h2>
                  <p className="text-gray-600">
                    {reservation.date} at {reservation.time}
                  </p>
                  <p
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {reservation.status}
                  </p>
                </div>
                <AccessibleButton
                  variant="outline"
                  onClick={() => handleCancel(reservation.id)}
                >
                  Cancel
                </AccessibleButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 