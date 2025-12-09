

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { WaiterProfileDialog } from '@/components/waiter-profile-dialog';


function OrderStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { loadCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number}>({isOpen: false, amount: 0});
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const [isWaiterProfileOpen, setIsWaiterProfileOpen] = useState(false);
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');


  const tableNumber = searchParams.get('table');

  useEffect(() => {
    // In a real app, you'd fetch this data based on tableNumber
    if (tableNumber) {
      // For this demo, we'll always load the sample order regardless of the table number.
      setOrder(sampleOrder);
      loadCart(sampleOrder.items);
    }
  }, [tableNumber, loadCart]);

  useEffect(() => {
    // This effect re-opens the split bill sheet when returning from payment
    if(searchParams.has('paidGuest')){
      setIsSplitSheetOpen(true);
    }
  }, [searchParams]);

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
          <div className="w-10"></div>
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
          <div className="w-10"></div>
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
    setTipDetails({isOpen: true, amount: total});
  };
  
  const handleSplitBill = () => {
      setIsSplitSheetOpen(true);
  }

  const handlePostPaid = () => {
    router.push(`/post-paid?orderId=${order.id}`);
  };

  const handlePaymentConfirmed = (finalAmount: number, method: 'card' | 'cash', returnUrl: string = '/success', table?: string) => {
    const params = new URLSearchParams({
        amount: finalAmount.toString(),
        returnUrl: encodeURIComponent(returnUrl),
    });
    if (table) {
        params.set('table', table);
    }
    router.push(`/${method}-payment?${params.toString()}`);
  }


  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center p-4 border-b">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold mx-auto">Order Status</h1>
          <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer">
            <Avatar className="h-10 w-10">
              {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Waiter" />}
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
          </button>
        </header>

        <main className="p-4 flex-grow pb-56">
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

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-3 border-t bg-background/95 backdrop-blur-sm space-y-3">
          <Button onClick={handleProceedToPayment} className="w-full h-14 bg-primary text-primary-foreground text-lg">
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
              onPaymentConfirmed={(finalAmount, method) => handlePaymentConfirmed(finalAmount, method, '/success', tableNumber || undefined)}
          />
          <SplitBillSheet 
              isOpen={isSplitSheetOpen}
              onOpenChange={setIsSplitSheetOpen}
              totalAmount={total}
              onProceedToPayment={(amount) => {
                setIsSplitSheetOpen(false);
                // Open tip sheet for the selected items' total
                setTipDetails({ isOpen: true, amount: amount });
              }}
              baseReturnUrl={`${pathname}?table=${tableNumber}`}
          />
      </div>
      <WaiterProfileDialog
        isOpen={isWaiterProfileOpen}
        onOpenChange={setIsWaiterProfileOpen}
      />
    </>
  );
}

export default function OrderStatusPage() {
    return (
        <Suspense fallback={<div>Loading order...</div>}>
            <OrderStatusContent />
        </Suspense>
    )
}
