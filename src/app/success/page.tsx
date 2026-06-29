
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Printer, Receipt, Loader2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function SuccessContent() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [transactionDetails, setTransactionDetails] = useState<{
    id: string;
    date: Date | null;
    amount: number;
    table: string;
    method: string;
  }>({
    id: '',
    date: new Date(),
    amount: 0,
    table: '',
    method: 'Card',
  });

  const returnUrl = searchParams.get('returnUrl') || '/';
  const amountPaid = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');
  const tableNumber = searchParams.get('table');
  const methodParam = searchParams.get('method');
  
  // Detect if this is a partial split payment loop
  const isSplitPayment = returnUrl.includes('paidGuests');

  useEffect(() => {
    const methodDisplay = methodParam?.toLowerCase() === 'cash' ? 'Cash' : 'Card';
    
    setTransactionDetails({
      id: transactionId || `TXN-${Date.now()}`.slice(-10),
      date: new Date(),
      amount: parseFloat(amountPaid || '0'),
      table: tableNumber || 'N/A',
      method: methodDisplay,
    });
    
    if (isSplitPayment) {
        // Interstitial redirect for partial payments
        const timer = setTimeout(() => {
            router.push(returnUrl);
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [amountPaid, transactionId, tableNumber, isSplitPayment, returnUrl, router, clearCart, methodParam]);

  if (isSplitPayment) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen bg-slate-50 p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-[340px] p-8 bg-white rounded-[2.5rem] shadow-2xl space-y-6 border-2 border-[#0069B1]/10">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-700">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payment Authorized</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Transaction confirmed.<br/>Syncing terminal for next guest...
                    </p>
                </div>
                <div className="flex justify-center pt-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0069B1]/40" />
                </div>
            </div>
        </div>
    )
  }
  
  const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between items-center py-2">
        <p className="text-[9px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-xs font-black text-slate-900 text-right uppercase">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50 p-4">
      <div className="w-full max-w-sm text-center space-y-4 animate-in fade-in duration-700">
        <div className="flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-md animate-in zoom-in-50 duration-500 border border-slate-50">
                <CheckCircle2 className="h-14 w-14 text-green-500 stroke-[1.5]" />
            </div>
        </div>
        
        <div className="space-y-0.5">
            <h1 className="text-3xl font-black text-slate-900 uppercase leading-none tracking-tight">Settled!</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Terminal Audit Closed</p>
        </div>

        <Card className="text-left border-slate-200 shadow-xl rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <Receipt className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] font-black text-primary uppercase">Transaction Details</h3>
            </div>
            
            <div className="space-y-0.5">
                <DetailRow label="Transaction ID" value={`#${transactionDetails.id}`} />
                <Separator className="bg-slate-50" />
                <DetailRow label="Closing Time" value={transactionDetails.date ? format(transactionDetails.date, "hh:mm a") : '...'} />
                <Separator className="bg-slate-50" />
                <DetailRow label="Total Paid" value={`$${transactionDetails.amount.toFixed(2)}`} />
                 <Separator className="bg-slate-50" />
                <DetailRow label="Payment Method" value={transactionDetails.method} />
                 <Separator className="bg-slate-50" />
                <DetailRow label="Table Number" value={`${transactionDetails.table}`} />
            </div>

            <div className="pt-2">
                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 shadow-inner">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 leading-none">Approved by Network POS</p>
                    <p className="text-[8px] font-medium text-slate-300 uppercase leading-none">Terminal: BRANCH-01-SECURE</p>
                </div>
            </div>
        </Card>
        
        <div className="space-y-3 w-full max-w-[320px] mx-auto">
            <Button variant="outline" className="w-full h-14 border-2 border-slate-100 rounded-2xl font-bold uppercase text-xs flex items-center justify-center gap-3 bg-white hover:bg-slate-50 transition-all active:scale-95 text-slate-600">
                <Printer className="h-5 w-5" />
                Print Receipt
            </Button>
            
            <Link href="/navigation" passHref className="block w-full">
                <Button className="w-full h-16 text-lg font-black bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase">
                    <Home className="h-5 w-5"/>
                    <span>Done</span>
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
