
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SegmentedControl, SegmentedControlItem } from '@/components/segmented-control';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { sampleOrder, type Order } from '@/lib/data';
import { useCart } from '@/context/cart-context';
import { format } from 'date-fns';

function OrderStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

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
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleProceedToPayment = () => {
    router.push('/checkout');
  };
  
  const handleSplitBill = () => {
      router.push('/checkout?split=true');
  }

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

      <main className="p-4 flex-grow">
        <div className="space-y-4">
          <SegmentedControl value={`order-${order.id}`} className="w-full">
            <SegmentedControlItem value={`order-${order.id}`} className="flex-1">Order # {order.id}</SegmentedControlItem>
            <SegmentedControlItem value={`table-${tableNumber}`} className="flex-1">Table # {tableNumber}</SegmentedControlItem>
          </SegmentedControl>
          
          <p className="text-center text-primary font-semibold">
            {format(new Date(order.date), "MMMM d, yyyy 'at' hh:mm a")}
          </p>

          <Card className="p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                <span className="font-semibold">Qty</span>
                <span className="font-semibold col-span-1">Product</span>
                <span className="font-semibold text-right">Price (AED)</span>
            </div>
             <ul className="divide-y">
                {order.items.map(item => (
                    <li key={item.id} className="grid grid-cols-3 gap-2 py-3">
                        <span>{item.quantity}</span>
                        <span className="col-span-1 font-medium">{item.name}</span>
                        <span className="text-right font-mono">${(item.price * item.quantity).toFixed(2)}</span>
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

      <footer className="p-3 border-t bg-background space-y-2">
        <Button onClick={handleProceedToPayment} className="w-full h-12 bg-primary text-primary-foreground text-lg">
           Pay Full Amount
        </Button>
         <Button onClick={handleSplitBill} variant="outline" className="w-full h-12 text-lg">
           <UserPlus className="mr-2 h-5 w-5" />
           Split the Bill
        </Button>
      </footer>
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
