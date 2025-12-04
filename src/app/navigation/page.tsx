"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, QrCode, ClipboardList, Settings, Wifi } from 'lucide-react';
import Link from 'next/link';

export default function NavigationPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const navOptions = [
    { name: 'Open Menu', icon: BookOpen, path: '/menu' },
    { name: 'Scan QR Code', icon: QrCode, path: '/scan-qr' },
    { name: 'Order by Table', icon: ClipboardList, path: '/order-by-table' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Wifi Settings', icon: Wifi, path: '/wifi-settings' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-bold text-foreground">SwiftBite</h1>
        <p className="text-muted-foreground mt-2 text-lg">Select an Option</p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        {navOptions.map((option) => (
          <Button
            key={option.name}
            onClick={() => handleNavigation(option.path)}
            variant="outline"
            className="w-full h-16 text-lg justify-start p-4 shadow-sm"
          >
            <option.icon className="mr-4 h-6 w-6 text-primary" />
            <span>{option.name}</span>
          </Button>
        ))}
      </div>

       <div className="mt-12">
        <Link href="/" passHref>
          <Button variant="link">Back to Staff ID</Button>
        </Link>
      </div>
    </div>
  );
}
