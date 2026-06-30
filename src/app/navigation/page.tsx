
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  FileText, 
  LayoutGrid, 
  QrCode, 
  Zap,
  LogOut 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export default function NavigationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [restaurantName, setRestaurantName] = useState('BRANCH TERMINAL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = localStorage.getItem('restaurantSlug');
      if (slug) {
        // Remove hyphens and capitalize words for display
        const formatted = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setRestaurantName(formatted);
      }
    }
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('restaurantSlug');
      localStorage.removeItem('staffId');
    }
    toast({
      title: "Terminal Session Ended",
      description: "Successfully logged out.",
    });
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0051B5] overflow-hidden">
      {/* Header */}
      <header className="px-8 pt-12 pb-10 flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-none">{restaurantName}</h1>
          <p className="text-white/70 text-sm font-medium">POS Terminal Dashboard</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 border-2 border-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-slate-200 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-2">Quick Controls</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl h-12 gap-3 cursor-pointer" onClick={() => toast({ title: "Z-Report", description: "Calculating daily totals..." })}>
              <FileText className="h-4 w-4 text-slate-600" />
              <span className="font-bold text-slate-700 text-sm">Z-Report</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl h-12 gap-3 cursor-pointer text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="font-bold text-sm">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content White Card */}
      <main className="flex-grow flex flex-col pt-4">
        <div className="bg-white rounded-t-[3.5rem] flex-grow p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] flex flex-col">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pl-1">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4 auto-rows-fr">
            {/* New Order */}
            <button
              onClick={() => handleNavigation('/order-by-table')}
              className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-slate-50 hover:bg-slate-50 active:scale-[0.96] transition-all duration-300 gap-3 py-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] group"
            >
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0051B5] group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <FileText className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-base font-black text-slate-800 leading-tight">New<br/>Order</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Create invoice</p>
              </div>
            </button>

            {/* Table Settlement */}
            <button
              onClick={() => handleNavigation('/order-by-table?mode=settlement')}
              className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-slate-50 hover:bg-slate-50 active:scale-[0.96] transition-all duration-300 gap-3 py-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] group"
            >
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0051B5] group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <LayoutGrid className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-base font-black text-slate-800 leading-tight">Table<br/>Settlement</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Close & pay</p>
              </div>
            </button>

            {/* Scan HR Code */}
            <button
              onClick={() => handleNavigation('/scan-qr')}
              className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-slate-50 hover:bg-slate-50 active:scale-[0.96] transition-all duration-300 gap-3 py-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] group"
            >
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0051B5] group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <QrCode className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-base font-black text-slate-800 leading-tight">Scan<br/>HR Code</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Quick scan</p>
              </div>
            </button>

            {/* Direct Sale */}
            <button
              onClick={() => handleNavigation('/transaction-history')}
              className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-slate-50 hover:bg-slate-50 active:scale-[0.96] transition-all duration-300 gap-3 py-10 shadow-[0_15_40px_rgba(0,0,0,0.04)] group"
            >
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0051B5] group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Zap className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="text-base font-black text-slate-800 leading-tight">Direct<br/>Sale</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Instant checkout</p>
              </div>
            </button>
          </div>

          <div className="mt-10 mb-2">
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full h-16 text-sm font-black border-2 border-red-100 text-red-600 rounded-2xl bg-white hover:bg-red-50 hover:border-red-200 transition-all active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Branding Area */}
      <div className="bg-white py-12 flex flex-col items-center justify-end">
        <div className="flex flex-col items-center">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Powered by</p>
          <div className="flex items-center gap-1">
            <span className="text-[#0051B5] text-4xl font-black tracking-tighter">network</span>
            <span className="text-[#FF2E56] text-4xl font-black -ml-1 select-none leading-none">&gt;</span>
          </div>
          <p className="text-[#0051B5] text-[11px] font-black uppercase tracking-[0.5em] -mt-1 pl-1">dine</p>
        </div>
      </div>
    </div>
  );
}
