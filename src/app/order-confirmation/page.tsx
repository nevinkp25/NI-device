
"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, ReceiptText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear the cart upon successful order placement
    clearCart();

    const timer = setTimeout(() => {
      router.push('/navigation');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in duration-700">
        <div className="flex justify-center">
            <div className="bg-white p-8 rounded-full shadow-lg animate-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-28 w-28 text-green-500 stroke-[1.5]" />
            </div>
        </div>
        
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Order Placed!</h1>
            <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Successfully sent to kitchen</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Order Reference</p>
            <p className="text-6xl font-bold text-primary tracking-tighter tabular-nums">#{orderId || '----'}</p>
        </div>

        <div className="pt-4 space-y-3">
            <Link href="/navigation" passHref>
                <Button className="w-full h-16 text-xl font-bold bg-primary text-white rounded-2xl shadow-md flex items-center justify-center gap-3 uppercase tracking-tight transition-all active:scale-[0.98]">
                    <Home className="h-6 w-6"/>
                    <span>Back to Dashboard</span>
                </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-14 text-sm font-bold border-2 border-slate-200 text-slate-600 rounded-2xl uppercase tracking-widest bg-white hover:bg-slate-50">
                <ReceiptText className="h-5 w-5 mr-2" />
                Print Kitchen Slip
            </Button>

            <div className="flex items-center justify-center gap-2 pt-6 text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                <p className="text-[10px] font-semibold uppercase tracking-widest">
                    Auto-redirecting in 5s
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    )
}
