
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  History, 
  Calendar as CalendarIcon, 
  User, 
  Clock, 
  CreditCard, 
  Landmark, 
  ChevronDown,
  Hash
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface TransactionRecord {
  id: string;
  table: string;
  waiter: string;
  time: string;
  status: 'Paid' | 'Pending' | 'Initiated';
  method: 'Card' | 'Cash' | 'None';
  initiatedAmount: number;
  pendingAmount: number;
  finalAmount: number;
  date: Date;
}

const detailedTransactions: TransactionRecord[] = [
  {
    id: '2536',
    table: 'T-102',
    waiter: 'David R.',
    time: '11:45 AM',
    status: 'Paid',
    method: 'Card',
    initiatedAmount: 45.50,
    pendingAmount: 0.00,
    finalAmount: 45.50,
    date: new Date(),
  },
  {
    id: '2540',
    table: 'T-204',
    waiter: 'Sarah M.',
    time: '12:15 PM',
    status: 'Pending',
    method: 'None',
    initiatedAmount: 112.00,
    pendingAmount: 112.00,
    finalAmount: 112.00,
    date: new Date(),
  },
  {
    id: '2531',
    table: 'T-109',
    waiter: 'David R.',
    time: '10:30 AM',
    status: 'Paid',
    method: 'Cash',
    initiatedAmount: 24.00,
    pendingAmount: 0.00,
    finalAmount: 24.00,
    date: new Date(),
  }
];

export default function TransactionHistoryPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const orderCount = detailedTransactions.length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Professional Terminal Header */}
      <header className="sticky top-0 z-50 bg-[#0051B5] text-white shadow-lg">
        <div className="flex items-center p-4">
          <Link href="/navigation" passHref>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex flex-col ml-2">
            <h1 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              <History className="h-5 w-5" />
              History
            </h1>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none mt-1">
              Terminal Audit Log
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="px-4 pb-5 flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-12 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl text-white px-5 gap-3"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="font-bold text-sm">
                  {date ? (date.toDateString() === new Date().toDateString() ? 'Today' : format(date, "MMM d, yyyy")) : 'Select Date'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-[2rem] border-none shadow-2xl" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-[2rem] border-none"
              />
            </PopoverContent>
          </Popover>

          <div className="bg-white/10 border-2 border-white/20 rounded-2xl px-5 h-12 flex items-center gap-2">
             <Hash className="h-4 w-4 text-white/40" />
             <span className="text-sm font-black tracking-tight">{orderCount} {orderCount === 1 ? 'ORDER' : 'ORDERS'}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {detailedTransactions.map((tx) => (
          <Card key={tx.id} className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden bg-white hover:border-primary/20 transition-all group">
            <div className="p-5 flex flex-col gap-4">
              {/* Header: Order & Table */}
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</p>
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter">#{tx.id}</h3>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Table</p>
                  <div className="bg-slate-100 px-3 py-1 rounded-lg">
                    <span className="text-sm font-black text-slate-900">{tx.table}</span>
                  </div>
                </div>
              </div>

              <Separator className="opacity-60" />

              {/* Staff & Timing Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Waiter</p>
                    <p className="text-sm font-bold text-slate-700">{tx.waiter}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Time</p>
                    <p className="text-sm font-bold text-slate-700">{tx.time}</p>
                  </div>
                  <div className="h-9 w-9 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Payment Summary Box */}
              <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                    <div className="mt-1 flex gap-2">
                       <Badge className={cn(
                          "shadow-none border uppercase text-[9px] font-black tracking-widest px-2 py-0.5",
                          tx.status === 'Paid' ? "bg-green-100 text-green-700 border-green-200" : 
                          tx.status === 'Pending' ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-blue-100 text-blue-700 border-blue-200"
                       )}>
                        {tx.status}
                       </Badge>
                       {tx.method !== 'None' && (
                         <Badge variant="outline" className="border-slate-300 text-slate-500 flex items-center gap-1.5 uppercase text-[9px] font-black tracking-widest px-2 py-0.5">
                            {tx.method === 'Card' ? <CreditCard className="h-2.5 w-2.5" /> : <Landmark className="h-2.5 w-2.5" />}
                            {tx.method}
                         </Badge>
                       )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                    <p className="text-2xl font-black text-[#0051B5] tracking-tighter tabular-nums">
                      ${tx.finalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Separator className="opacity-30" />

                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                   <div className="flex gap-4">
                     <div>
                       <span className="text-slate-400 mr-1.5">INITIATED:</span>
                       <span className="text-slate-600">${tx.initiatedAmount.toFixed(2)}</span>
                     </div>
                     <div>
                       <span className="text-slate-400 mr-1.5">PENDING:</span>
                       <span className={cn(tx.pendingAmount > 0 ? "text-red-500" : "text-green-600")}>
                        ${tx.pendingAmount.toFixed(2)}
                       </span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {detailedTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="bg-white p-10 rounded-full shadow-sm">
                <History className="h-16 w-16 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No transactions found for this date</p>
          </div>
        )}
      </main>
    </div>
  );
}
