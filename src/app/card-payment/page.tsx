"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { CreditCard, Wifi } from 'lucide-react';
import Link from 'next/link';

const PAYMENT_TIMEOUT = 50; // 50 seconds

export default function CardPaymentPage() {
  const { subtotal } = useCart();
  const router = useRouter();
  const [countdown, setCountdown] = useState(PAYMENT_TIMEOUT);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/success');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  const total = subtotal;
  const progressPercentage = ((PAYMENT_TIMEOUT - countdown) / PAYMENT_TIMEOUT) * 100;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center p-4">
        <h1 className="text-xl font-semibold mx-auto">Card Payment</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative">
          <CreditCard className="h-32 w-32 text-gray-500" />
          <Wifi className="h-10 w-10 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-semibold">Tap to Pay</h2>
          <p className="text-6xl font-bold text-amber-400">${total.toFixed(2)}</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
            <p className="text-gray-400">Present your card on the terminal</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${progressPercentage}%`}}
                ></div>
            </div>
            <p className="text-lg font-mono">
              {String(Math.floor(countdown / 60)).padStart(2, '0')}:
              {String(countdown % 60).padStart(2, '0')}
            </p>
        </div>
      </main>

      <footer className="p-4">
        <Link href="/checkout" passHref>
          <Button variant="outline" className="w-full h-12 bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white">
            Cancel
          </Button>
        </Link>
      </footer>
    </div>
  );
}