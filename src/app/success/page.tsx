
"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Mail, Home } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
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
    date: null,
    amount: 0,
    table: '',
  });

  const returnUrl = searchParams.get('returnUrl') || '/';
  const amountPaid = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');
  const tableNumber = searchParams.get('table');
  const isSplitPayment = returnUrl.includes('checkout');


  useEffect(() => {
    // In a real app, you might fetch final details or just use what's passed
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
    }

    // Clear the cart for full payments
    if (!isSplitPayment) {
      clearCart();
    }

  }, [amountPaid, transactionId, tableNumber, isSplitPayment, returnUrl, router, clearCart]);

  if (isSplitPayment) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen bg-background p-4">
            <div className="relative w-full max-w-sm p-6">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-headline font-bold mt-2 mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4">
                    Returning to checkout for the next payment...
                </p>
            </div>
        </div>
    )
  }
  
  const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between items-center py-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-right">{value}</p>
    </div>
  );


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
            <div className="animate-in fade-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
        </div>
        
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
            Your order has been placed
        </p>

        <Card className="text-left shadow-sm">
            <CardContent className="p-4">
                <DetailRow label="Transaction ID" value={transactionDetails.id} />
                <Separator />
                <DetailRow label="Date & Time" value={transactionDetails.date ? format(transactionDetails.date, "M/d/yyyy, h:mm:ss a") : '...'} />
                <Separator />
                <DetailRow label="Amount Paid" value={`$${transactionDetails.amount.toFixed(2)}`} />
                 <Separator />
                <DetailRow label="Payment Method" value="Credit Card ending in 4242" />
                 <Separator />
                <DetailRow label="Table Number" value={transactionDetails.table} />
            </CardContent>
        </Card>
        
        <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full h-12 justify-between px-4">
                <span>Print Merchant Receipt</span>
                <Download />
            </Button>
            <Button variant="outline" className="w-full h-12 justify-between px-4">
                <span>Print Customer Receipt</span>
                <Mail />
            </Button>
            <Link href="/navigation" passHref>
            <Button className="w-full h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                <Home className="mr-2"/>
                Back to Home
            </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Processing...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
