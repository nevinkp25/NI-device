

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuantitySelector } from '@/components/quantity-selector';
import { CreditCard, Landmark, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { SegmentedControl, SegmentedControlItem } from '@/components/segmented-control';
import { SplitBillSheet } from '@/components/split-bill-sheet';
import type { Split } from '@/components/split-bill-sheet';


export default function CheckoutPage() {
  const { cartItems, updateQuantity, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [tipPercentage, setTipPercentage] = useState(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTip, setCustomTip] = useState('');
  const [splitMode, setSplitMode] = useState<'full' | 'split'>('full');
  const [splits, setSplits] = useState<Split[]>([{ id: 1, amount: 0, isPaid: false }]);
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isReturningFromSplit = searchParams.get('split') === 'true';

  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const tipAmount = showCustomTip ? parseFloat(customTip) || 0 : subtotal * tipPercentage;
  const total = subtotal + vatAmount + tipAmount;

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
  
  const handlePayment = () => {
    const amountToPay = splits.find(s => !s.isPaid)?.amount || 0;
    
    const returnUrl = splitMode === 'split' 
      ? `/checkout?split=true`
      : '/success';

    if (paymentMethod === 'card') {
      router.push(`/card-payment?amount=${amountToPay}&returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      router.push(`/cash-payment?amount=${amountToPay}&returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  const tipOptions = [
    { label: '15%', value: 0.15 },
    { label: '18%', value: 0.18 },
    { label: '20%', value: 0.20 },
  ];

  const handleTipSelection = (value: number) => {
    setTipPercentage(value);
    setShowCustomTip(false);
    setCustomTip('');
  };
  
  const handleCustomTipClick = () => {
      setShowCustomTip(true);
      setTipPercentage(0);
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tip</span>
                <span className="font-semibold">${tipAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Tip Section */}
            <div className="mb-4">
                 <h3 className="text-lg font-semibold mb-3">Add a Tip</h3>
                 <div className="grid grid-cols-4 gap-2 mb-2">
                    <Button 
                        variant={tipPercentage === 0 && !showCustomTip ? 'default' : 'outline'}
                        onClick={() => handleTipSelection(0)}
                        className="h-14"
                    >
                       No Tip
                    </Button>
                    {tipOptions.map(opt => (
                        <Button 
                            key={opt.value}
                            variant={tipPercentage === opt.value && !showCustomTip ? 'default' : 'outline'}
                            onClick={() => handleTipSelection(opt.value)}
                            className="h-14 text-lg"
                        >
                           {opt.label}
                        </Button>
                    ))}
                     <Button 
                        variant={showCustomTip ? 'default' : 'outline'}
                        onClick={handleCustomTipClick}
                        className="h-14"
                    >
                       Custom
                    </Button>
                 </div>
                 {showCustomTip && (
                     <div className="animate-in fade-in-0 duration-300">
                        <Input 
                            type="number"
                            placeholder="Enter custom tip amount"
                            value={customTip}
                            onChange={(e) => setCustomTip(e.target.value)}
                            className="h-12 text-center"
                        />
                     </div>
                 )}
            </div>
            
            {/* Split Bill Section */}
            <SegmentedControl onValueChange={handleSplitModeChange} value={splitMode} className="mb-4">
                <SegmentedControlItem value="full" className="flex-1">Pay Full Amount</SegmentedControlItem>
                <SegmentedControlItem value="split" className="flex-1">Split Bill</SegmentedControlItem>
            </SegmentedControl>
            
            {splitMode === 'split' && (
                <Card className="p-4 bg-muted">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-muted-foreground">{splits.filter(s => !s.isPaid).length} of {splits.length} payments remaining</p>
                            <p className="font-bold text-2xl">${amountToPay.toFixed(2)} / person</p>
                        </div>
                        <Button variant="secondary" onClick={() => setIsSplitSheetOpen(true)}>Edit Split</Button>
                    </div>
                </Card>
            )}

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
              <h3 className="text-sm font-semibold px-1">Payment Method</h3>
               <div className="grid grid-cols-2 gap-2">
                 <Button variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => setPaymentMethod('card')} className="h-12 flex-col gap-1">
                  <CreditCard />
                  <span>Card</span>
                </Button>
                <Button variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cash')} className="h-12 flex-col gap-1">
                  <Landmark />
                  <span>Cash</span>
                </Button>
              </div>
              <Button onClick={handlePayment} disabled={amountToPay <= 0} className="w-full h-12 bg-accent text-accent-foreground text-lg hover:bg-accent/90">
                 Pay ${amountToPay.toFixed(2)}
              </Button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
