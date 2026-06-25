
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Hash, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function OrderByTablePage() {
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleConfirm = () => {
    if (tableNumber.trim()) {
      toast({
        title: `Table ${tableNumber} Selected`,
        description: 'Fetching order details for this table.',
      });
      router.push(`/order-status?table=${tableNumber}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Table Number',
        description: 'Please enter a valid table ID.',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <header className="flex items-center mb-8">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
            <ArrowLeft className="h-6 w-6 text-primary" />
          </Button>
        </Link>
        <h1 className="text-xl font-black mx-auto uppercase tracking-tighter">MANUAL ENTRY</h1>
        <div className="w-12"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center pb-32">
        <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
          
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/5 text-primary border-4 border-primary/20">
              <Hash className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">
              Enter Table ID
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }} 
            className="w-full space-y-6"
          >
              <Input
                type="text"
                placeholder="T101"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="text-center text-5xl h-32 font-black border-4 border-primary rounded-3xl shadow-sm focus-visible:ring-primary uppercase"
                autoFocus
              />
              <Button 
                type="submit" 
                className="w-full h-16 text-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                  <span>GO TO ORDER</span>
                  <ArrowRight className="h-6 w-6" />
              </Button>
          </form>
        </div>
      </main>

      {/* MINIMAL FLOATING SWITCHER */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/95 text-white rounded-full p-1 shadow-2xl flex items-center gap-1 border border-white/10 backdrop-blur-md scale-90 sm:scale-100">
          <Link href="/table-selection" passHref>
            <Button 
              variant="ghost" 
              className="h-10 px-4 rounded-full text-white/50 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-all"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-tighter">GRID</span>
            </Button>
          </Link>
          <div className="h-10 px-4 rounded-full bg-primary text-white flex items-center gap-2 shadow-inner">
            <Hash className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-tighter">MANUAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
