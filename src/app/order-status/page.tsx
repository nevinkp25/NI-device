'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Home, Receipt, User, Clock, ChevronRight, Info, MoreHorizontal, Calendar } from 'lucide-react';
import Link from 'next/link';
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
          <h1 className="text-xs font-bold mx-auto uppercase tracking-widest text-slate-900">Table Settlement</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex items-center justify-center p-8 text-center">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Select a table from the dashboard to begin settlement.</p>
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
          <h1 className="text-xs font-bold mx-auto uppercase tracking-widest text-slate-900">Syncing...</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-12 w-12 bg-slate-100 rounded-full animate-pulse" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Retrieving Table {tableNumber} Account...</p>
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
                <h1 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase leading-none mb-1">Terminal Audit</h1>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">Table {tableNumber}</h2>
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
                    <span className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Order #{order.id}</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold uppercase py-0 px-2 h-5">Open</Badge>
                </div>
             </div>
             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest border-y border-slate-100 py-3">
                <span className="flex items-center gap-1.5"><User className="h-3 w-3 text-slate-300" /> David R.</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-slate-300" /> {format(new Date(order.date), "hh:mm a")}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-300" /> {format(new Date(order.date), "MMM d, yyyy")}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Receipt className="h-4 w-4 text-slate-400" />
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Itemized Statement</h3>
            </div>
            
            <div className="space-y-1">
                {order.items.map(item => (
                    <div 
                      key={item.cartItemId} 
                      className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer"
                      onClick={() => setSelectedItemForDetail(item)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-100">{item.quantity}</span>
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-slate-800 leading-tight uppercase tracking-tight">{item.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">${item.price.toFixed(2)} unit</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-slate-50/50 rounded-2xl p-6 space-y-3 border border-slate-100">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    <span>Service Charge (10%)</span>
                    <span className="tabular-nums font-bold text-slate-900">${extraCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    <span>VAT (5%)</span>
                    <span className="tabular-nums font-bold text-slate-900">${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    <span>Gratuity</span>
                    <span className="tabular-nums font-bold text-slate-900">${tips.toFixed(2)}</span>
                </div>
                <Separator className="bg-slate-200/50 my-2" />
                <div className="flex justify-between items-end pt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Total Balance</span>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-tight leading-none">Order ID: {order.id}</span>
                    </div>
                    <span className="text-3xl font-bold text-primary tracking-tighter tabular-nums">${total.toFixed(2)}</span>
                </div>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-5 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 space-y-3">
          <Button 
            onClick={handleProceedToPayment} 
            className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-lg flex items-center justify-center gap-4 uppercase tracking-tight transition-all active:scale-[0.98]"
          >
              <span>Pay Full Amount</span>
              <div className="h-6 w-px bg-white/20" />
              <span className="bg-white/10 px-3 py-1 rounded-lg text-sm font-mono">${total.toFixed(2)}</span>
          </Button>
          
          <Button 
            onClick={handleSplitBill} 
            variant="outline" 
            className="w-full h-14 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
              Split Bill Between Guests
          </Button>
        </footer>

        {/* Item Audit Detail Sheet */}
        <Sheet open={!!selectedItemForDetail} onOpenChange={(open) => !open && setSelectedItemForDetail(null)}>
          <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton>
            <div className="mx-auto w-10 h-1 bg-slate-200 rounded-full mt-3 mb-1" />
            <SheetHeader className="p-6 flex-row items-center justify-between bg-white border-b rounded-t-[2rem]">
              <div className="flex items-center gap-4 text-left">
                 <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                    <Info className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                    <SheetTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{selectedItemForDetail?.name}</SheetTitle>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Kitchen Service Log</p>
                 </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200">
                  <X className="h-5 w-5 text-slate-500" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="p-6 space-y-8 pb-12">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qty Ordered</p>
                        <p className="text-2xl font-bold text-slate-900">{selectedItemForDetail?.quantity}x</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Line Total</p>
                        <p className="text-2xl font-bold text-slate-900 tabular-nums">${((selectedItemForDetail?.price || 0) * (selectedItemForDetail?.quantity || 1)).toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Kitchen Preferences</h4>
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-5 shadow-sm">
                        {selectedItemForDetail?.selectedVariations && Object.keys(selectedItemForDetail.selectedVariations).length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Variations</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(selectedItemForDetail.selectedVariations).map((v, i) => (
                                        <Badge key={i} className="bg-slate-50 text-slate-600 border border-slate-200 font-bold text-[9px] uppercase px-2.5 py-1 rounded-md">
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs font-semibold text-slate-400 uppercase italic px-1">No custom variations selected</p>
                        )}
                        
                        <Separator className="bg-slate-50" />
                        
                        <div className="space-y-2">
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Prep Instructions</p>
                            <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                                <p className="text-sm font-medium italic text-slate-600 leading-relaxed">
                                    {selectedItemForDetail?.specialInstructions ? `"${selectedItemForDetail.specialInstructions}"` : 'Standard house preparation requested.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-6 bg-slate-50" />
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
                <div className="h-10 w-10 bg-primary/5 rounded-full animate-pulse mb-3 border border-primary/10" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loading Audit Terminal...</p>
            </div>
        }>
            <OrderStatusContent />
        </Suspense>
    )
}
