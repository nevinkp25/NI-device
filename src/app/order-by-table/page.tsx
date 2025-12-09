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
        description: 'Loading menu for this table.',
      });
      router.push(`/menu?table=${tableNumber}`);
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
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
          
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-muted mb-4">
              <Hash className="h-12 w-12 text-primary" />
          </div>

          <p className="text-muted-foreground text-lg">
            Please enter your table number <br /> to continue
          </p>
          
          <form action={handleConfirm} className="w-full space-y-4">
              <Input
                type="number"
                placeholder=""
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="text-center text-4xl h-20"
              />
              <Button type="submit" className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  <span>Go to Order</span>
                  <ArrowRight />
              </Button>
          </form>
          
          <Link href="/navigation" passHref>
              <Button variant="outline" className="w-48 h-12">
                  <ArrowLeft />
                  <span>Back to Home</span>
              </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
