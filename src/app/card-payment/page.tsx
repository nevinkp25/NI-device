
"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, ShieldCheck, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const PAYMENT_TIMEOUT = 3; // 3 seconds

function CardPaymentContent() {
  const { decreaseSubtotal, subtotal } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(PAYMENT_TIMEOUT);

  const amountParam = searchParams.get('amount');
  const returnUrl = searchParams.get('returnUrl') || '/success';
  const table = searchParams.get('table') || '---';
  const paymentAmount = amountParam ? parseFloat(amountParam) : subtotal;

  // Stable transaction ID generated once
  const transactionId = useMemo(() => 
    `TXN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`
  , []);

  useEffect(() => {
    if (countdown <= 0) {
      if (amountParam) {
        decreaseSubtotal(paymentAmount);
      }
      
      const successUrl = `/success?returnUrl=${encodeURIComponent(returnUrl)}&amount=${paymentAmount}&transactionId=${transactionId}&table=${table}`;
      router.push(successUrl);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router, amountParam, decreaseSubtotal, paymentAmount, returnUrl, table, transactionId]);

  const cancelHref = returnUrl.includes('checkout') ? returnUrl : '/checkout';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="flex items-center p-4 border-b bg-white shadow-sm">
         <Link href={cancelHref} passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-6 w-6 text-slate-900" />
          </Button>
        </Link>
        <div className="flex flex-col items-center mx-auto">
          <h1 className="text-sm font-bold uppercase text-slate-900 tracking-tight">Payment Processing</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-0.5">Terminal ID: #8822</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-500">
        <div className="relative h-40 w-40 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
            <Loader2 className="h-24 w-24 text-primary animate-spin stroke-[1.5]" />
            <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary/20" />
        </div>
        
        <div className="space-y-3 w-full max-w-xs">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Authorizing Charge</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Do not remove card</p>
          </div>
          
          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white space-y-1">
            <p className="text-4xl font-bold text-primary tabular-nums tracking-tighter">${paymentAmount.toFixed(2)}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table {table} • {transactionId}</p>
          </Card>
        </div>
        
        <div className="w-full max-w-sm bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4 text-left">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-white"/>
            </div>
            <div>
                <h3 className="text-xs font-bold text-blue-900 uppercase">Encrypted Connection</h3>
                <p className="text-[10px] font-medium text-blue-700 uppercase leading-tight opacity-70">256-bit SSL Hardware Validation Active</p>
            </div>
        </div>
      </main>

      <footer className="p-6 space-y-3">
        <Link href={cancelHref} passHref className="w-full">
          <Button variant="outline" className="w-full h-14 border-2 border-slate-200 rounded-2xl text-slate-500 font-bold uppercase text-xs tracking-widest hover:bg-white active:scale-95 transition-all">
            Cancel Authorization
          </Button>
        </Link>
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Network Dine POS Infrastructure
        </p>
      </footer>
    </div>
  );
}

export default function CardPaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <CardPaymentContent />
        </Suspense>
    )
}
