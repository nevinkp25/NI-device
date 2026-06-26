
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Bespoke, polished SVG Icons
const IconOrderMenu = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 7H16M10 11H16M10 15H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPayByTable = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 21L7 5H17L20 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="12" y="16" fontSize="7.5" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="800" fontFamily="inherit">#</text>
  </svg>
);

const IconScanQR = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7M17 3H19C20.1046 3 21 3.89543 21 5V7M21 17V19C21 20.1046 20.1046 21 19 21H17M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7" y="7" width="3" height="3" fill="currentColor" rx="0.5"/>
    <rect x="14" y="7" width="3" height="3" fill="currentColor" rx="0.5"/>
    <rect x="14" y="14" width="3" height="3" fill="currentColor" rx="0.5"/>
    <rect x="7" y="14" width="3" height="3" fill="currentColor" rx="0.5"/>
  </svg>
);

const IconManualSale = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10H20V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="15" y="13" width="2" height="4" fill="currentColor" rx="0.2"/>
    <path d="M7 14H12M7 17H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function NavigationPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0051B5]">
      {/* Header */}
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Bella Cucina</h1>
        <p className="text-white/60 text-sm mt-1">POS Terminal Dashboard</p>
      </header>

      {/* Main Content Card */}
      <main className="flex-grow px-4 pb-8">
        <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-6 min-h-[500px]">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNavigation('/order-by-table')}
              className="flex flex-col items-center justify-center aspect-square rounded-[2rem] border-2 border-slate-50 bg-white hover:bg-slate-50 active:scale-[0.96] transition-all duration-200 gap-4 py-8 shadow-sm group"
            >
              <div className="text-[#0051B5] group-hover:scale-110 transition-transform duration-300">
                <IconOrderMenu />
              </div>
              <span className="text-base font-black text-slate-800 uppercase tracking-tight text-center px-2">New Order</span>
            </button>

            <button
              onClick={() => handleNavigation('/order-by-table')}
              className="flex flex-col items-center justify-center aspect-square rounded-[2rem] border-2 border-slate-50 bg-white hover:bg-slate-50 active:scale-[0.96] transition-all duration-200 gap-4 py-8 shadow-sm group"
            >
              <div className="text-[#0051B5] group-hover:scale-110 transition-transform duration-300">
                <IconPayByTable />
              </div>
              <span className="text-base font-black text-slate-800 uppercase tracking-tight text-center px-2">Table Settlement</span>
            </button>

            <button
              onClick={() => handleNavigation('/scan-qr')}
              className="flex flex-col items-center justify-center aspect-square rounded-[2rem] border-2 border-slate-50 bg-white hover:bg-slate-50 active:scale-[0.96] transition-all duration-200 gap-4 py-8 shadow-sm group"
            >
              <div className="text-[#0051B5] group-hover:scale-110 transition-transform duration-300">
                <IconScanQR />
              </div>
              <span className="text-base font-black text-slate-800 uppercase tracking-tight text-center px-2">Scan QR</span>
            </button>

            <button
              onClick={() => handleNavigation('/transaction-history')}
              className="flex flex-col items-center justify-center aspect-square rounded-[2rem] border-2 border-slate-50 bg-white hover:bg-slate-50 active:scale-[0.96] transition-all duration-200 gap-4 py-8 shadow-sm group"
            >
              <div className="text-[#0051B5] group-hover:scale-110 transition-transform duration-300">
                <IconManualSale />
              </div>
              <span className="text-base font-black text-slate-800 uppercase tracking-tight text-center px-2">Direct Sale</span>
            </button>
          </div>

          <div className="mt-auto">
            <Link href="/login" passHref className="w-full">
              <Button 
                variant="outline" 
                className="w-full h-20 text-xl font-black border border-[#FF0000] text-[#FF0000] rounded-[1.5rem] bg-white hover:bg-red-50 hover:text-red-700 transition-all shadow-md active:scale-[0.98] uppercase tracking-tighter"
              >
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="pb-10 flex flex-col items-center gap-1 opacity-80">
        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Powered by</p>
        <div className="flex items-center gap-1">
          <span className="text-white text-3xl font-black tracking-tighter">network</span>
          <span className="text-[#FF0000] text-3xl font-black -ml-1 select-none">&gt;</span>
        </div>
        <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] -mt-1 opacity-60">dine</p>
      </footer>
    </div>
  );
}
