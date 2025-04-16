import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { serviceId, date, time, notes } = await request.json()

    if (!serviceId || !date || !time) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        serviceId,
        date: new Date(`${date}T${time}`),
        notes,
        status: 'PENDING',
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('予約作成エラー:', error)
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
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
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    return NextResponse.json(user.reservations)
  } catch (error) {
    console.error('予約取得エラー:', error)
    return NextResponse.json(
      { error: '予約の取得に失敗しました' },
      { status: 500 }
    )
  }
} 