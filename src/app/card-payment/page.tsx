
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const PAYMENT_TIMEOUT = 3; // 3 seconds

function CardPaymentContent() {
  const { decreaseSubtotal, subtotal } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(PAYMENT_TIMEOUT);
  const [transactionId, setTransactionId] = useState('');

  const amountParam = searchParams.get('amount');
  const returnUrl = searchParams.get('returnUrl') || '/success';
  const table = searchParams.get('table') || '3'; // Defaulting for demo
  const paymentAmount = amountParam ? parseFloat(amountParam) : subtotal;

  useEffect(() => {
    const newTransactionId = `TXN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`;
    setTransactionId(newTransactionId);
    
    if (countdown <= 0) {
      if (amountParam) {
        decreaseSubtotal(paymentAmount);
      }
      
      const successUrl = `/success?returnUrl=${encodeURIComponent(returnUrl)}&amount=${paymentAmount}&transactionId=${newTransactionId}&table=${table}`;
      router.push(successUrl);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router, amountParam, decreaseSubtotal, paymentAmount, returnUrl, table]);

  const cancelHref = returnUrl.includes('checkout') ? returnUrl : '/checkout';

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center p-4 border-b">
         <Link href={cancelHref} passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Payment</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative h-32 w-32 flex items-center justify-center">
            <Loader2 className="h-28 w-28 text-primary animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-headline font-semibold">Processing Payment</h2>
          <p className="text-6xl font-bold text-primary">${paymentAmount.toFixed(2)}</p>
          <p className="text-muted-foreground">Transaction ID: {transactionId}</p>
        </div>
        
        <div className="w-full max-w-sm bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-green-600"/>
            <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm">Your payment is protected with 256-bit SSL encryption</p>
            </div>
        </div>
      </main>

      <footer className="p-4 space-y-2">
        <Link href={cancelHref} passHref>
          <Button variant="outline" className="w-full h-12">
            Cancel Payment
          </Button>
        </Link>
        <p className="text-center text-sm text-muted-foreground">
            Please wait while we process your payment
        </p>
      </footer>
    </div>
  );
}

export default function CardPaymentPage() {
    return (
        <Suspense fallback={<div>Loading payment details...</div>}>
            <CardPaymentContent />
        </Suspense>
    )
}
