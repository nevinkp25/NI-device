"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [staffId, setStaffId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) return;

    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('staffId', staffId);
    }
    
    toast({
        title: "Staff ID Recognized",
        description: `Welcome Back!`,
    });

    setTimeout(() => {
      router.push('/navigation');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-[#0051B5] tracking-tighter">NETWORK</h1>
        <p className="text-2xl font-bold text-muted-foreground mt-2 uppercase tracking-widest">Staff Portal</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <label htmlFor="staffId" className="block text-2xl font-bold text-center">
            Tap here to enter ID:
          </label>
          <Input
            id="staffId"
            type="number"
            placeholder="0000"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            disabled={isLoading}
            className="text-center text-5xl h-24 font-bold border-4 border-primary/20 rounded-2xl shadow-inner focus-visible:ring-primary"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !staffId}
          className="w-full h-24 text-3xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-xl flex items-center justify-center gap-4"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-10 w-10" />
          ) : (
            <>
              <UserCheck className="h-10 w-10" />
              <span>START WORK</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}