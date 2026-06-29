'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Home, Receipt, User, Clock, ChevronRight, Info, Calendar, X } from 'lucide-react';
import Link from 'next/navigation';
import { sampleOrder, type Order, type CartItem } from '@/lib/data';
import { useCart } from '@/context/cart-context';
import { format } from 'date-fns';
import { TipSheet } from '@/components/tip-sheet';
import { SplitBillSheet } from '@/components/split-bill-sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { OrderStepper, Step } from '@/components/order-stepper';
import { cn } from '@/lib/utils';

function OrderStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { loadCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number}>({isOpen: false, amount: 0});
  const [isSplitSheetOpen, setIsSplitSheetOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<CartItem | null>(null);

  const tableNumber = searchParams.get('table');

  const settlementSteps: Step[] = [
    { id: 1, label: "TABLE" },
    { id: 2, label: "STATUS" },
  ];

  useEffect(() => {
    if (tableNumber) {
      setOrder(sampleOrder);
      loadCart(sampleOrder.items);
    }
  }, [tableNumber, loadCart]);

  if (!tableNumber) {
    return (
       <div className="flex flex-col h-screen bg-slate-50 text-foreground">
         <header className="flex items-center p-4 border-b bg-white">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold mx-auto uppercase text-slate-900">Table Settlement</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex items-center justify-center p-8 text-center">
            <p className="text-slate-400 font-bold uppercase text-sm">Select a table from the dashboard to begin settlement.</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 text-foreground">
         <header className="flex items-center p-4 border-b bg-white">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold mx-auto uppercase text-slate-900">Syncing...</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-12 w-12 bg-slate-100 rounded-full animate-pulse" />
            <p className="text-slate-400 font-bold uppercase text-sm">Retrieving Table {tableNumber} Account...</p>
        </div>
      </div>
    )
  }

  // Financial Calculations
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const extraCharges = subtotal * 0.10; // 10% Service Charge
  const vatAmount = (subtotal + extraCharges) * 0.05; // 5% VAT on subtotal + extras
  const tips = 0; // Default 0
  const total = subtotal + extraCharges + vatAmount + tips;

  const handleProceedToPayment = () => {
    setTipDetails({isOpen: true, amount: total});
  };
  
  const handleSplitBill = () => {
      setIsSplitSheetOpen(true);
  }

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
      <div className="flex flex-col min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="flex items-center p-4 h-16">
            <Link href="/order-by-table?mode=settlement" passHref>
              <Button variant="ghost" size="icon" className="text-slate-600 h-10 w-10">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex flex-col items-center mx-auto">
                <h1 className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Terminal Audit</h1>
                <h2 className="text-lg font-bold text-slate-900 uppercase leading-none">Table {tableNumber}</h2>
            </div>
            <Link href="/navigation" passHref>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <OrderStepper currentStep={2} steps={settlementSteps} />
        </header>

        <main className="p-4 flex-grow pb-56 space-y-6 max-w-[420px] mx-auto w-full">
          <div className="space-y-3 px-1">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-slate-900 uppercase">Order #{order.id}</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-xs font-bold uppercase py-0.5 px-3 h-6">Open</Badge>
                </div>
             </div>
             <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-500 uppercase border-y border-slate-100 py-4">
                <span className="flex items-center gap-2"><User className="h-4 w-4 text-slate-300" /> David R.</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-300" /> {format(new Date(order.date), "hh:mm a")}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-300" /> {format(new Date(order.date), "MMM d, yyyy")}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Receipt className="h-5 w-5 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-500 uppercase">Itemized Statement</h3>
            </div>
            
            <div className="space-y-2">
                {order.items.map(item => (
                    <div 
                      key={item.cartItemId} 
                      className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition-all cursor-pointer shadow-sm"
                      onClick={() => setSelectedItemForDetail(item)}
                    >
                        <div className="flex items-center gap-4">
                            <span className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-black text-slate-500 border border-slate-100">{item.quantity}</span>
                            <div className="space-y-1">
                                <p className="text-base font-bold text-slate-800 leading-tight uppercase">{item.name}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase">${item.price.toFixed(2)} unit</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-black text-slate-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-slate-50/50 rounded-[2rem] p-8 space-y-4 border border-slate-100 shadow-inner">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-black text-slate-900 text-sm">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                    <span>Service Charge (10%)</span>
                    <span className="tabular-nums font-black text-slate-900 text-sm">${extraCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                    <span>VAT (5%)</span>
                    <span className="tabular-nums font-black text-slate-900 text-sm">${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                    <span>Gratuity</span>
                    <span className="tabular-nums font-black text-slate-900 text-sm">${tips.toFixed(2)}</span>
                </div>
                <Separator className="bg-slate-200/50 my-2" />
                <div className="flex justify-between items-end pt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase leading-none">Total Balance</span>
                      <span className="text-xs font-black text-primary uppercase leading-none">Order ID: {order.id}</span>
                    </div>
                    <span className="text-4xl font-black text-primary tabular-nums">${total.toFixed(2)}</span>
                </div>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 space-y-4">
          <Button 
            onClick={handleProceedToPayment} 
            className="w-full h-20 bg-primary hover:bg-primary/90 text-white text-xl font-bold rounded-2xl shadow-lg flex items-center justify-center gap-6 uppercase transition-all active:scale-[0.98]"
          >
              <span>Pay Full Amount</span>
              <div className="h-8 w-px bg-white/20" />
              <span className="bg-white/10 px-4 py-1.5 rounded-xl text-lg font-black">${total.toFixed(2)}</span>
          </Button>
          
          <Button 
            onClick={handleSplitBill} 
            variant="outline" 
            className="w-full h-16 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-500 uppercase hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
              Split Bill Between Guests
          </Button>
        </footer>

        {/* Item Audit Detail Sheet */}
        <Sheet open={!!selectedItemForDetail} onOpenChange={(open) => !open && setSelectedItemForDetail(null)}>
          <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton={true}>
            <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-4 mb-2" />
            <SheetHeader className="p-8 flex-row items-center justify-between bg-white border-b rounded-t-[2.5rem] shadow-sm">
              <div className="flex items-center gap-5 text-left">
                 <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                    <Info className="h-6 w-6 text-primary" />
                 </div>
                 <div className="space-y-1">
                    <SheetTitle className="text-xl font-bold text-slate-900 uppercase leading-none">{selectedItemForDetail?.name}</SheetTitle>
                    <p className="text-xs text-slate-400 font-bold uppercase leading-none">Kitchen Service Log</p>
                 </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200">
                  <X className="h-6 w-6 text-slate-500" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="p-8 space-y-10 pb-16">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 space-y-2 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase">Qty Ordered</p>
                        <p className="text-3xl font-black text-slate-900">{selectedItemForDetail?.quantity}x</p>
                    </div>
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 space-y-2 shadow-sm text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">Line Total</p>
                        <p className="text-3xl font-black text-slate-900 tabular-nums">${((selectedItemForDetail?.price || 0) * (selectedItemForDetail?.quantity || 1)).toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase px-1">Kitchen Preferences</h4>
                    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] space-y-6 shadow-sm">
                        {selectedItemForDetail?.selectedVariations && Object.keys(selectedItemForDetail.selectedVariations).length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-slate-300 uppercase">Variations</p>
                                <div className="flex flex-wrap gap-3">
                                    {Object.values(selectedItemForDetail.selectedVariations).map((v, i) => (
                                        <Badge key={i} className="bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs uppercase px-4 py-1.5 rounded-lg shadow-sm">
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm font-bold text-slate-400 uppercase italic px-1">No custom variations selected</p>
                        )}
                        
                        <Separator className="bg-slate-50" />
                        
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-300 uppercase">Prep Instructions</p>
                            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                                <p className="text-base font-bold italic text-slate-600 leading-relaxed">
                                    {selectedItemForDetail?.specialInstructions ? `"${selectedItemForDetail.specialInstructions}"` : 'Standard house preparation requested.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-8 bg-slate-50" />
          </SheetContent>
        </Sheet>

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
              setTipDetails({ isOpen: true, amount: amount });
            }}
            baseReturnUrl={`${pathname}?table=${tableNumber}`}
        />
      </div>
    </>
  );
}

export default function OrderStatusPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="h-12 w-12 bg-primary/5 rounded-full animate-pulse mb-4 border border-primary/10" />
                <p className="text-xs font-bold text-slate-400 uppercase">Loading Audit Terminal...</p>
            </div>
        }>
            <OrderStatusContent />
        </Suspense>
    )
}
