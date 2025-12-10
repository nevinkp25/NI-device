
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, RefreshCw, CreditCard, Landmark } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const sampleTransactions = [
  {
    id: 'TXN-2025-572560',
    date: new Date('2025-12-09T11:23:20Z'),
    amount: 12.07,
    table: '3',
    method: 'Card',
    cardLast4: '4242'
  },
  {
    id: 'TXN-2025-313699',
    date: new Date('2025-12-09T11:25:49Z'),
    amount: 11.19,
    table: '3',
    method: 'Card',
    cardLast4: '4242'
  },
    {
    id: 'TXN-2025-543035',
    date: new Date('2025-12-09T11:28:35Z'),
    amount: 11.19,
    table: '3',
    method: 'Cash',
    cardLast4: null
  },
    {
    id: 'TXN-2025-987654',
    date: new Date('2025-12-09T10:15:00Z'),
    amount: 45.50,
    table: '5',
    method: 'Card',
    cardLast4: '1234'
  },
   {
    id: 'TXN-2025-123456',
    date: new Date('2025-12-09T09:30:10Z'),
    amount: 25.00,
    table: '2',
    method: 'Cash',
    cardLast4: null
  },
];


export default function TransactionHistoryPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
        title: "Refreshing History",
        description: "Fetching the latest transactions..."
    });
    setTimeout(() => {
        setIsRefreshing(false);
        toast({
            title: "History Updated",
            description: "Transaction list is up to date."
        });
    }, 1500);
  };
  
  const DetailRow = ({ label, value, icon }: { label: string, value: string | number, icon?: React.ReactNode }) => (
    <div className="flex justify-between items-center py-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
            {icon}
            <p className="font-semibold text-right">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <header className="flex items-center p-4 border-b bg-background">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto flex items-center gap-2">
            <History className="h-5 w-5 text-primary"/>
            Transaction History
        </h1>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </header>

      <main className="flex-grow p-4 space-y-4">
        {sampleTransactions.map((tx) => (
            <Card key={tx.id} className="text-left shadow-sm">
                <CardContent className="p-4">
                    <DetailRow label="Transaction ID" value={tx.id} />
                    <Separator />
                    <DetailRow label="Date & Time" value={format(tx.date, "M/d/yyyy, h:mm a")} />
                    <Separator />
                    <DetailRow label="Amount Paid" value={`$${tx.amount.toFixed(2)}`} />
                     <Separator />
                    <DetailRow 
                        label="Payment Method" 
                        value={tx.method}
                        icon={tx.method === 'Card' ? <CreditCard className="h-4 w-4 text-muted-foreground"/> : <Landmark className="h-4 w-4 text-muted-foreground"/>}
                    />
                     <Separator />
                    <DetailRow label="Table Number" value={tx.table} />
                </CardContent>
            </Card>
        ))}
      </main>
    </div>
  );
}
