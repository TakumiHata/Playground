import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ReservationList from '@/components/reservations/ReservationList'

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return <div>ログインが必要です</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      reservations: {
        include: {
          service: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
    },
  })

  if (!user) {
    return <div>ユーザーが見つかりません</div>
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">マイ予約</h1>
      <ReservationList reservations={user.reservations} />
    </main>
  )
} 