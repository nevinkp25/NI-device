
"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';

function SuccessContent() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearedCart = useRef(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const returnUrl = searchParams.get('returnUrl') || '/';
  const amountPaid = searchParams.get('amount');
  const isSplitPayment = returnUrl.includes('checkout');


  useEffect(() => {
    // Generate order number only on the client
    setOrderNumber(Math.floor(Math.random() * 90000) + 10000);
    
    if (!amountPaid && !isSplitPayment) {
      router.replace('/');
    } else if (isSplitPayment) {
        const timer = setTimeout(() => {
            router.push(returnUrl);
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [router, isSplitPayment, returnUrl, amountPaid]);
  
  useEffect(() => {
    if (!clearedCart.current && !isSplitPayment) {
      clearCart();
      clearedCart.current = true;
    }
  }, [clearCart, isSplitPayment]);

  if (isSplitPayment) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen bg-background p-4">
            <div className="relative w-full max-w-sm p-6">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-headline font-bold mt-2 mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4">
                    Returning to checkout for the next payment...
                </p>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
            <div className="animate-in fade-in zoom-in-50 duration-1000">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
        </div>
        
        <h1 className="text-3xl font-bold mt-2 mb-3">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
            Thank you for your order! Your payment of <span className="font-bold text-foreground">${parseFloat(amountPaid!).toFixed(2)}</span> has been processed.
        </p>

        <div className="bg-muted rounded-lg p-4 text-center my-6">
            <p className="text-sm text-muted-foreground">Your order number is</p>
            <p className="text-2xl font-bold tracking-widest">{orderNumber ? `#${orderNumber}` : '...'}</p>
        </div>
        
        <div className="mt-10">
            <Link href="/" passHref>
            <Button className="w-full h-12 px-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                New Order
            </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Processing...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
