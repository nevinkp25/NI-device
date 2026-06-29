
"use client";

import { useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Landmark, Banknote, History } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function CashPaymentContent() {
  const { subtotal, decreaseSubtotal } = useCart();
  const [amountPaid, setAmountPaid] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const amountParam = searchParams.get('amount');
  const returnUrl = searchParams.get('returnUrl') || '/success';
  const table = searchParams.get('table') || '---';
  const paymentAmount = amountParam ? parseFloat(amountParam) : subtotal;

  const change = Number(amountPaid) - paymentAmount;
  const isPaymentSufficient = Number(amountPaid) >= paymentAmount || Math.abs(change) < 0.001;

  const transactionId = useMemo(() => 
    `CSH-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`
  , []);

  const handleConfirm = () => {
    if (amountParam) {
      decreaseSubtotal(paymentAmount);
    }
    router.push(`/success?returnUrl=${encodeURIComponent(returnUrl)}&amount=${paymentAmount}&transactionId=${transactionId}&table=${table}`);
  };
  
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
          <h1 className="text-sm font-bold uppercase text-slate-900 tracking-tight">Cash Settlement</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-0.5">Terminal ID: #8822</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start p-6 text-center space-y-8 pt-12 animate-in fade-in duration-500">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Due</p>
          <h2 className="text-6xl font-black text-primary tracking-tighter tabular-nums">${paymentAmount.toFixed(2)}</h2>
        </div>

        <Card className="w-full max-w-sm p-6 border-none shadow-xl rounded-[2.5rem] bg-white space-y-6">
          <div className="space-y-2">
            <label htmlFor="cash-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Tendered</label>
            <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-200" />
                <Input
                    id="cash-input"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="text-center text-4xl h-20 font-black border-2 border-slate-100 rounded-2xl focus-visible:ring-primary/20 tabular-nums"
                    autoFocus
                />
            </div>
          </div>

          {Number(amountPaid) > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Change to Return</p>
              <h3 className={cn(
                "text-4xl font-black tabular-nums tracking-tighter",
                !isPaymentSufficient ? 'text-red-500' : 'text-green-600'
              )}>
                {isPaymentSufficient ? `$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`}
              </h3>
            </div>
          )}
        </Card>

        <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
            {[10, 20, 50, 100].map(val => (
                <button 
                    key={val}
                    onClick={() => setAmountPaid(val.toString())}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-tight hover:border-primary/30 active:scale-95 transition-all shadow-sm"
                >
                    ${val}
                </button>
            ))}
        </div>
      </main>

      <footer className="p-6 bg-white border-t-2 border-slate-100">
        <Button
          onClick={handleConfirm}
          disabled={!isPaymentSufficient || !amountPaid}
          className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-tight flex items-center justify-center gap-3"
        >
          <Landmark className="h-5 w-5" />
          <span>Complete Settlement</span>
        </Button>
      </footer>
    </div>
  );
}

export default function CashPaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <CashPaymentContent />
        </Suspense>
    )
}
