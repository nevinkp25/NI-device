
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
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-6">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-4xl font-black tracking-tight">NETWORK</h1>
        <Link href="/settings">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2 border-primary shadow-sm">
            <Settings className="h-7 w-7" />
          </Button>
        </Link>
      </header>

      <div className="flex-grow flex flex-col gap-5">
        <Button
          onClick={() => handleNavigation('/menu')}
          className="w-full h-28 text-2xl font-black justify-start px-10 rounded-2xl shadow-xl gap-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Menu className="h-10 w-10" />
          <span>OPEN MENU</span>
        </Button>

        <Button
          onClick={() => handleNavigation('/order-by-table')}
          className="w-full h-28 text-2xl font-black justify-start px-10 rounded-2xl shadow-xl gap-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Hash className="h-10 w-10" />
          <span>TABLE NUMBER</span>
        </Button>

        <Button
          onClick={() => handleNavigation('/scan-qr')}
          className="w-full h-28 text-2xl font-black justify-start px-10 rounded-2xl shadow-xl gap-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <QrCode className="h-10 w-10" />
          <span>SCAN QR CODE</span>
        </Button>

        <Button
          onClick={() => handleNavigation('/transaction-history')}
          className="w-full h-28 text-2xl font-black justify-start px-10 rounded-2xl shadow-xl gap-8 bg-secondary text-secondary-foreground border-2 border-primary hover:bg-secondary/80"
        >
          <History className="h-10 w-10" />
          <span>HISTORY</span>
        </Button>
      </div>

      <div className="pt-8 pb-6">
        <Link href="/" passHref>
          <Button variant="ghost" className="w-full h-20 text-3xl font-black text-destructive hover:bg-destructive/10 flex items-center justify-center gap-4">
            <LogOut className="h-10 w-10" />
            <span>FINISH SHIFT</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
