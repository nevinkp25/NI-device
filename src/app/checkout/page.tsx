

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuantitySelector } from '@/components/quantity-selector';
import { CreditCard, Landmark, ArrowLeft, ShoppingCart, Minus, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SegmentedControl, SegmentedControlItem } from '@/components/segmented-control';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';


export default function CheckoutPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [tipPercentage, setTipPercentage] = useState(0.18);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTip, setCustomTip] = useState('');
  const [splitCount, setSplitCount] = useState(1);
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      router.push('/card-payment');
    } else {
      router.push('/cash-payment');
    }
  };

  const tipOptions = [
    { label: '15%', value: 0.15, emoji: '😊' },
    { label: '18%', value: 0.18, emoji: '😄' },
    { label: '20%', value: 0.20, emoji: '🤩' },
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

  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const tipAmount = showCustomTip ? parseFloat(customTip) || 0 : subtotal * tipPercentage;
  const total = subtotal + vatAmount + tipAmount;
  const splitAmount = total / splitCount;
  
  const splitMode = splitCount > 1 ? 'split' : 'full';

  const handleSplitModeChange = (value: string) => {
    if (value === 'split') {
        setIsSplitSheetOpen(true);
    } else {
        setSplitCount(1);
        setIsSplitSheetOpen(false);
    }
  }


  return (
    <div className="flex flex-col bg-background min-h-screen">
      <header className="flex items-center p-4 border-b sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <Link href="/menu" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">Checkout</h1>
        <div className="w-8"></div>
      </header>

      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline font-bold">Your Cart is Empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/menu" passHref>
            <Button className="bg-accent text-accent-foreground">Start Ordering</Button>
          </Link>
        </div>
      ) : (
        <>
          <main className="p-4 pb-56">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <Link href="/menu" passHref>
                <Button variant="outline" size="sm">
                  Order More
                </Button>
              </Link>
            </div>
            <Card className="shadow-md">
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
                    {tipOptions.map(opt => (
                        <Button 
                            key={opt.value}
                            variant={tipPercentage === opt.value && !showCustomTip ? 'default' : 'outline'}
                            onClick={() => handleTipSelection(opt.value)}
                            className="flex-col h-14"
                        >
                           <span className="text-xl">{opt.emoji}</span>
                           <span className="text-xs">{opt.label}</span>
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
            <Sheet open={isSplitSheetOpen} onOpenChange={setIsSplitSheetOpen}>
              <SegmentedControl onValueChange={handleSplitModeChange} value={splitMode} className="mb-4">
                  <SegmentedControlItem value="full" className="flex-1">Pay Full Amount</SegmentedControlItem>
                  <SegmentedControlItem value="split" className="flex-1">Split Bill</SegmentedControlItem>
              </SegmentedControl>
              <SheetContent side="bottom" className="h-full flex flex-col">
                  <SheetHeader>
                     <SheetTitle>Split Bill</SheetTitle>
                  </SheetHeader>
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                     <div className='max-w-sm w-full space-y-8'>
                        <div className="text-center">
                            <p className="text-muted-foreground">Total Amount</p>
                            <h2 className="text-6xl font-bold text-primary">${total.toFixed(2)}</h2>
                        </div>
                        <Card className="flex items-center justify-between p-4">
                            <Button variant="ghost" size="icon" className="h-16 w-16" onClick={() => setSplitCount(Math.max(1, splitCount - 1))}>
                                <Minus className="h-8 w-8" />
                            </Button>
                            <div className="text-center">
                                <p className="font-bold text-5xl">{splitCount}</p>
                                <p className="text-base text-muted-foreground">
                                    {splitCount > 1 ? 'People' : 'Person'}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-16 w-16" onClick={() => setSplitCount(splitCount + 1)}>
                                <Plus className="h-8 w-8" />
                            </Button>
                        </Card>
                        <Card className="p-4 text-center bg-muted">
                            <p className="text-muted-foreground text-lg">Amount per person</p>
                            <p className="font-bold text-5xl">${splitAmount.toFixed(2)}</p>
                        </Card>
                    </div>
                  </div>
                  <SheetFooter className="p-4">
                    <Button onClick={() => setIsSplitSheetOpen(false)} className="w-full h-14 text-lg">
                        Done
                    </Button>
                  </SheetFooter>
              </SheetContent>
            </Sheet>
          </main>

          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-4 border-t bg-background/95 backdrop-blur-sm shadow-lg">
            <div className='space-y-3'>
              <h3 className="text-base font-semibold">Payment Method</h3>
               <div className="grid grid-cols-2 gap-3">
                 <Button variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => setPaymentMethod('card')} className="h-12 flex-col gap-1 shadow-sm">
                  <CreditCard />
                  <span>Card</span>
                </Button>
                <Button variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cash')} className="h-12 flex-col gap-1 shadow-sm">
                  <Landmark />
                  <span>Cash</span>
                </Button>
              </div>
              <Button onClick={handlePayment} className="w-full h-12 bg-accent text-accent-foreground text-lg hover:bg-accent/90 shadow-md">
                 {splitCount > 1 ? `Pay ${splitAmount.toFixed(2)}` : `Pay ${total.toFixed(2)}`}
              </Button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
