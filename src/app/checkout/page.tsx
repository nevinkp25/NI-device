
"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, HandCoins } from 'lucide-react';
import Link from 'next/link';
import { QuantitySelector } from '@/components/quantity-selector';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SplitBillSheet } from '@/components/split-bill-sheet';
import { SplitByItemSheet } from '@/components/split-by-item-sheet';
import { TipSheet } from '@/components/tip-sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { cartItems, updateQuantity, subtotal, loadCart, getDisplayPrice } = useCart();
  const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number}>({isOpen: false, amount: 0});
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const [isSplitByItemSheetOpen, setIsSplitByItemSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');

  useEffect(() => {
    // This effect re-opens the split bill sheet when returning from payment
    if(searchParams.has('paidGuest')){
      setIsSplitSheetOpen(true);
    }
  }, [searchParams]);


  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const tips = 0.00;
  const total = subtotal + vatAmount + tips;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(cartItemId, newQuantity);
    }
  };
  
  const handleProceedToPayment = () => {
    setTipDetails({isOpen: true, amount: total});
  };
  
  const handleSplitBill = () => {
      loadCart(cartItems);
      setIsSplitSheetOpen(true);
  }

  const handlePostPaid = () => {
    router.push(`/post-paid?orderId=cart`);
  };

  const handlePaymentConfirmed = (finalAmount: number, returnUrl: string = '/success', table?: string) => {
    const params = new URLSearchParams({
        amount: finalAmount.toString(),
        returnUrl: encodeURIComponent(returnUrl),
    });
    if (table) {
        params.set('table', table);
    }
    router.push(`/payment-method?${params.toString()}`);
  }
  
  const getVariationString = (item: (typeof cartItems)[0]) => {
    const variationValues = Object.values(item.selectedVariations);
    if (variationValues.length === 0) return null;
    return variationValues.join(', ');
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <header className="flex items-center p-4 border-b sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <Link href="/menu" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Checkout</h1>
        <Avatar className="h-10 w-10">
          {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Waiter" />}
          <AvatarFallback>W</AvatarFallback>
        </Avatar>
      </header>

      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4 h-16 w-16"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/menu" passHref>
            <Button className="bg-accent text-accent-foreground">Start Ordering</Button>
          </Link>
        </div>
      ) : (
        <>
          <main className="p-4 flex-grow pb-56">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <Link href="/menu" passHref>
                  <Button variant="outline" size="sm">
                    Order More
                  </Button>
                </Link>
              </div>

              <Card className="p-4 shadow-sm">
                <div className="grid grid-cols-6 gap-4 text-sm text-muted-foreground mb-2">
                    <span className="font-semibold col-span-2 text-left">QTY</span>
                    <span className="font-semibold col-span-3">Product</span>
                    <span className="font-semibold text-right col-span-1">Price</span>
                </div>
                <TooltipProvider>
                    <ul className="divide-y">
                        {cartItems.map(item => {
                            const displayPrice = getDisplayPrice(item);
                            const variationString = getVariationString(item);
                            return (
                                <li key={item.cartItemId} className="grid grid-cols-6 gap-4 py-3 items-center">
                                    <div className="col-span-2 flex justify-start">
                                        <QuantitySelector
                                            quantity={item.quantity}
                                            onIncrease={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                                            onDecrease={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                                        />
                                    </div>
                                    <div className="col-span-3 font-medium truncate">
                                      <Tooltip>
                                          <TooltipTrigger asChild>
                                              <div>
                                                <span className="truncate block">{item.name}</span>
                                                {variationString && <span className="text-xs text-muted-foreground truncate block">{variationString}</span>}
                                              </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{item.name}</p>
                                              {variationString && <p className="text-xs text-muted-foreground">{variationString}</p>}
                                          </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <span className="text-right font-mono col-span-1">${(displayPrice * item.quantity).toFixed(2)}</span>
                                </li>
                            )
                        })}
                    </ul>
                </TooltipProvider>
                <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>VAT (5%)</span>
                        <span className="font-mono">${vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Tips</span>
                        <span className="font-mono">${tips.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>Total</span>
                        <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                </div>
              </Card>
            </div>
          </main>

          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-3 border-t bg-background/95 backdrop-blur-sm shadow-lg space-y-3">
             <Button onClick={handleProceedToPayment} disabled={total <= 0} className="w-full h-14 bg-primary text-primary-foreground text-lg">
                  Pay Full Amount (${total.toFixed(2)})
              </Button>
            <div className="flex justify-around items-center">
                 <Button onClick={handleSplitBill} variant="link" className="text-base text-primary">
                  Split the Bill
              </Button>
              <Separator orientation="vertical" className="h-6"/>
               <Button onClick={handlePostPaid} variant="link" className="text-base text-primary">
                <HandCoins className="mr-2 h-5 w-5" />
                Mark as Post-Paid
            </Button>
            </div>
          </footer>

           <TipSheet
              isOpen={tipDetails.isOpen}
              onOpenChange={(isOpen) => setTipDetails(prev => ({...prev, isOpen}))}
              billAmount={tipDetails.amount}
              onPaymentConfirmed={(finalAmount) => handlePaymentConfirmed(finalAmount)}
           />
           <SplitBillSheet 
                isOpen={isSplitSheetOpen}
                onOpenChange={setIsSplitSheetOpen}
                totalAmount={total}
                onSplitByItem={() => {
                  setIsSplitSheetOpen(false);
                  setIsSplitByItemSheetOpen(true);
                }}
                baseReturnUrl={pathname}
           />
           <SplitByItemSheet
                isOpen={isSplitByItemSheetOpen}
                onOpenChange={setIsSplitByItemSheetOpen}
                onProceedToPayment={(amount) => {
                  setIsSplitByItemSheetOpen(false);
                  setTipDetails({ isOpen: true, amount: amount });
                }}
           />
        </>
      )}
    </div>
  );
}
