
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Hash, QrCode, Menu, History, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function NavigationPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <header className="flex justify-between items-center py-6">
        <h1 className="text-4xl font-black tracking-tighter">NETWORK</h1>
        <Link href="/settings">
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-4 border-primary shadow-sm">
            <Settings className="h-8 w-8" />
          </Button>
        </Link>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={() => handleNavigation('/table-selection')}
            className="flex-col w-full h-56 text-2xl font-black rounded-3xl shadow-2xl gap-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Menu className="h-16 w-16" />
            <span className="text-center px-2">OPEN MENU</span>
          </Button>

          <Button
            onClick={() => handleNavigation('/order-by-table')}
            className="flex-col w-full h-56 text-2xl font-black rounded-3xl shadow-2xl gap-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Hash className="h-16 w-16" />
            <span className="text-center px-2">TABLE NUMBER</span>
          </Button>

          <Button
            onClick={() => handleNavigation('/scan-qr')}
            className="flex-col w-full h-56 text-2xl font-black rounded-3xl shadow-2xl gap-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <QrCode className="h-16 w-16" />
            <span className="text-center px-2">SCAN QR</span>
          </Button>

          <Button
            onClick={() => handleNavigation('/transaction-history')}
            className="flex-col w-full h-56 text-2xl font-black rounded-3xl shadow-2xl gap-4 bg-secondary text-secondary-foreground border-4 border-primary hover:bg-secondary/80"
          >
            <History className="h-16 w-16" />
            <span className="text-center px-2">HISTORY</span>
          </Button>
        </div>
      </main>

      <footer className="pt-8 pb-4">
        <Link href="/" passHref>
          <Button variant="ghost" className="w-full h-24 text-3xl font-black text-destructive hover:bg-destructive/10 flex items-center justify-center gap-4 border-4 border-dashed border-destructive/20 rounded-3xl">
            <LogOut className="h-12 w-12" />
            <span>FINISH SHIFT</span>
          </Button>
        </Link>
      </footer>
    </div>
  );
}
