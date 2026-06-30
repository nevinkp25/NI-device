
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
  LogOut,
  ShieldAlert,
  DollarSign,
  Settings
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

const QUICK_ACTIONS = [
  { id: 'new-order', label: 'New Order', sub: 'create new order', icon: FileText, path: '/order-by-table' },
  { id: 'table-settlement', label: 'Table Settlement', sub: 'Close & pay', icon: LayoutGrid, path: '/order-by-table?mode=settlement' },
  { id: 'scan-qr', label: 'Scan HR Code', sub: 'Quick scan', icon: QrCode, path: '/scan-qr' },
  { id: 'direct-sale', label: 'Direct Sale', sub: 'Instant checkout', icon: Zap, path: '/transaction-history' },
];

export default function NavigationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [restaurantName, setRestaurantName] = useState('BRANCH TERMINAL');
  const [visibleActions, setVisibleActions] = useState<Record<string, boolean>>({
    'new-order': true,
    'table-settlement': true,
    'scan-qr': true,
    'direct-sale': true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = localStorage.getItem('restaurantSlug');
      if (slug) {
        const formatted = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setRestaurantName(formatted);
      }

      const stored = localStorage.getItem('dashboard-quick-actions');
      if (stored) {
        setVisibleActions(JSON.parse(stored));
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

  const enabledActions = QUICK_ACTIONS.filter(action => visibleActions[action.id]);
  const activeCount = enabledActions.length;

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
          <DropdownMenuContent align="end" className="w-64 rounded-3xl p-2 border-slate-200 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-3">Terminal Systems</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => toast({ title: "Supervisor Mode", description: "Manager override required." })}
            >
              <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Supervisor Menu</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => handleNavigation('/transaction-history')}
            >
              <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Manual Sale</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => handleNavigation('/settings')}
            >
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-emerald-50" 
              onClick={() => toast({ title: "Z-Report", description: "Calculating daily totals..." })}
            >
              <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Z-Report</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-2xl h-14 gap-3 cursor-pointer focus:bg-red-50" 
              onClick={handleLogout}
            >
              <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content White Card */}
      <main className="flex-grow flex flex-col pt-4">
        <div className="bg-white rounded-t-[3.5rem] flex-grow p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] flex flex-col">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 pl-1">Quick Actions</h2>
          
          <div className={cn(
            "grid gap-4 auto-rows-fr",
            activeCount <= 1 ? "grid-cols-1" : "grid-cols-2"
          )}>
            {enabledActions.map((action, index) => {
              // Special balancing logic: If there are 3 cards, make the 3rd one full width
              const isThirdOfThree = activeCount === 3 && index === 2;
              
              return (
                <button
                  key={action.id}
                  onClick={() => handleNavigation(action.path)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-slate-50 hover:bg-slate-50 active:scale-[0.96] transition-all duration-300 gap-3 py-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] group",
                    isThirdOfThree ? "col-span-2" : ""
                  )}
                >
                  <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0051B5] group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <action.icon className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-black text-slate-800 leading-tight uppercase whitespace-pre-line">{action.label.replace(' ', '\n')}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase">{action.sub}</p>
                  </div>
                </button>
              )
            })}
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
        <div className="flex flex-col items-center gap-3">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] leading-none">Powered by</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="146" height="47" viewBox="0 0 1200 387">
            <path fill="#05a" d="M325 78.2c0 43.1.5 81.5 1 85.5 2.5 19.2 11 30.5 27 35.9 6.7 2.3 26.3 2.6 35.3.6l5.7-1.3v-12.6c0-12.5 0-12.5-2.2-11.9-12.9 3.7-24.1 2.6-30.1-3.2-5.4-5.1-5.7-8.3-5.7-56.9V70h38V47h-38V0h-31zm606 21.3V199h31l.2-37 .3-37 31.4 37 31.4 37h37.8l-7.4-8.8c-31.8-37.1-55.7-65.7-55.7-66.3 0-.4 14.1-17.4 31.3-37.6 17.2-20.3 31.6-37.4 32.1-38.1.5-.9-3.5-1.2-18.1-1.1h-18.8l-32 37.9-32 37.8-.3-61.4L962 0h-31zM223.5 43c-33.4 4.7-57.7 25.2-66.5 56.2-3.3 11.3-3.8 29.6-1.2 42.1 3.5 16.9 13 33.1 25.5 43.5 6.5 5.4 23.1 13.6 31.7 15.7 9.5 2.3 26.2 3 36.1 1.6 19-2.8 31.4-8.8 44.8-21.8l8.5-8.2-10.8-8.5-10.7-8.4-6.8 6.7c-12.6 12.7-29.1 18-46.8 15.3-21.7-3.4-38.7-19.9-41.7-40.5l-.7-4.7h123.4l-.6-13.8c-.8-21.2-5.6-36-16.1-49.9C279.9 52.9 261.3 44 238 42.6c-4.7-.2-11.2-.1-14.5.4m29.8 27.3c13 5.9 21.2 18.1 23.2 34.1l.7 5.6h-92.4l.7-4.2c3.4-19.7 21.4-36.7 41.2-38.6 9.9-1 20.3.2 26.6 3.1M66.4 44.5C53.3 48 42.4 55 33.8 65.3L29 71.1V47H0v153.1l15.3-.3 15.2-.3.5-48c.5-51.6.4-50.5 6-61.6 3.1-6.1 11-13.8 17.4-17.2 5.8-3.1 6.6-3.2 17.6-3.2 10.5 0 11.9.2 16.5 2.7 6.6 3.5 9.8 7 13.4 14.8 4.5 9.8 5.1 17.4 5.1 67.6V200h31.1l-.4-54.3c-.3-47.1-.6-55-2.1-60.6-5.7-21.6-21.7-37.3-42-41-8-1.5-20.9-1.3-27.2.4m647.1-.1c-19.5 3.8-33.4 11.3-46.2 25-12.5 13.4-19.1 29.3-20 48.3-1.7 34.8 14.1 62.8 43.2 76.8 10.9 5.2 18 7.2 30.3 8.4 24.9 2.6 50-5.2 67.4-21.1 9.8-8.9 18.5-23.7 22.4-37.8 2.8-10.1 2.6-33-.4-43.3-7.9-27.5-28.1-46.8-57.7-54.9-9.2-2.6-29.4-3.3-39-1.4m32.4 26.5c22.1 6.9 36.1 29.3 34.8 55.6-1.5 30.4-22.4 51.5-50.9 51.5-24.9 0-43.8-15-50.2-39.7-2-7.6-2-21.9-.1-30.1 4-16.8 16.4-31.2 31.5-36.8 10.3-3.7 24-3.9 34.9-.5M894 44.1c-11.4 2.2-27.6 13.5-34.2 23.8l-2.8 4.5V47h-29v152h31v-43.8c0-48.4.4-52.6 6.1-63.2 3.9-7.4 11.2-14.3 18.7-17.8 5.3-2.5 6.7-2.7 19-2.7H916V57.9c0-11.6-.2-13.8-1.6-14.3-2.2-.9-15-.5-20.4.5m-487 3.6c0 .5 11.4 34.5 25.4 75.8l25.4 75h32.5l18.5-56.3C519 111.3 527.6 86 527.9 86c.4 0 9.1 25.4 19.4 56.5l18.9 56.5h32.3l25.3-75.3c13.9-41.3 25.2-75.5 25.2-76 0-.4-7.1-.7-15.9-.7h-15.8L605 88.2c-6.8 22.7-14.6 49.2-17.5 58.8l-5.2 17.4-7.1-21.9c-3.9-12.1-12.4-38.5-18.9-58.8L544.5 47h-32.3l-2.4 7.7c-24.6 78.3-34.3 108.2-34.9 107.5-.5-.5-22.9-74.2-34.5-113.5-.5-1.5-2.2-1.7-17-1.7-9 0-16.4.3-16.4.7m439 251.9v22.7l-5.5-5.2c-8.2-7.7-12.9-9.6-24.5-9.6-8.5 0-10.1.3-15.3 2.9-6.4 3.3-14.4 11.1-17.5 17.2-4.8 9.4-5.3 24.6-1.2 35.6 3 8 10.4 15.9 18.8 20 6 3 7.5 3.3 15.2 3.3 10.7 0 17.7-3 25-10.5l5-5.1V385h12V277h-12zm-19.3 18.9c6.4 1.9 13.4 8 16.7 14.7 2.1 4.2 2.6 6.6 2.6 12.8 0 13.6-5 22.4-15.7 27.6-4.6 2.3-7 2.8-12.2 2.7-15.3-.2-25.6-10.5-26.8-26.7-.8-10.3 1.5-17.5 7.5-23.8 7.5-7.9 17.3-10.4 27.9-7.3m50.3-33v6.5h13v-13h-13zm62 22.4c-5.1 1.6-9.6 4.5-13.7 8.9l-4.3 4.5V308h-11v77h11v-23.3c0-30.4 1.4-35.3 11.8-41.4 3.9-2.3 5.8-2.7 11.7-2.7 4.5 0 8.1.6 10.1 1.7 4.4 2.3 9.1 8 10.3 12.4.6 2.2 1.1 14.4 1.1 28.5V385h12v-25.3c0-17.6-.4-26.9-1.4-31-2.4-10.2-8.9-17.5-18.2-20.3-5-1.5-15.2-1.7-19.4-.5m78.5.4c-2.2.8-5.4 2.1-7 2.9-4.8 2.5-13.4 12.3-16.3 18.5-2.4 5.3-2.7 6.9-2.7 17.3 0 11 .2 11.9 3.2 18.1 10.4 21.1 36.3 28.2 56.9 15.7 3-1.8 6.5-4.3 7.6-5.6l2.2-2.2-3.4-3.5-3.3-3.4-3.6 3.1c-6.1 5.4-11.6 7.3-21.1 7.3-9.6 0-14-1.8-19.7-7.7-3.5-3.7-7.2-11.1-7.3-14.6V352h61.2l-.4-8.8c-.7-14.7-7.3-26-19-32.2-5.5-3-7.4-3.4-14.8-3.7-5.2-.2-10.1.2-12.5 1m23.6 12.2c4.7 3.3 9.3 10.7 10.7 17.2l1 4.3h-24.9c-28.1 0-26.4.6-23.4-8 2.1-5.9 7.6-12.3 12.7-14.9 3.5-1.8 5.7-2.1 12-1.9 6.6.3 8.2.7 11.9 3.3m-163.1 26V385h11v-77h-11z" />
            <path fill="red" d="M1099.1 48.7c.8 1 15.3 18.1 32.2 38.1l30.8 36.3-4.9 5.7c-8.7 10.2-55.7 65.7-57.1 67.5-1.3 1.6-.3 1.7 17.5 1.6h18.9l31-36.7c17.1-20.2 31-37.3 31-38.1s-14.2-18.2-31.5-38.7l-31.5-37.3h-18.9c-17.8-.1-18.8 0-17.5 1.6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
