
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SegmentedControl, SegmentedControlItem } from '@/components/segmented-control';
import { ArrowLeft, HandCoins } from 'lucide-react';
import Link from 'next/link';
import { sampleOrder, type Order } from '@/lib/data';
import { useCart } from '@/context/cart-context';
import { format } from 'date-fns';
import { TipSheet } from '@/components/tip-sheet';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SplitBillSheet } from '@/components/split-bill-sheet';


function OrderStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isTipSheetOpen, setIsTipSheetOpen] = useState(false);
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);


  const tableNumber = searchParams.get('table');

  useEffect(() => {
    // In a real app, you'd fetch this data based on tableNumber
    if (tableNumber) {
      // For this demo, we'll always load the sample order regardless of the table number.
      setOrder(sampleOrder);
      loadCart(sampleOrder.items);
    }
  }, [tableNumber, loadCart]);

  if (!tableNumber) {
    return (
       <div className="flex flex-col h-screen bg-background text-foreground">
         <header className="flex items-center p-4 border-b">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold mx-auto">Order Status</h1>
          <div className="w-8"></div>
        </header>
        <div className="flex-grow flex items-center justify-center">
            <p>Please go back and enter a table number.</p>
        </div>
      </div>
    )
  }

  if (!order) {
    // This state will briefly appear while the order is being loaded.
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
         <header className="flex items-center p-4 border-b">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold mx-auto">Order Status</h1>
          <div className="w-8"></div>
        </header>
        <div className="flex-grow flex items-center justify-center p-4 text-center">
            <div>
              <p className="text-lg">Loading order for table <span className='font-bold'>{tableNumber}</span>...</p>
            </div>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vatAmount = subtotal * 0.05;
  const tips = 0.00;
  const total = subtotal + vatAmount + tips;

  const handleProceedToPayment = () => {
    setIsTipSheetOpen(true);
  };
  
  const handleSplitBill = () => {
      setIsSplitSheetOpen(true);
  }

  const handlePostPaid = () => {
    router.push(`/post-paid?orderId=${order.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href="/order-by-table" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Order Status</h1>
        <div className="w-8"></div>
      </header>

      <main className="p-4 flex-grow pb-48">
        <div className="space-y-4">
          <SegmentedControl value={`order-${order.id}`} className="w-full">
            <SegmentedControlItem value={`order-${order.id}`} className="flex-1">Order # {order.id}</SegmentedControlItem>
            <SegmentedControlItem value={`table-${tableNumber}`} className="flex-1">Table # {tableNumber}</SegmentedControlItem>
          </SegmentedControl>
          
          <p className="text-center text-primary font-semibold">
            {format(new Date(order.date), "MMMM d, yyyy 'at' hh:mm a")}
          </p>

          <Card className="p-4 shadow-sm">
            <div className="grid grid-cols-5 gap-2 text-sm text-muted-foreground mb-2">
                <span className="font-semibold col-span-1">Qty</span>
                <span className="font-semibold col-span-3">Product</span>
                <span className="font-semibold text-right col-span-1">Price</span>
            </div>
             <TooltipProvider>
              <ul className="divide-y">
                  {order.items.map(item => (
                      <li key={item.id} className="grid grid-cols-5 gap-2 py-3 items-center">
                          <span className='col-span-1'>{item.quantity}</span>
                          <div className="col-span-3 font-medium truncate">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="truncate block">{item.name}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.name}</p>
                                </TooltipContent>
                            </Tooltip>
                          </div>
                          <span className="text-right font-mono col-span-1">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                  ))}
              </ul>
            </TooltipProvider>
             <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
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

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-3 border-t bg-background/95 backdrop-blur-sm grid grid-cols-2 gap-3">
        <Button onClick={handleSplitBill} variant="outline" className="w-full h-14 text-base">
            Split the Bill
        </Button>
        <Button onClick={handleProceedToPayment} className="w-full h-14 bg-primary text-primary-foreground text-lg">
           Pay Full Amount
        </Button>
      </footer>
        <TipSheet
            isOpen={isTipSheetOpen}
            onOpenChange={setIsTipSheetOpen}
            billAmount={total}
            onPaymentConfirmed={(finalAmount) => {
              const returnUrl = `/success`;
              router.push(`/payment-method?amount=${finalAmount}&returnUrl=${encodeURIComponent(returnUrl)}&table=${tableNumber}`);
            }}
        />
        <SplitBillSheet 
            isOpen={isSplitSheetOpen}
            onOpenChange={setIsSplitSheetOpen}
            totalAmount={total}
        />

    </div>
  );
}

export default function OrderStatusPage() {
    return (
        <Suspense fallback={<div>Loading order...</div>}>
            <OrderStatusContent />
        </Suspense>
    )
}
