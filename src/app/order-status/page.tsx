'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Home, 
  Receipt, 
  User, 
  Clock, 
  ChevronRight, 
  Info, 
  Calendar, 
  X,
  CreditCard,
  History
} from 'lucide-react';
import { sampleOrder, type Order, type CartItem } from '@/lib/data';
import { useCart } from '@/context/cart-context';
import { format } from 'date-fns';
import { TipSheet } from '@/components/tip-sheet';
import { SplitBillSheet } from '@/components/split-bill-sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from '@/components/ui/sheet';
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

  useEffect(() => {
    if (tableNumber) {
      setOrder(sampleOrder);
      loadCart(sampleOrder.items);
    }
  }, [tableNumber, loadCart]);

  if (!tableNumber) {
    return (
       <div className="flex flex-col h-screen bg-slate-50">
         <header className="flex items-center p-4 border-b bg-white">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold mx-auto uppercase text-slate-900">Account Settlement</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                <History className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold uppercase text-xs">Select a table from the dashboard to begin settlement.</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
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
            <div className="h-12 w-12 bg-primary/5 rounded-full animate-pulse border border-primary/10" />
            <p className="text-slate-500 font-bold uppercase text-xs">Retrieving Table {tableNumber} Account...</p>
        </div>
      </div>
    );
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Refined and Minimal */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 h-16 flex items-center justify-between">
        <Link href="/order-by-table?mode=settlement" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-600 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-black text-slate-400 uppercase leading-none">Settlement</span>
          <h1 className="text-lg font-black text-slate-900 uppercase leading-none mt-1">Table {tableNumber}</h1>
        </div>
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      <main className="flex-grow p-4 pb-48 animate-in fade-in duration-500 max-w-[420px] mx-auto w-full space-y-6">
        {/* Order Identifier & Audit Metadata Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Order #{order.id}</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold uppercase text-[10px] py-0.5 px-3">Open</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 py-3 border-y border-slate-100">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <User className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase">Waiter</span>
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase">David R.</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase">Time</span>
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase">{format(new Date(order.date), "hh:mm a")}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-right items-end">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase">Date</span>
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase">{format(new Date(order.date), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Itemized Order List - Priority View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-slate-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase">Account Statement</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{order.items.length} items</span>
          </div>
          
          <div className="space-y-1.5">
            {order.items.map(item => (
              <div 
                key={item.cartItemId} 
                className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                onClick={() => setSelectedItemForDetail(item)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-xs font-black text-white">
                    {item.quantity}x
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 uppercase leading-none">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">${item.price.toFixed(2)} unit</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown - Compact Receipt Style */}
        <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Subtotal</span>
            <span className="text-sm font-black text-slate-900 tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Service Charge (10%)</span>
            <span className="text-sm font-black text-slate-900 tabular-nums">${extraCharges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">VAT (5%)</span>
            <span className="text-sm font-black text-slate-900 tabular-nums">${vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Gratuity</span>
            <span className="text-sm font-black text-slate-900 tabular-nums">${tips.toFixed(2)}</span>
          </div>
          
          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total Balance Due</span>
                <span className="text-xs font-black text-primary uppercase leading-none">Order # {order.id}</span>
              </div>
              <span className="text-4xl font-black text-primary tracking-tight tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Pinned Action Footer */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-5 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 flex flex-col gap-3">
        <Button 
          onClick={handleProceedToPayment} 
          className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-black rounded-2xl shadow-lg flex items-center justify-center gap-6 uppercase transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Pay Full Amount</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <span className="bg-white/10 px-3 py-1.5 rounded-xl text-base font-black tabular-nums">${total.toFixed(2)}</span>
        </Button>
        
        <Button 
          onClick={handleSplitBill} 
          variant="outline" 
          className="w-full h-14 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-700 uppercase hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          Split Bill Between Guests
        </Button>
      </footer>

      {/* Item Audit Detail Sheet */}
      <Sheet open={!!selectedItemForDetail} onOpenChange={(open) => !open && setSelectedItemForDetail(null)}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton>
          <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-4 mb-2" />
          <SheetHeader className="p-6 flex-row items-center justify-between bg-white border-b rounded-t-[2rem] shadow-sm">
            <div className="flex items-center gap-4 text-left">
               <div className="h-10 w-10 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                  <Info className="h-5 w-5 text-primary" />
               </div>
               <div className="space-y-0.5">
                  <SheetTitle className="text-lg font-black text-slate-900 uppercase leading-none">{selectedItemForDetail?.name}</SheetTitle>
                  <p className="text-xs text-slate-400 font-bold uppercase leading-none">Kitchen Service Audit</p>
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
              <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-1 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity</p>
                <p className="text-2xl font-black text-slate-900">{selectedItemForDetail?.quantity}x</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-1 shadow-sm text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</p>
                <p className="text-2xl font-black text-slate-900 tabular-nums">${selectedItemForDetail?.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase px-1">Order Customizations</h4>
              <div className="p-6 bg-white border border-slate-100 rounded-[1.5rem] space-y-6 shadow-sm">
                {selectedItemForDetail?.selectedVariations && Object.keys(selectedItemForDetail.selectedVariations).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.values(selectedItemForDetail.selectedVariations).map((v, i) => (
                      <Badge key={i} className="bg-slate-50 text-slate-700 border border-slate-200 font-bold text-[10px] uppercase px-3 py-1 rounded-lg">
                        {v}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-400 uppercase italic">No variations selected</p>
                )}
                
                <Separator className="bg-slate-50" />
                
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-300 uppercase">Prep Instructions</p>
                  <p className="text-sm font-bold italic text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    {selectedItemForDetail?.specialInstructions ? `"${selectedItemForDetail.specialInstructions}"` : 'Standard preparation requested.'}
                  </p>
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
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="h-12 w-12 bg-primary/5 rounded-full animate-pulse mb-4 border border-primary/10" />
        <p className="text-[10px] font-black text-slate-400 uppercase">Loading Account...</p>
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  );
}
