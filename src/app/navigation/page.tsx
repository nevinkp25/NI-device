"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Hash, QrCode, Menu, History, Settings } from 'lucide-react';
import Link from 'next/link';

const NetworkLogo = () => (
    <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <text x="0" y="30" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="currentColor">
            network
        </text>
        <text x="155" y="30" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="#E53935">
            &gt;
        </text>
    </svg>
);


const EMenuLogo = () => (
    <svg width="100" height="25" viewBox="0 0 100 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="28" y="20" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#26A69A">eMenu</text>
        <rect x="0" y="10" width="20" height="4" fill="#26A69A"/>
        <rect x="5" y="16" width="15" height="4" fill="#26A69A"/>
        <rect x="10" y="4" width="10" height="4" fill="#26A69A"/>
    </svg>
);


export default function NavigationPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const primaryOptions = [
    { name: 'Order by Table Number', icon: Hash, path: '/order-by-table' },
    { name: 'Scan QR Code', icon: QrCode, path: '/scan-qr' },
    { name: 'Open Menu', icon: Menu, path: '/menu' },
  ];
  
  const secondaryOptions = [
      { name: 'Transaction History', icon: History, path: '/transaction-history' },
      { name: 'Settings', icon: Settings, path: '/settings' },
  ]


  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
        <div className="flex-grow flex flex-col items-center justify-center">
            <div className="mb-12">
                <NetworkLogo />
            </div>
            
            <div className="w-full max-w-sm space-y-3">
                {primaryOptions.map((option) => (
                <Button
                    key={option.name}
                    onClick={() => handleNavigation(option.path)}
                    className="w-full h-14 text-lg justify-start p-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <option.icon className="mr-4 h-6 w-6" />
                    <span>{option.name}</span>
                </Button>
                ))}
            </div>

             <div className="w-full max-w-sm space-y-3 mt-6">
                {secondaryOptions.map((option) => (
                <Button
                    key={option.name}
                    onClick={() => handleNavigation(option.path)}
                    variant="outline"
                    className="w-full h-14 text-lg justify-between p-4"
                >
                    <span>{option.name}</span>
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                </Button>
                ))}
            </div>
        </div>

       <div className="text-center text-muted-foreground space-y-4">
            <p className="text-sm">v 2.0.1</p>
            <div>
                 <p className="text-xs">Powered by</p>
                 <div className="flex justify-center mt-1">
                    <EMenuLogo />
                 </div>
            </div>
             <Link href="/" passHref>
                <Button variant="link" size="sm">Back to Staff ID</Button>
            </Link>
      </div>
    </div>
  );
}
