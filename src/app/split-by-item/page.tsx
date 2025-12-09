
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function SplitByItemPage() {
  const { cartItems, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const itemsToPay = useMemo(() => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  }, [cartItems, selectedItems]);

  const paymentSubtotal = useMemo(() => {
    return itemsToPay.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [itemsToPay]);
  
  const vatAmount = paymentSubtotal * 0.05;
  const total = paymentSubtotal + vatAmount;

  const handleProceedToPayment = () => {
    if (itemsToPay.length === 0) return;
    
    // This is a temporary solution for the demo. In a real app, you'd want a more robust
    // way to handle which items have been paid for.
    const paidItemIds = itemsToPay.map(item => item.id);

    const updatedCartItems = cartItems.filter(item => !paidItemIds.includes(item.id));
    
    // For the purpose of this demo, we'll remove the paid items from the main cart context
    // after the payment flow is initiated.
    // A better approach would be to do this on payment success.
    paidItemIds.forEach(id => removeFromCart(id));

    const returnUrl = '/checkout';
    router.push(`/payment-method?amount=${total}&returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <header className="flex items-center p-4 border-b sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <Link href="/checkout" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Split by Item</h1>
        <div className="w-8"></div>
      </header>

      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold">Bill Settled!</h2>
            <p className="text-muted-foreground mt-2 mb-6">All items have been paid for.</p>
            <Link href="/navigation" passHref>
                <Button className="bg-accent text-accent-foreground">Back to Home</Button>
            </Link>
        </div>
      ) : (
        <>
          <main className="p-4 flex-grow pb-48">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Select items to pay</h2>
              
              <Card className="p-4 shadow-sm">
                <p className='text-sm text-muted-foreground mb-4'>Select one or more items to pay for now. The remaining items can be paid for by the next person.</p>
                <ul className="divide-y">
                  {cartItems.map(item => (
                    <li key={item.id} className="py-2">
                        <div 
                            className="flex items-center gap-4 p-2 rounded-lg"
                        >
                            <Checkbox 
                                id={`item-${item.id}`} 
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => handleItemSelect(item.id)}
                                className="h-6 w-6"
                            />
                            <Label 
                                htmlFor={`item-${item.id}`}
                                className="flex-grow flex justify-between items-center cursor-pointer"
                            >
                                <div>
                                    <p className="font-medium">{item.name} <span className="text-muted-foreground text-sm">x{item.quantity}</span></p>
                                </div>
                                <span className="font-mono font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </Label>
                        </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </main>

          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-3 border-t bg-background/95 backdrop-blur-sm shadow-lg">
            <div className='p-2 space-y-1 mb-2'>
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono">${paymentSubtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-muted-foreground">
                    <span>VAT (5%)</span>
                    <span className="font-mono">${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-1 border-t mt-1">
                    <span>Total for Selected Items</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                </div>
            </div>
            <Button 
                onClick={handleProceedToPayment} 
                disabled={itemsToPay.length === 0} 
                className="w-full h-14 bg-primary text-primary-foreground text-lg"
            >
                Pay for Selected Items (${total.toFixed(2)})
            </Button>
          </footer>
        </>
      )}
    </div>
  );
}
