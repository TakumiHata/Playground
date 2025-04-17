'use client'

import { Reservation, Service } from '@prisma/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ReservationWithService extends Reservation {
  service: Service
}

interface ReservationListProps {
  reservations: ReservationWithService[]
}

export default function ReservationList({ reservations }: ReservationListProps) {
  if (reservations.length === 0) {
    return <p className="text-gray-500">予約がありません</p>
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{reservation.service.name}</h3>
              <p className="text-gray-600">{reservation.service.description}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                ¥{reservation.service.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(reservation.date), 'yyyy年MM月dd日 HH:mm', {
                  locale: ja,
                })}
              </p>
            </div>
          </div>
          {reservation.notes && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">備考: {reservation.notes}</p>
            </div>
          )}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                reservation.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : reservation.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {reservation.status === 'PENDING'
                ? '確認中'
                : reservation.status === 'CONFIRMED'
                ? '確定'
                : 'キャンセル'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 