
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { TipSheet } from '@/components/tip-sheet';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  const { cartItems, updateQuantity, subtotal, loadCart } = useCart();
  const [isTipSheetOpen, setIsTipSheetOpen] = useState(false);
  const router = useRouter();

  const vatRate = 0.05;
  const vatAmount = subtotal * vatRate;
  const tips = 0.00;
  const total = subtotal + vatAmount + tips;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(itemId, newQuantity);
    }
  };
  
  const handleProceedToPayment = () => {
    setIsTipSheetOpen(true);
  };
  
  const handleSplitBill = () => {
      // Since checkout page now has cart items, we load them into the cart before navigating
      // This is a bit of a workaround for the demo flow.
      loadCart(cartItems);
      router.push(`/order-status?table=1&fromCheckout=true`);
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
        <div className="w-8"></div>
      </header>

      {cartItems.length === 0 ? (
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
          <main className="p-4 flex-grow pb-48">
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
                <div className="grid grid-cols-5 gap-2 text-sm text-muted-foreground mb-2">
                    <span className="font-semibold col-span-1 text-center">QTY</span>
                    <span className="font-semibold col-span-3">Product</span>
                    <span className="font-semibold text-right col-span-1">Price</span>
                </div>
                <ul className="divide-y">
                    {cartItems.map(item => (
                        <li key={item.id} className="grid grid-cols-5 gap-2 py-3 items-center">
                            <div className="col-span-1 flex justify-center">
                                <Input 
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                    className="w-14 h-9 text-center"
                                />
                            </div>
                            <span className="col-span-3 font-medium">{item.name}</span>
                            <span className="text-right font-mono col-span-1">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal ({totalItems} items)</span>
                        <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>VAT</span>
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

          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-3 border-t bg-background/95 backdrop-blur-sm shadow-lg space-y-2">
            <Button onClick={handleProceedToPayment} disabled={total <= 0} className="w-full h-12 bg-primary text-primary-foreground text-lg">
                Pay Full Amount
            </Button>
            <Button onClick={handleSplitBill} variant="outline" className="w-full h-12 text-lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Split the Bill
            </Button>
          </footer>

           <TipSheet
              isOpen={isTipSheetOpen}
              onOpenChange={setIsTipSheetOpen}
              billAmount={total}
              onPaymentConfirmed={(finalAmount) => {
                const returnUrl = '/success';
                router.push(`/payment-method?amount=${finalAmount}&returnUrl=${encodeURIComponent(returnUrl)}`);
              }}
           />
        </>
      )}
    </div>
  );
}
