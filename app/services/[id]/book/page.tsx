import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReservationForm from '@/components/reservations/ReservationForm'

interface BookServicePageProps {
  params: {
    id: string
  }
}

export default async function BookServicePage({ params }: BookServicePageProps) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
  })

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">予約</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <p className="text-lg font-bold">
            ¥{service.price.toLocaleString()}
          </p>
        </div>
        <ReservationForm service={service} />
      </div>
    </main>
  )
} 