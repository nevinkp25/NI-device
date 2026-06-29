
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, HandCoins, Home, Plus, Receipt, User, Clock, ChevronRight, Info, MoreHorizontal } from 'lucide-react';
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
    { id: 2, label: "ORDER STATUS" },
  ];

  useEffect(() => {
    if (tableNumber) {
      setOrder(sampleOrder);
      loadCart(sampleOrder.items);
    }
  }, [tableNumber, loadCart]);

  useEffect(() => {
    if(searchParams.has('paidGuest')){
      setIsSplitSheetOpen(true);
    }
  }, [searchParams]);

  if (!tableNumber) {
    return (
       <div className="flex flex-col h-screen bg-slate-50 text-foreground">
         <header className="flex items-center p-4 border-b bg-white">
          <Link href="/order-by-table" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </Link>
          <h1 className="text-sm font-black mx-auto uppercase tracking-widest text-slate-900">Table Settlement</h1>
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
          <h1 className="text-sm font-black mx-auto uppercase tracking-widest text-slate-900">Syncing...</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-12 w-12 bg-slate-100 rounded-full animate-pulse" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Retrieving Table {tableNumber} Account...</p>
        </div>
      </div>
    )
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vatAmount = subtotal * 0.05;
  const total = subtotal + vatAmount;

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
      <div className="flex flex-col min-h-screen bg-slate-50/50">
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="flex items-center p-4 h-16">
            <Link href="/order-by-table?mode=settlement" passHref>
              <Button variant="ghost" size="icon" className="text-slate-900 h-10 w-10">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex flex-col items-center mx-auto">
                <h1 className="text-sm font-black text-slate-400 tracking-[0.2em] uppercase leading-none mb-1">Settlement</h1>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Table {tableNumber}</h2>
            </div>
            <Link href="/navigation" passHref>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100 text-slate-900 border-2 border-primary/20 hover:bg-slate-200">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <OrderStepper currentStep={2} steps={settlementSteps} />
        </header>

        <main className="p-4 flex-grow pb-56 space-y-6">
          <div className="flex items-center justify-between px-1">
             <div className="space-y-1">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tab</h2>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">REF #{order.id}</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-[9px] font-black uppercase">Standard</Badge>
                </div>
             </div>
             <Link href={`/menu?table=${tableNumber}`} passHref>
                <Button className="h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 px-6">
                    <Plus className="h-4 w-4" />
                    Add Items
                </Button>
             </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <Card className="p-4 bg-white border-slate-200 shadow-sm rounded-2xl flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Server</p>
                    <p className="text-sm font-black text-slate-900 uppercase">David R.</p>
                </div>
             </Card>
             <Card className="p-4 bg-white border-slate-200 shadow-sm rounded-2xl flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Open</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{format(new Date(order.date), "hh:mm a")}</p>
                </div>
             </Card>
          </div>

          <Card className="rounded-[2.5rem] border-slate-200 shadow-md overflow-hidden bg-white">
            <div className="p-5 border-b bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Statement</h3>
                </div>
                <Badge className="bg-slate-200 text-slate-600 hover:bg-slate-200 border-none font-bold text-[9px]">{order.items.length} Items</Badge>
            </div>
            <div className="divide-y divide-slate-100">
                {order.items.map(item => (
                    <div 
                      key={item.cartItemId} 
                      className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-[11px] font-black text-slate-600">{item.quantity}x</span>
                            <div className="space-y-0.5">
                                <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${item.price.toFixed(2)} unit</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-slate-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30"
                                onClick={() => setSelectedItemForDetail(item)}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-50/80 space-y-3">
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span>VAT (5%)</span>
                    <span className="tabular-nums">${vatAmount.toFixed(2)}</span>
                </div>
                <Separator className="bg-slate-200/50" />
                <div className="flex justify-between items-end pt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Outstanding</span>
                    <span className="text-4xl font-black text-primary tracking-tighter tabular-nums">${total.toFixed(2)}</span>
                </div>
            </div>
          </Card>
        </main>

        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-5 bg-white border-t-2 border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-20 space-y-4">
          <Button 
            onClick={handleProceedToPayment} 
            className="w-full h-16 bg-[#0051B5] hover:bg-blue-700 text-white text-lg font-black rounded-2xl shadow-lg flex items-center justify-center gap-4 uppercase tracking-tight transition-all active:scale-[0.98]"
          >
              <span>PAY FULL AMOUNT</span>
              <div className="h-8 w-px bg-white/20" />
              <span className="bg-white/10 px-3 py-1 rounded-lg text-sm">${total.toFixed(2)}</span>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleSplitBill} 
                variant="outline" 
                className="h-12 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                  Split Bill
              </Button>
              <Button 
                onClick={handlePostPaid} 
                variant="outline" 
                className="h-12 border-2 border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <HandCoins className="h-4 w-4 text-slate-400" />
                Post-Paid
              </Button>
          </div>
        </footer>

        {/* Item Detail Sheet */}
        <Sheet open={!!selectedItemForDetail} onOpenChange={(open) => !open && setSelectedItemForDetail(null)}>
          <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton>
            <div className="mx-auto w-10 h-1 bg-slate-200 rounded-full mt-3 mb-1" />
            <SheetHeader className="p-6 flex-row items-center justify-between bg-white border-b rounded-t-[2rem] shadow-sm">
              <div className="flex items-center gap-3 text-left">
                 <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Info className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                    <SheetTitle className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{selectedItemForDetail?.name}</SheetTitle>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Ordered Item Audit</p>
                 </div>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100">
                  <ChevronRight className="h-5 w-5 rotate-90" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="p-8 space-y-8 pb-12">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</p>
                        <p className="text-3xl font-black text-slate-900">{selectedItemForDetail?.quantity}x</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</p>
                        <p className="text-3xl font-black text-slate-900 tabular-nums">${((selectedItemForDetail?.price || 0) * (selectedItemForDetail?.quantity || 1)).toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Kitchen Selections</h4>
                    <Card className="p-6 bg-white border-slate-200 rounded-[2rem] space-y-6 shadow-sm">
                        {selectedItemForDetail?.selectedVariations && Object.keys(selectedItemForDetail.selectedVariations).length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Variations</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(selectedItemForDetail.selectedVariations).map((v, i) => (
                                        <Badge key={i} className="bg-slate-100 text-slate-900 hover:bg-slate-100 border-none font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg">
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs font-bold text-slate-400 uppercase italic">No custom variations applied</p>
                        )}
                        
                        <Separator className="bg-slate-100" />
                        
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chef Instructions</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-sm font-medium italic text-slate-600">
                                    "{selectedItemForDetail?.specialInstructions || 'Standard preparation'}"
                                </p>
                            </div>
                        </div>
                    </Card>
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="h-12 w-12 bg-primary/20 rounded-full animate-pulse mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Order Dashboard...</p>
            </div>
        }>
            <OrderStatusContent />
        </Suspense>
    )
}
