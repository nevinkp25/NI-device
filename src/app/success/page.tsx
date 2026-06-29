
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Mail, Home, Printer, Share2, Receipt, Loader2 } from 'lucide-react';
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
  }>({
    id: '',
    date: new Date(),
    amount: 0,
    table: '',
  });

  const returnUrl = searchParams.get('returnUrl') || '/';
  const amountPaid = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');
  const tableNumber = searchParams.get('table');
  const isSplitPayment = returnUrl.includes('paidGuest');


  useEffect(() => {
    setTransactionDetails({
      id: transactionId || `TXN-${Date.now()}`.slice(-10),
      date: new Date(),
      amount: parseFloat(amountPaid || '0'),
      table: tableNumber || 'N/A',
    });
    
    if (isSplitPayment) {
        const timer = setTimeout(() => {
            router.push(returnUrl);
        }, 2000);
        return () => clearTimeout(timer);
    } else {
        if (!returnUrl.includes('post-paid')) {
          clearCart();
        }
    }

  }, [amountPaid, transactionId, tableNumber, isSplitPayment, returnUrl, router, clearCart]);

  if (isSplitPayment) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen bg-slate-50 p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-sm p-8 bg-white rounded-[2.5rem] shadow-xl space-y-6">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Partial Paid</h1>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                        Returning to the bill...
                    </p>
                </div>
            </div>
        </div>
    )
  }
  
  const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between items-center py-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-slate-900 text-right uppercase">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50 p-6">
      <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in duration-700">
        <div className="flex justify-center">
            <div className="bg-white p-6 rounded-full shadow-lg animate-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-20 w-20 text-green-500 stroke-[1.5]" />
            </div>
        </div>
        
        <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Settled!</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Table Account Closed</p>
        </div>

        <Card className="text-left border-slate-200 shadow-xl rounded-[2.5rem] bg-white overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-50">
                <Receipt className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Transaction Voucher</h3>
            </div>
            
            <div className="space-y-1">
                <DetailRow label="Order Reference" value={`#${transactionDetails.id}`} />
                <Separator className="bg-slate-50" />
                <DetailRow label="Date & Time" value={transactionDetails.date ? format(transactionDetails.date, "MMM d, hh:mm a") : '...'} />
                <Separator className="bg-slate-50" />
                <DetailRow label="Account Total" value={`$${transactionDetails.amount.toFixed(2)}`} />
                 <Separator className="bg-slate-50" />
                <DetailRow label="Method" value="EMV Card Auth" />
                 <Separator className="bg-slate-50" />
                <DetailRow label="Table" value={`Floor ${transactionDetails.table}`} />
            </div>

            <div className="pt-2">
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Approved by Network POS</p>
                    <p className="text-[8px] font-medium text-slate-300 uppercase tracking-tighter">Auth: 00921-X12 | Terminal: BRANCH-01</p>
                </div>
            </div>
        </Card>
        
        <div className="pt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-14 border-2 border-slate-200 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 bg-white">
                    <Printer className="h-4 w-4" />
                    Print
                </Button>
                <Button variant="outline" className="h-14 border-2 border-slate-200 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 bg-white">
                    <Mail className="h-4 w-4" />
                    Email
                </Button>
            </div>
            
            <Link href="/navigation" passHref>
                <Button className="w-full h-16 text-lg font-black bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-tight">
                    <Home className="h-5 w-5"/>
                    <span>Terminal Home</span>
                </Button>
            </Link>
            
            <Button variant="ghost" className="w-full h-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] hover:bg-transparent">
                <Share2 className="h-3 w-3 mr-2" />
                Send Digital Voucher
            </Button>
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
