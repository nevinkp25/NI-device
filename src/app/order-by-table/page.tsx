
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Hash, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { OrderStepper } from '@/components/order-stepper';

export default function OrderByTablePage() {
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleConfirm = () => {
    if (tableNumber.trim()) {
      router.push(`/menu?table=${tableNumber.toUpperCase()}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Empty Table ID',
        description: 'Please enter a table number.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background shadow-sm border-b">
        <div className="flex items-center px-4 pt-4 pb-2">
          <Link href="/navigation" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <h1 className="text-xl font-black mx-auto uppercase tracking-tighter">TABLE NUMBER</h1>
          <div className="w-10"></div>
        </div>
        <OrderStepper currentStep={1} />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pb-20">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirm();
          }} 
          className="w-full space-y-8"
        >
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">ENTER ID</p>
            <Input
              type="text"
              placeholder="00000"
              maxLength={5}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="text-center text-7xl h-32 font-black border-none focus-visible:ring-0 bg-transparent placeholder:text-slate-100 uppercase tabular-nums tracking-tighter"
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 text-2xl font-black bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-transform uppercase tracking-tighter"
          >
            GO TO MENU
          </Button>
        </form>
      </main>

      {/* MINIMAL FLOATING SWITCHER */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-slate-900/95 text-white rounded-full p-1 shadow-2xl flex items-center gap-1 border border-white/10 backdrop-blur-md">
           <div className="h-10 px-4 rounded-full bg-primary text-white flex items-center gap-2 shadow-inner">
            <Hash className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Manual</span>
          </div>
          <Link href="/table-selection" passHref>
            <Button 
              variant="ghost" 
              className="h-10 px-4 rounded-full text-white/50 hover:text-white flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Grid</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
