
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Landmark } from 'lucide-react';
import Link from 'next/link';

function PaymentMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get('amount');
  const returnUrl = searchParams.get('returnUrl');

  if (!amount || !returnUrl) {
    return <div>Missing payment details. Please go back.</div>;
  }

  const handlePaymentMethod = (method: 'card' | 'cash') => {
    if (method === 'card') {
      router.push(
        `/card-payment?amount=${amount}&returnUrl=${encodeURIComponent(
          returnUrl
        )}`
      );
    } else {
      router.push(
        `/cash-payment?amount=${amount}&returnUrl=${encodeURIComponent(
          returnUrl
        )}`
      );
    }
  };

  const cancelHref = returnUrl.includes('checkout') ? returnUrl : '/checkout';

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href={cancelHref} passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">
          Choose Payment Method
        </h1>
        <div className="w-8"></div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-8 space-y-6">
        <div className="text-center">
            <p className="text-muted-foreground">Amount to Pay</p>
            <p className="text-6xl font-bold text-primary">${parseFloat(amount).toFixed(2)}</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={() => handlePaymentMethod('card')}
            className="w-full h-20 text-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CreditCard className="mr-4 h-8 w-8" />
            Card
          </Button>
          <Button
            onClick={() => handlePaymentMethod('cash')}
            className="w-full h-20 text-xl bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <Landmark className="mr-4 h-8 w-8" />
            Cash
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function PaymentMethodPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentMethodContent />
    </Suspense>
  );
}

