
"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CashPaymentContent() {
  const { subtotal, decreaseSubtotal } = useCart();
  const [amountPaid, setAmountPaid] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const amountParam = searchParams.get('amount');
  const returnUrl = searchParams.get('returnUrl') || '/success';
  const paymentAmount = amountParam ? parseFloat(amountParam) : subtotal;

  const change = Number(amountPaid) - paymentAmount;

  const handleConfirm = () => {
    // For split payments, we decrease the subtotal instead of clearing the cart
    if (amountParam) {
      decreaseSubtotal(paymentAmount);
    }
    router.push(`/success?returnUrl=${encodeURIComponent(returnUrl)}`);
  };
  
  const cancelHref = returnUrl.includes('checkout') ? returnUrl : '/checkout';

  // Rounding to a safe number of decimal places before comparison
  // to avoid floating-point inaccuracies.
  const isPaymentSufficient = Number(amountPaid) >= paymentAmount || Math.abs(change) < 0.001;


  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href={cancelHref} passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">Cash Payment</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div>
          <p className="text-muted-foreground">Total Amount</p>
          <h2 className="text-5xl font-bold text-primary">${paymentAmount.toFixed(2)}</h2>
        </div>

        <div className="w-full max-w-sm">
          <Input
            type="number"
            placeholder="Enter Amount Paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="text-center text-2xl h-16"
          />
        </div>

        {Number(amountPaid) > 0 && (
          <div className="animate-in fade-in-0 duration-500">
            <p className="text-muted-foreground">Change Due</p>
            <h3 className={`text-4xl font-bold ${!isPaymentSufficient ? 'text-destructive' : 'text-green-600'}`}>
              {isPaymentSufficient ? `$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`}
            </h3>
          </div>
        )}
      </main>

      <footer className="p-4 border-t bg-background">
        <Button
          onClick={handleConfirm}
          disabled={!isPaymentSufficient || !amountPaid}
          className="w-full h-14 bg-accent text-accent-foreground text-lg hover:bg-accent/90"
        >
          Confirm Payment
        </Button>
      </footer>
    </div>
  );
}


export default function CashPaymentPage() {
    return (
        <Suspense fallback={<div>Loading payment details...</div>}>
            <CashPaymentContent />
        </Suspense>
    )
}

    
