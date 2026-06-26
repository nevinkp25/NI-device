
"use client";

import { useState, useMemo } from 'react';
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
  Hash,
  Search,
  X
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
import { Input } from '@/components/ui/input';
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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return detailedTransactions.filter(tx => {
      const matchesSearch = 
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.table.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchQuery]);

  const orderCount = filteredTransactions.length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-[#0051B5] text-white shadow-md">
        <div className="flex items-center justify-between p-4 h-16">
          <div className="flex items-center gap-3">
            <Link href="/navigation" passHref>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                Audit History
              </h1>
              <p className="text-[10px] font-medium text-white/60 leading-none">
                Terminal Log
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className={cn(
              "text-white rounded-full h-10 w-10 transition-all",
              isSearchVisible ? "bg-white/20" : "hover:bg-white/10"
            )}
          >
            {isSearchVisible ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>

        {isSearchVisible && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Input 
                autoFocus
                placeholder="Search Order # or Table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus-visible:ring-white/30 text-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            </div>
          </div>
        )}

        <div className="px-4 pb-4 flex items-center justify-between gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white px-4 gap-2 flex-grow justify-start"
              >
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-semibold">
                  {date ? (date.toDateString() === new Date().toDateString() ? 'Today' : format(date, "MMM d, yyyy")) : 'Select Date'}
                </span>
                <ChevronDown className="h-3 w-3 ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-2xl border-none"
              />
            </PopoverContent>
          </Popover>

          <div className="bg-white/10 border border-white/20 rounded-xl px-4 h-10 flex items-center gap-2 shrink-0">
             <Hash className="h-3 w-3 text-white/50" />
             <span className="text-xs font-bold">{orderCount} {orderCount === 1 ? 'Order' : 'Orders'}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-3 pb-20 animate-in fade-in duration-500">
        {filteredTransactions.map((tx) => (
          <Card key={tx.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white hover:border-primary/30 transition-all border">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Order Ref</p>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">#{tx.id}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Table</p>
                  <div className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <span className="text-sm font-bold text-slate-800">{tx.table}</span>
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 leading-none mb-1">Waiter</p>
                    <p className="text-xs font-bold text-slate-700">{tx.waiter}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-slate-400 leading-none mb-1">Time</p>
                    <p className="text-xs font-bold text-slate-700">{tx.time}</p>
                  </div>
                  <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100/50">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                     <Badge className={cn(
                        "shadow-none border text-[9px] font-bold px-2 py-0.5",
                        tx.status === 'Paid' ? "bg-green-100 text-green-700 border-green-200" : 
                        tx.status === 'Pending' ? "bg-amber-100 text-amber-700 border-amber-200" :
                        "bg-blue-100 text-blue-700 border-blue-200"
                     )}>
                        {tx.status}
                     </Badge>
                     {tx.method !== 'None' && (
                       <Badge variant="outline" className="border-slate-200 text-slate-500 flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5">
                          {tx.method === 'Card' ? <CreditCard className="h-2.5 w-2.5" /> : <Landmark className="h-2.5 w-2.5" />}
                          {tx.method}
                       </Badge>
                     )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#0051B5] tabular-nums tracking-tight">
                      ${tx.finalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 my-1" />

                <div className="flex justify-between text-[10px] font-bold">
                   <div className="flex gap-4">
                     <div>
                       <span className="text-slate-400 mr-1">Init:</span>
                       <span className="text-slate-600">${tx.initiatedAmount.toFixed(2)}</span>
                     </div>
                     <div>
                       <span className="text-slate-400 mr-1">Pend:</span>
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

        {filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="bg-white p-8 rounded-full shadow-sm">
                <History className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No transactions found</p>
          </div>
        )}
      </main>
    </div>
  );
}
