"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Custom Icons to match image exactly
const IconMenu = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M10 7h6" />
    <path d="M10 11h6" />
    <path d="M10 15h6" />
  </svg>
);

const IconTableNumber = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M4 21l3-16h10l3 16" />
    <path d="M7 5h10" />
    <text x="12" y="15" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="900" fontFamily="sans-serif">12</text>
  </svg>
);

const IconScanQR = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M3 17v2a2 2 0 0 1 2 2h2" />
    <rect x="7" y="7" width="3" height="3" fill="currentColor" />
    <rect x="14" y="7" width="3" height="3" fill="currentColor" />
    <rect x="14" y="14" width="3" height="3" fill="currentColor" />
    <rect x="7" y="14" width="3" height="3" fill="currentColor" />
  </svg>
);

const IconManualSale = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M4 10h16v10H4z" />
    <path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
    <path d="M10 7h4" />
    <path d="M7 14h10" />
    <path d="M7 17h6" />
    <rect x="15" y="13" width="2" height="4" fill="currentColor" stroke="none" />
  </svg>
);

export default function NavigationPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      {/* Header */}
      <header className="p-8 pt-12">
        <h1 className="text-4xl font-semibold text-white tracking-tight">Bella Cuchina</h1>
      </header>

      {/* Main Content Card */}
      <main className="flex-grow px-5 pb-8">
        <div className="bg-white rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNavigation('/table-selection')}
              className="flex flex-col items-center justify-center aspect-square rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors gap-4 py-8 shadow-sm"
            >
              <IconMenu />
              <span className="text-xl font-bold text-slate-900">Order Menu</span>
            </button>

            <button
              onClick={() => handleNavigation('/order-by-table')}
              className="flex flex-col items-center justify-center aspect-square rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors gap-4 py-8 shadow-sm"
            >
              <IconTableNumber />
              <span className="text-xl font-bold text-slate-900">Table Number</span>
            </button>

            <button
              onClick={() => handleNavigation('/scan-qr')}
              className="flex flex-col items-center justify-center aspect-square rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors gap-4 py-8 shadow-sm"
            >
              <IconScanQR />
              <span className="text-xl font-bold text-slate-900">Scan Table QR</span>
            </button>

            <button
              onClick={() => handleNavigation('/transaction-history')}
              className="flex flex-col items-center justify-center aspect-square rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors gap-4 py-8 shadow-sm"
            >
              <IconManualSale />
              <span className="text-xl font-bold text-slate-900">Manual Sale</span>
            </button>
          </div>

          {/* Finish Shift Button */}
          <Link href="/" passHref className="w-full">
            <Button 
              variant="outline" 
              className="w-full h-20 text-2xl font-bold border-2 border-red-500 text-red-500 rounded-2xl bg-white hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Finish Shift
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="pb-10 flex flex-col items-center gap-1">
        <p className="text-white/80 text-sm font-medium">Powered by</p>
        <div className="flex items-center gap-1">
          <span className="text-white text-3xl font-bold tracking-tight">network</span>
          <span className="text-red-500 text-3xl font-bold -ml-0.5">&gt;</span>
        </div>
        <p className="text-white text-sm font-semibold -mt-1">dine</p>
      </footer>
    </div>
  );
}