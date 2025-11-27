"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuantitySelector } from '@/components/quantity-selector';
import { CreditCard, Landmark, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const router = useRouter();

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      router.push('/card-payment');
    } else {
      router.push('/cash-payment');
    }
  };
  
  const total = subtotal; // Assuming no tax/fees for this example

  return (
    <div className="flex flex-col h-screen bg-background">
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
          <main className="flex-grow overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <Card>
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
                        <div className="flex flex-col items-end gap-2 w-16 text-right">
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </main>

          <footer className="p-4 border-t bg-background">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <Button variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => setPaymentMethod('card')} className="h-16 flex-col gap-1 bg-primary text-primary-foreground border-primary data-[variant=outline]:bg-transparent data-[variant=outline]:text-primary">
                  <CreditCard />
                  <span>Card</span>
                </Button>
                <Button variant={paymentMethod === 'cash' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cash')} className="h-16 flex-col gap-1 bg-primary text-primary-foreground border-primary data-[variant=outline]:bg-transparent data-[variant=outline]:text-primary">
                  <Landmark />
                  <span>Cash</span>
                </Button>
              </div>
              <Button onClick={handlePayment} className="w-full h-14 bg-accent text-accent-foreground text-lg hover:bg-accent/90">
                Proceed to Payment
              </Button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
