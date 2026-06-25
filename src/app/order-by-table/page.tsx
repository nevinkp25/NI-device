"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Hash } from 'lucide-react';
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
        description: 'Please enter a valid table number.',
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

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center space-y-12 w-full max-w-sm">
          
          <div className="flex items-center justify-center h-32 w-32 rounded-full bg-muted border-4 border-primary">
              <Hash className="h-16 w-16 text-primary" />
          </div>

          <p className="text-muted-foreground text-2xl font-bold uppercase tracking-wide">
            Enter Table #
          </p>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }} 
            className="w-full space-y-8"
          >
              <Input
                type="number"
                placeholder="00"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="text-center text-6xl h-32 font-black border-4 border-primary rounded-3xl shadow-inner focus-visible:ring-primary"
                autoFocus
              />
              <Button 
                type="submit" 
                className="w-full h-24 text-3xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-xl flex items-center justify-center gap-4"
              >
                  <span>GO TO ORDER</span>
                  <ArrowRight className="h-10 w-10" />
              </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
