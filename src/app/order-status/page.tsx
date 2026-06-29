'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Home, 
  Receipt, 
  User, 
  Clock, 
  ChevronRight, 
  Calendar, 
  X,
  CreditCard,
  History,
  FileText,
  MoreVertical,
  RefreshCw,
  Trash2
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
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function OrderStatusContent() {
  const router = useRouter();
  const { toast } = useToast();
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

  const handleSyncOrder = () => {
    toast({
      title: "Syncing Table Account",
      description: "Fetching latest transaction data from kitchen...",
    });
  };

  const handleClearSplits = () => {
    toast({
      title: "Splits Reset",
      description: "Table account has been reset to single-payer mode.",
    });
  };

  if (!tableNumber) {
    return (
       <div className="flex flex-col h-screen bg-slate-50">
         <header className="flex items-center p-4 border-b bg-white">
          <Link href="/order-by-table?mode=settlement">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold mx-auto uppercase text-slate-900">Check Settlement</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                <History className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold uppercase text-xs">Select a table to access guest check</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <header className="flex items-center p-4 border-b bg-white">
          <Link href="/order-by-table?mode=settlement">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </Link>
          <h1 className="text-sm font-bold mx-auto uppercase text-slate-900">Synchronizing</h1>
          <div className="w-10"></div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-12">
            <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const extraCharges = subtotal * 0.10;
  const vatAmount = (subtotal + extraCharges) * 0.05;
  const total = subtotal + extraCharges + vatAmount;

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
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white border-b px-4 h-16 flex items-center justify-between shadow-sm">
        <Link href="/order-by-table?mode=settlement">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold uppercase text-slate-900">Table {tableNumber} Account</h1>
          <p className="text-xs font-bold text-slate-400 uppercase leading-none mt-0.5">Terminal Dashboard</p>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/navigation">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-slate-100 bg-slate-50">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-slate-100 bg-slate-50">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
              <DropdownMenuLabel className="text-xs font-bold uppercase text-slate-400 p-2">Check Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl h-12 gap-3 cursor-pointer" onClick={handleSyncOrder}>
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-sm">Refresh Check</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl h-12 gap-3 cursor-pointer" onClick={handleClearSplits}>
                <Trash2 className="h-4 w-4 text-red-600" />
                <span className="font-bold text-sm">Reset Splits</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow p-4 animate-in fade-in duration-500 max-w-[420px] mx-auto w-full space-y-4 pb-44">
        <Card className="p-4 border-slate-200 shadow-sm rounded-2xl bg-white space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 uppercase">Check #{order.id}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold uppercase text-xs py-0 px-2 rounded-md">Unpaid Check</Badge>
                <span className="text-xs font-bold text-slate-400 uppercase leading-none">Review Totals</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 py-3 border-t border-slate-50 text-slate-500 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <User className="h-4 w-4 text-primary/40" />
              <span className="text-sm font-bold uppercase">Server: David R.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Clock className="h-4 w-4 text-primary/40" />
              <span className="text-sm font-bold uppercase">{format(new Date(order.date), "hh:mm a")}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="h-4 w-4 text-primary/40" />
              <span className="text-sm font-bold uppercase">{format(new Date(order.date), "MMM d")}</span>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b flex items-center gap-2">
            <Receipt className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase">Itemized Statement</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {order.items.map(item => (
              <div 
                key={item.cartItemId} 
                className="group flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => setSelectedItemForDetail(item)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                    {item.quantity}x
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 uppercase leading-none">{item.name}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase mt-1">${item.price.toFixed(2)} unit</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-slate-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden p-5 space-y-4">
          <div className="flex items-center gap-2 px-1 pb-1">
             <FileText className="h-4 w-4 text-slate-400" />
             <h3 className="text-xs font-bold text-slate-400 uppercase">Check Totals</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
              <span className="text-sm font-bold text-primary uppercase">Subtotal</span>
              <span className="text-base font-bold text-primary tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="px-3 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase">Service (10%)</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">${extraCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase">VAT (5%)</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">${vatAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Separator className="bg-slate-100" />
          
          <div className="flex justify-between items-end py-2 px-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Total Balance Due</span>
              <span className="text-sm font-bold text-primary uppercase leading-none">Order # {order.id}</span>
            </div>
            <span className="text-4xl font-bold text-primary tabular-nums tracking-normal">${total.toFixed(2)}</span>
          </div>
        </Card>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-5 bg-white/95 backdrop-blur-md border-t border-slate-100 z-50 flex flex-col gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <Button 
          onClick={handleProceedToPayment} 
          className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-xl flex items-center justify-center gap-6 uppercase transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Process Payment</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <span className="bg-white/10 px-3 py-1.5 rounded-xl text-base font-bold tabular-nums">${total.toFixed(2)}</span>
        </Button>
        
        <Button 
          onClick={handleSplitBill} 
          variant="outline" 
          className="w-full h-14 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 uppercase hover:bg-slate-50 transition-all active:scale-[0.98] bg-white"
        >
          Split Check Between Guests
        </Button>
      </footer>

      <Sheet open={!!selectedItemForDetail} onOpenChange={(open) => !open && setSelectedItemForDetail(null)}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-0 bg-white z-[100]" hideCloseButton>
          <div className="mx-auto w-12 h-1.5 bg-slate-100 rounded-full mt-4 mb-2" />
          <SheetHeader className="p-6 flex-row items-center justify-between border-b bg-white">
            <div className="flex items-center gap-4 text-left">
               <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <span className="text-sm font-bold">{selectedItemForDetail?.quantity}x</span>
               </div>
               <div className="space-y-0.5">
                  <SheetTitle className="text-lg font-bold text-slate-900 uppercase leading-none">{selectedItemForDetail?.name}</SheetTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase leading-none">Kitchen Service Audit</p>
               </div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50">
                <X className="h-5 w-5 text-slate-500" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="p-6 space-y-8 pb-12">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-slate-50 p-5 rounded-2xl space-y-1 border-none shadow-none">
                <p className="text-xs font-bold text-slate-400 uppercase">Quantity</p>
                <p className="text-2xl font-bold text-slate-900">{selectedItemForDetail?.quantity}x</p>
              </Card>
              <Card className="bg-slate-50 p-5 rounded-2xl space-y-1 text-right border-none shadow-none">
                <p className="text-xs font-bold text-slate-400 uppercase">Unit Price</p>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">${selectedItemForDetail?.price.toFixed(2)}</p>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase px-1">Order Customizations</h4>
              <div className="space-y-6">
                {selectedItemForDetail?.selectedVariations && Object.keys(selectedItemForDetail.selectedVariations).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.values(selectedItemForDetail.selectedVariations).map((v, i) => (
                      <Badge key={i} className="bg-white text-slate-700 border border-slate-200 font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow-sm">
                        {v}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-slate-300 uppercase italic px-1">Standard Preparation</p>
                )}
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-300 uppercase px-1">Prep Instructions</p>
                  <div className="text-sm font-bold italic text-slate-600 bg-slate-50 p-4 rounded-xl">
                    {selectedItemForDetail?.specialInstructions ? `"${selectedItemForDetail.specialInstructions}"` : 'No specific requests.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-6" />
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="h-8 w-8 border-4 border-slate-100 border-t-slate-400 rounded-full animate-spin" />
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  );
}