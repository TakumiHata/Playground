import Link from 'next/link';
import { AccessibleButton } from '@/components/ui/AccessibleButton';

export default function ServicesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Haircut</h2>
            <p className="text-gray-600 mb-4">Professional haircut service</p>
            <p className="text-lg font-medium mb-4">¥3,000</p>
            <Link href="/services/1/book">
              <AccessibleButton variant="primary">Book Now</AccessibleButton>
            </Link>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Hair Coloring</h2>
            <p className="text-gray-600 mb-4">Professional hair coloring service</p>
            <p className="text-lg font-medium mb-4">¥5,000</p>
            <Link href="/services/2/book">
              <AccessibleButton variant="primary">Book Now</AccessibleButton>
            </Link>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Manicure</h2>
            <p className="text-gray-600 mb-4">Professional manicure service</p>
            <p className="text-lg font-medium mb-4">¥2,000</p>
            <Link href="/services/3/book">
              <AccessibleButton variant="primary">Book Now</AccessibleButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 