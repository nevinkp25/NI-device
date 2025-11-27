"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CashPaymentPage() {
  const { subtotal } = useCart();
  const [amountPaid, setAmountPaid] = useState('');
  const router = useRouter();

  const total = subtotal;
  const change = Number(amountPaid) - total;

  const handleConfirm = () => {
    router.push('/success');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href="/checkout" passHref>
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
          <h2 className="text-5xl font-bold text-primary">${total.toFixed(2)}</h2>
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
            <h3 className={`text-4xl font-bold ${change < 0 ? 'text-destructive' : 'text-green-600'}`}>
              {change >= 0 ? `$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`}
            </h3>
          </div>
        )}
      </main>

      <footer className="p-4 border-t bg-background">
        <Button
          onClick={handleConfirm}
          disabled={change < 0 || !amountPaid}
          className="w-full h-14 bg-accent text-accent-foreground text-lg hover:bg-accent/90"
        >
          Confirm Payment
        </Button>
      </footer>
    </div>
  );
}