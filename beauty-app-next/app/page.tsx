import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Beauty Salon Reservation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/services" className="p-4 border rounded-lg hover:bg-gray-100">
          <h2 className="text-2xl font-semibold mb-2">Services</h2>
          <p>View and book our services</p>
        </Link>
        <Link href="/reservations" className="p-4 border rounded-lg hover:bg-gray-100">
          <h2 className="text-2xl font-semibold mb-2">My Reservations</h2>
          <p>Manage your reservations</p>
        </Link>
      </div>
    </main>
  )
} 