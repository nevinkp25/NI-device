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

  const options = [
    { name: 'OPEN MENU', icon: Menu, path: '/menu', color: 'bg-primary text-primary-foreground' },
    { name: 'TABLE NUMBER', icon: Hash, path: '/order-by-table', color: 'bg-primary text-primary-foreground' },
    { name: 'SCAN QR CODE', icon: QrCode, path: '/scan-qr', color: 'bg-primary text-primary-foreground' },
    { name: 'HISTORY', icon: History, path: '/transaction-history', color: 'bg-secondary text-secondary-foreground border-2 border-primary' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 space-y-4">
        <header className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-black">NETWORK</h1>
            <Link href="/settings">
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 border-primary">
                    <Settings className="h-8 w-8" />
                </Button>
            </Link>
        </header>

        <div className="flex-grow flex flex-col gap-4">
            {options.map((option) => (
            <Button
                key={option.name}
                onClick={() => handleNavigation(option.path)}
                className={`w-full h-24 text-2xl font-black justify-start px-8 rounded-2xl shadow-lg gap-6 ${option.color}`}
            >
                <option.icon className="h-10 w-10" />
                <span>{option.name}</span>
            </Button>
            ))}
        </div>

       <div className="pt-8 pb-4">
            <Link href="/" passHref>
                <Button variant="ghost" className="w-full h-20 text-2xl font-bold text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-4 h-8 w-8" />
                    FINISH SHIFT
                </Button>
            </Link>
      </div>
    </div>
  );
}