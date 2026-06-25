
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag, Loader2, Info, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { QuantitySelector } from '@/components/quantity-selector';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WaiterProfileDialog } from '@/components/waiter-profile-dialog';
import { OrderStepper } from '@/components/order-stepper';

export default function CheckoutPage() {
  const { cartItems, updateQuantity, subtotal, getDisplayPrice, orderInstructions } = useCart();
  const [isWaiterProfileOpen, setIsWaiterProfileOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const router = useRouter();
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');

  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity);
  };
  
  const handlePlaceOrder = () => {
    setIsPlacing(true);
    // Simulate API call to send order to kitchen
    setTimeout(() => {
      const orderId = Math.floor(1000 + Math.random() * 9000).toString();
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 2000);
  };

  const getVariationString = (item: any) => {
    const variationValues = Object.values(item.selectedVariations);
    if (variationValues.length === 0) return null;
    return variationValues.join(', ');
  }

  return (
    <div className="flex flex-col bg-slate-50/50 min-h-screen">
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="flex items-center p-4 h-16">
            <Link href="/menu" passHref>
              <Button variant="ghost" size="icon" className="text-slate-600">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold mx-auto text-slate-900 tracking-tight uppercase">Review Selection</h1>
            <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Waiter" />}
                <AvatarFallback>W</AvatarFallback>
              </Avatar>
            </button>
          </div>
          <OrderStepper currentStep={3} />
        </header>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="bg-white p-8 rounded-full shadow-sm">
                <ShoppingBag className="h-16 w-16 text-slate-200" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
                <p className="text-sm text-slate-500 max-w-[240px]">Browse our menu to add some delicious items to your order.</p>
            </div>
            <Link href="/menu" passHref className="w-full max-w-xs">
              <Button className="w-full h-14 text-lg font-bold rounded-xl bg-primary">GO TO MENU</Button>
            </Link>
          </div>
        ) : (
          <>
            <main className="p-4 flex-grow pb-48 animate-in fade-in duration-500">
              <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Current Selection</h2>
                  <Link href="/menu" passHref>
                    <Button variant="ghost" className="h-10 text-xs font-bold text-primary hover:bg-primary/5 uppercase tracking-widest">
                      + Add Items
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                    {cartItems.map(item => {
                        const displayPrice = getDisplayPrice(item);
                        const variationString = getVariationString(item);
                        return (
                            <Card key={item.cartItemId} className="p-4 border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow">
                                        <span className="text-base font-bold text-slate-900 block leading-tight tracking-tight">{item.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 block mt-1 uppercase tracking-widest">${displayPrice.toFixed(2)} each</span>
                                        {variationString && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            <span className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                                              {variationString}
                                            </span>
                                          </div>
                                        )}
                                        {item.specialInstructions && (
                                            <div className="mt-2 flex items-start gap-1.5 text-primary">
                                                <MessageSquareText className="h-3 w-3 mt-0.5" />
                                                <p className="text-[10px] font-medium italic">{item.specialInstructions}</p>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-lg font-bold text-slate-900 tabular-nums">${(displayPrice * item.quantity).toFixed(2)}</span>
                                </div>
                                <div className="bg-slate-50/50 rounded-xl">
                                    <QuantitySelector
                                        quantity={item.quantity}
                                        onIncrease={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                                        onDecrease={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                                        className="h-10 bg-transparent border-none"
                                    />
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {orderInstructions && (
                    <Card className="p-4 bg-primary/[0.03] border-primary/10 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                             <MessageSquareText className="h-4 w-4 text-primary" />
                             <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Overall Kitchen Note</h3>
                        </div>
                        <p className="text-sm text-slate-700 font-medium italic">"{orderInstructions}"</p>
                    </Card>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
                    <div className="flex justify-between text-sm font-semibold text-slate-500">
                        <span>SUBTOTAL</span>
                        <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-slate-500">
                        <span>TAX (5%)</span>
                        <span className="tabular-nums">${vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-3xl font-bold text-slate-900 tabular-nums tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                </div>
              </div>
            </main>

            <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-5 bg-white border-t-2 border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 space-y-4">
              <Button 
                onClick={handlePlaceOrder} 
                disabled={isPlacing}
                className="w-full h-16 bg-[#E54360] hover:bg-[#D43D56] text-white text-lg font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                  {isPlacing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                        <span>PLACE ORDER</span>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">${total.toFixed(2)}</span>
                    </>
                  )}
              </Button>
              <div className="flex items-start gap-2.5 px-2 text-slate-400">
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-300" />
                  <p className="text-[10px] font-medium leading-relaxed">
                      Final amount may include applicable taxes and service charges depending on payment method.
                  </p>
              </div>
            </footer>
          </>
        )}
        <WaiterProfileDialog isOpen={isWaiterProfileOpen} onOpenChange={setIsWaiterProfileOpen} />
    </div>
  );
}
