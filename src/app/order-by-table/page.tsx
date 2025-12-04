"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ClipboardList } from 'lucide-react';
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
      router.push('/menu');
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Table Number',
        description: 'Please enter a valid table number.',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">Order by Table</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
        <ClipboardList className="h-16 w-16 text-primary" />
        <div className="space-y-2">
            <h2 className="text-2xl font-headline font-semibold">Enter Table Number</h2>
            <p className="text-muted-foreground">Please enter the table number to start an order.</p>
        </div>
        
        <form action={handleConfirm} className="w-full max-w-xs space-y-4">
            <Input
            type="number"
            placeholder="e.g., 14"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="text-center text-4xl h-20"
            />
            <Button type="submit" className="w-full h-12 text-lg bg-accent text-accent-foreground">
                Confirm Table
            </Button>
        </form>
      </main>
    </div>
  );
}
