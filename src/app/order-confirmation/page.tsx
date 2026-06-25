
"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, ReceiptText } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="flex justify-center">
            <div className="bg-green-50 p-6 rounded-full animate-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-32 w-32 text-green-500 stroke-[1.5]" />
            </div>
        </div>
        
        <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter">ORDER PLACED!</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Successfully sent to kitchen</p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Order Reference</p>
            <p className="text-6xl font-black text-primary tracking-tighter">#{orderId || '----'}</p>
        </div>

        <div className="pt-8 space-y-4">
            <Link href="/navigation" passHref>
                <Button className="w-full h-20 text-2xl font-black bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center gap-4 uppercase tracking-tighter">
                    <Home className="h-8 w-8"/>
                    <span>Back Home</span>
                </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-16 text-lg font-black border-4 border-slate-100 rounded-2xl uppercase tracking-tighter text-slate-500">
                <ReceiptText className="h-6 w-6 mr-2" />
                Print Kitchen Slip
            </Button>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
                Redirecting to dashboard in a few seconds...
            </p>
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
