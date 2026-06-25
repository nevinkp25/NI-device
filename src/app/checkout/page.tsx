"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, HandCoins, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { QuantitySelector } from '@/components/quantity-selector';
import { SplitBillSheet } from '@/components/split-bill-sheet';
import { TipSheet } from '@/components/tip-sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { WaiterProfileDialog } from '@/components/waiter-profile-dialog';

export default function CheckoutPage() {
  const { cartItems, updateQuantity, subtotal, loadCart, getDisplayPrice } = useCart();
  const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number}>({isOpen: false, amount: 0});
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const [isWaiterProfileOpen, setIsWaiterProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');

  useEffect(() => {
    if(searchParams.has('paidGuest')){
      setIsSplitSheetOpen(true);
    }
  }, [searchParams]);

  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity);
  };
  
  const handleProceedToPayment = () => {
    setTipDetails({isOpen: true, amount: total});
  };
  
  const handleSplitBill = () => {
      setIsSplitSheetOpen(true);
  }

  const handlePostPaid = () => {
    router.push(`/post-paid?orderId=cart`);
  };

  const handlePaymentConfirmed = (finalAmount: number, method: 'card' | 'cash') => {
    const params = new URLSearchParams({
        amount: finalAmount.toString(),
        returnUrl: encodeURIComponent('/success'),
    });
    router.push(`/${method}-payment?${params.toString()}`);
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
        <header className="flex items-center p-4 border-b sticky top-0 bg-background z-10 h-20">
          <Link href="/menu" passHref>
            <Button variant="outline" className="h-14 w-14 rounded-full border-2 border-primary">
              <ArrowLeft className="h-8 w-8" />
            </Button>
          </Link>
          <h1 className="text-3xl font-black mx-auto">CHECKOUT</h1>
          <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer">
            <Avatar className="h-14 w-14 border-2 border-primary">
              {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Waiter" />}
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-8">
            <ShoppingBag className="h-32 w-32 text-muted-foreground" />
            <h2 className="text-4xl font-black">CART IS EMPTY</h2>
            <Link href="/menu" passHref className="w-full">
              <Button className="w-full h-24 text-3xl font-black rounded-2xl bg-primary">GO TO MENU</Button>
            </Link>
          </div>
        ) : (
          <>
            <main className="p-4 flex-grow pb-80">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase">Your Order</h2>
                  <Link href="/menu" passHref>
                    <Button variant="outline" className="h-14 text-xl font-bold px-6 border-2 border-primary">
                      + ADD MORE
                    </Button>
                  </Link>
                </div>

                <Card className="p-4 shadow-xl border-2 border-primary rounded-2xl overflow-hidden">
                    <ul className="divide-y-2 divide-muted">
                        {cartItems.map(item => {
                            const displayPrice = getDisplayPrice(item);
                            return (
                                <li key={item.cartItemId} className="py-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <span className="text-2xl font-black block uppercase">{item.name}</span>
                                            <span className="text-xl font-bold text-primary">${displayPrice.toFixed(2)} each</span>
                                        </div>
                                        <span className="text-2xl font-black font-mono ml-4">${(displayPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-center bg-muted/50 p-2 rounded-2xl">
                                        <QuantitySelector
                                            quantity={item.quantity}
                                            onIncrease={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                                            onDecrease={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                                        />
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="mt-8 pt-6 border-t-4 border-primary space-y-4">
                        <div className="flex justify-between text-2xl font-bold text-muted-foreground">
                            <span>SUBTOTAL</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-muted-foreground">
                            <span>TAX (5%)</span>
                            <span>${vatAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black text-4xl pt-4 border-t-2 mt-4 text-primary">
                            <span>TOTAL</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>
              </div>
            </main>

            <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-4 bg-background border-t-4 border-primary shadow-[0_-10px_30px_rgba(0,0,0,0.1)] space-y-4 z-20">
               <Button onClick={handleProceedToPayment} className="w-full h-24 bg-primary text-primary-foreground text-3xl font-black rounded-2xl shadow-xl flex items-center justify-center gap-4">
                    <span>PAY ${total.toFixed(2)}</span>
                </Button>
              <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleSplitBill} variant="outline" className="h-20 text-xl font-black border-4 border-primary rounded-2xl">
                    SPLIT BILL
                  </Button>
                  <Button onClick={handlePostPaid} variant="outline" className="h-20 text-xl font-black border-4 border-primary rounded-2xl text-accent">
                    POST-PAID
                  </Button>
              </div>
            </footer>

             <TipSheet
                isOpen={tipDetails.isOpen}
                onOpenChange={(isOpen) => setTipDetails(prev => ({...prev, isOpen}))}
                billAmount={tipDetails.amount}
                onPaymentConfirmed={handlePaymentConfirmed}
             />
             <SplitBillSheet 
                  isOpen={isSplitSheetOpen}
                  onOpenChange={setIsSplitSheetOpen}
                  totalAmount={total}
                  onProceedToPayment={(amount) => {
                    setIsSplitSheetOpen(false);
                    setTipDetails({ isOpen: true, amount: amount });
                  }}
                  baseReturnUrl={pathname}
             />
          </>
        )}
        <WaiterProfileDialog isOpen={isWaiterProfileOpen} onOpenChange={setIsWaiterProfileOpen} />
    </div>
  );
}