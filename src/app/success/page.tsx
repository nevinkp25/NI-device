
"use client";

import { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';

function SuccessContent() {
  const { clearCart, cartItems, subtotal } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearedCart = useRef(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const returnUrl = searchParams.get('returnUrl') || '/';
  const isSplitPayment = returnUrl.includes('checkout');

  // Keep a stable copy of cart data for the receipt
  const receiptItems = useRef(cartItems).current;
  const receiptSubtotal = useRef(subtotal).current;

  useEffect(() => {
    // Generate order number only on the client
    setOrderNumber(Math.floor(Math.random() * 90000) + 10000);
    
    if (receiptItems.length === 0 && subtotal <= 0 && !isSplitPayment) {
      // If there's nothing to show, go to the start.
      router.replace('/');
    } else if (isSplitPayment) {
        // If it's a split payment, redirect back to checkout after a delay
        const timer = setTimeout(() => {
            router.push(returnUrl);
        }, 2000); // 2 second delay
        return () => clearTimeout(timer);
    }
  }, [receiptItems.length, router, isSplitPayment, returnUrl, subtotal]);
  
  // Clear cart only once on mount IF it's the final payment
  useEffect(() => {
    if (!clearedCart.current && !isSplitPayment) {
      clearCart();
      clearedCart.current = true;
    }
  }, [clearCart, isSplitPayment]);

  if (isSplitPayment) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen bg-muted/30 p-4">
            <div className="relative w-full max-w-sm bg-card rounded-lg shadow-xl p-6 pt-12">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="animate-in fade-in zoom-in-50 duration-1000">
                    <CheckCircle2 className="h-16 w-16 text-green-500 bg-card rounded-full p-1" />
                </div>
                </div>
                <h1 className="text-2xl font-headline font-bold mt-2 mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4">
                    Returning to checkout for the next payment...
                </p>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-muted/30 p-4 overflow-hidden">
      <div className="relative w-full max-w-sm bg-card rounded-lg shadow-xl p-6 pt-12">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
           <div className="animate-in fade-in zoom-in-50 duration-1000">
            <CheckCircle2 className="h-16 w-16 text-green-500 bg-card rounded-full p-1" />
          </div>
        </div>
        
        <div className="animate-receipt-scroll-up origin-bottom">
          <h1 className="text-2xl font-headline font-bold mt-2 mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you for your order!
          </p>
          
          <div className="my-6 border-t-2 border-b-2 border-dashed py-4 space-y-2 text-left text-sm">
            {receiptItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total Paid</span>
            <span>${receiptSubtotal.toFixed(2)}</span>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            {orderNumber && <p>Your order number is #{orderNumber}.</p>}
            <p>A receipt has been sent to your email.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-5 delay-1000 duration-700">
        <Link href="/" passHref>
          <Button className="h-12 px-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90">
            New Order
          </Button>
        </Link>
      </div>

       <style jsx>{`
        @keyframes receipt-scroll-up {
          from {
            transform: translateY(100%) scaleY(0);
            opacity: 0;
          }
          to {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
        }
        .animate-receipt-scroll-up {
          animation: receipt-scroll-up 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Processing...</div>}>
            <SuccessContent />
        </Suspense>
    )
}

    