
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
  X,
  ArrowRight
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
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Audit Log</h1>
              <p className="text-xs font-medium text-white/60 leading-none">Terminal History</p>
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
          <div className="px-4 pb-3 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Input 
                autoFocus
                placeholder="Search Order or Table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus-visible:ring-white/30 text-sm"
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
                className="h-11 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white px-4 gap-2 flex-grow justify-start"
              >
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm font-bold">
                  {date ? (date.toDateString() === new Date().toDateString() ? 'Today' : format(date, "MMM d, yyyy")) : 'Select Date'}
                </span>
                <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
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

          <div className="bg-white/10 border border-white/20 rounded-xl px-4 h-11 flex items-center gap-2 shrink-0">
             <Hash className="h-4 w-4 text-white/50" />
             <span className="text-sm font-bold">{orderCount} {orderCount === 1 ? 'Record' : 'Records'}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4 pb-24 animate-in fade-in duration-500">
        {filteredTransactions.map((tx) => (
          <Card key={tx.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white hover:border-primary/20 transition-all border">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Ref</span>
                  <span className="text-lg font-bold text-slate-900 leading-none">#{tx.id}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-inner">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Table</span>
                  <span className="text-base font-black text-slate-900 leading-none">{tx.table}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-lg">
                  <User className="h-4 w-4 text-primary/60" />
                  <span>{tx.waiter}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-lg justify-end">
                  <Clock className="h-4 w-4 text-primary/60" />
                  <span>{tx.time}</span>
                </div>
              </div>

              <Separator className="opacity-50" />

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge className={cn(
                    "shadow-none text-xs font-bold px-3 py-1 rounded-lg border",
                    tx.status === 'Paid' ? "bg-green-50 text-green-700 border-green-100" : 
                    tx.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-blue-50 text-blue-700 border-blue-100"
                  )}>
                    {tx.status.toUpperCase()}
                  </Badge>
                  {tx.method !== 'None' && (
                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-500 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg">
                      {tx.method === 'Card' ? <CreditCard className="h-3.5 w-3.5" /> : <Landmark className="h-3.5 w-3.5" />}
                      {tx.method.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Final Amount</p>
                    <span className="text-2xl font-black text-[#0051B5] tracking-tighter tabular-nums">
                        ${tx.finalAmount.toFixed(2)}
                    </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Initial Bill</span>
                  <span className="text-base font-bold text-slate-700">${tx.initiatedAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center px-2">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Balance Due</span>
                  <span className={cn("text-base font-black", tx.pendingAmount > 0 ? "text-red-500" : "text-green-600")}>
                    ${tx.pendingAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-white p-8 rounded-full shadow-sm">
                <History className="h-12 w-12 text-slate-200" />
            </div>
            <div className="space-y-1">
                <p className="text-slate-900 font-bold text-lg uppercase tracking-tight">No Records Found</p>
                <p className="text-slate-400 text-sm font-medium">Try adjusting your search or date filter</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
