
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
        description: 'Please enter a valid table ID (e.g. T1001).',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <header className="flex items-center mb-8">
        <Link href="/navigation" passHref>
          <Button variant="outline" className="h-14 w-14 rounded-full border-2 border-primary">
            <ArrowLeft className="h-8 w-8" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black mx-auto uppercase tracking-tighter">TABLE NUMBER</h1>
        <div className="w-14"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center pb-32">
        <div className="flex flex-col items-center space-y-12 w-full max-w-sm">
          
          <div className="flex items-center justify-center h-40 w-40 rounded-full bg-muted border-8 border-primary shadow-xl">
              <Hash className="h-20 w-20 text-primary" />
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground text-2xl font-black uppercase tracking-widest">
              Enter Table ID
            </p>
            <p className="text-slate-400 text-lg font-bold">Ex: T1001, V101</p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }} 
            className="w-full space-y-8"
          >
              <Input
                type="text"
                placeholder="T1001"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="text-center text-6xl h-40 font-black border-4 border-primary rounded-[2.5rem] shadow-inner focus-visible:ring-primary uppercase"
                autoFocus
              />
              <Button 
                type="submit" 
                className="w-full h-24 text-3xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-transform"
              >
                  <span>GO TO ORDER</span>
                  <ArrowRight className="h-10 w-10" />
              </Button>
          </form>
        </div>
      </main>

      {/* Floating Mode Switcher */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 text-white rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-1 border border-white/10 backdrop-blur-lg">
          <Link href="/table-selection" passHref>
            <Button 
              variant="ghost" 
              className="h-12 px-6 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center gap-2"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-tighter">GRID VIEW</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="h-12 px-6 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
          >
            <Hash className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-tighter">MANUAL</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
