"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { CreditCard, Wifi } from 'lucide-react';
import Link from 'next/link';

const PAYMENT_TIMEOUT = 5; // 5 seconds

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
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center p-4">
        <h1 className="text-xl font-semibold mx-auto">Card Payment</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative">
          <CreditCard className="h-32 w-32 text-muted-foreground animate-pulse" />
          <Wifi className="h-10 w-10 text-muted-foreground/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-semibold">Processing Payment...</h2>
          <p className="text-6xl font-bold text-primary">${total.toFixed(2)}</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
            <p className="text-muted-foreground">Please wait</p>
            <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-linear" 
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
          <Button variant="outline" className="w-full h-12">
            Cancel
          </Button>
        </Link>
      </footer>
    </div>
  );
}
