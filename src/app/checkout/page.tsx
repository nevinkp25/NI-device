

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuantitySelector } from '@/components/quantity-selector';
import { CreditCard, Landmark, ArrowLeft, ShoppingCart, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { SegmentedControl, SegmentedControlItem } from '@/components/segmented-control';
import { SplitBillSheet } from '@/components/split-bill-sheet';
import type { Split } from '@/components/split-bill-sheet';
import { TipSheet } from '@/components/tip-sheet';


export default function CheckoutPage() {
  const { cartItems, updateQuantity, subtotal } = useCart();
  const [isTipSheetOpen, setIsTipSheetOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [splitMode, setSplitMode] = useState<'full' | 'split'>('full');
  const [splits, setSplits] = useState<Split[]>([{ id: 1, amount: 0, isPaid: false }]);
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isReturningFromSplit = searchParams.get('split') === 'true';

  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  useEffect(() => {
    if (splitMode === 'full' || total <= 0) {
      setSplits([{ id: 1, amount: total, isPaid: false }]);
    } else {
        // When switching to split mode, or when total changes, re-initialize if needed.
        if (splits.length <= 1 && total > 0) {
            const equalAmount = total / 2;
            const newSplits = [
                { id: 1, amount: equalAmount, isPaid: false },
                { id: 2, amount: equalAmount, isPaid: false }
            ];
            setSplits(newSplits);
            // This is a good place to pass the splits to the sheet
        } else {
            // If splits already exist, we could try to rebalance them
            // For now, let's stick to a simpler logic. The user can edit in the sheet.
        }
    }
  }, [total, splitMode]);
  
  useEffect(() => {
    if (isReturningFromSplit) {
      // Logic to handle the state after returning from a partial payment
      // For instance, you might want to automatically open the split sheet
      // or highlight the next payment to be made.
      if (splitMode === 'split') {
        setIsSplitSheetOpen(true);
      }
    }
  }, [isReturningFromSplit, splitMode]);
  
  const handleProceedToPayment = () => {
    if (splitMode === 'split') {
        setIsSplitSheetOpen(true);
    } else {
        setIsTipSheetOpen(true);
    }
  }


  const handleSplitModeChange = (value: string) => {
    const newMode = value as 'full' | 'split';
    setSplitMode(newMode);
    if (newMode === 'split') {
        setIsSplitSheetOpen(true);
    } else {
        setSplits([{ id: 1, amount: total, isPaid: false }]);
    }
  }
  
  const handleSplitsConfirmed = (newSplits: Split[]) => {
      setSplits(newSplits);
      setIsSplitSheetOpen(false);
  }

  const amountToPay = splits.find(s => !s.isPaid)?.amount || 0;


  return (
    <div className="flex flex-col bg-background min-h-screen">
      <header className="flex items-center p-4 border-b sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <Link href="/menu" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Checkout</h1>
        <div className="w-8"></div>
      </header>

      {cartItems.length === 0 && subtotal <= 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/menu" passHref>
            <Button className="bg-accent text-accent-foreground">Start Ordering</Button>
          </Link>
        </div>
      ) : (
        <>
          <main className="p-4 pb-48">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <Link href="/menu" passHref>
                <Button variant="outline" size="sm">
                  Order More
                </Button>
              </Link>
            </div>
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <ul className="divide-y">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex items-center p-3 gap-3">
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-primary font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                          onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        />
                        <p className="font-bold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-3 my-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT (5%)</span>
                <span className="font-semibold">${vatAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <SplitBillSheet 
                isOpen={isSplitSheetOpen}
                onOpenChange={setIsSplitSheetOpen}
                totalAmount={total}
                onSplitsConfirmed={handleSplitsConfirmed}
                initialSplits={splits}
            />

          </main>

          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-3 border-t bg-background/95 backdrop-blur-sm shadow-lg">
            <div className='space-y-2'>
              <Button onClick={handleProceedToPayment} disabled={total <= 0} className="w-full h-12 bg-accent text-accent-foreground text-lg hover:bg-accent/90">
                 Proceed to Payment
              </Button>
            </div>
          </footer>

           <TipSheet
              isOpen={isTipSheetOpen}
              onOpenChange={setIsTipSheetOpen}
              billAmount={total}
              onPaymentConfirmed={(finalAmount, paymentMethod) => {
                const returnUrl = '/success';
                 if (paymentMethod === 'card') {
                    router.push(`/card-payment?amount=${finalAmount}&returnUrl=${encodeURIComponent(returnUrl)}`);
                } else {
                    router.push(`/cash-payment?amount=${finalAmount}&returnUrl=${encodeURIComponent(returnUrl)}`);
                }
              }}
           />
        </>
      )}
    </div>
  );
}
