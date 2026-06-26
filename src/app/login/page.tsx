
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UserCheck, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function StaffLoginPage() {
  const [staffId, setStaffId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = localStorage.getItem('restaurantSlug');
      if (slug) setRestaurantName(slug.toUpperCase());
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) return;

    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('staffId', staffId);
    }
    
    toast({
        title: "ID Recognized",
        description: `Welcome back, Terminal User ${staffId}`,
    });

    setTimeout(() => {
      router.push('/navigation');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">{restaurantName || 'BRANCH TERMINAL'}</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">STAFF PORTAL</h1>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-40">
            <ShieldCheck className="h-3 w-3" />
            <p className="text-[9px] font-bold uppercase tracking-widest">Secure Shift Entry</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <div className="text-center">
            <label htmlFor="staffId" className="inline-block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Enter Employee ID
            </label>
          </div>
          
          <Input
            id="staffId"
            type="number"
            placeholder="0000"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            disabled={isLoading}
            className="text-center text-3xl h-20 font-black border-2 border-slate-200 rounded-2xl shadow-sm focus-visible:ring-primary/20 tabular-nums tracking-tighter"
            autoFocus
          />
        </div>
        
        <div className="space-y-3 flex flex-col">
          <Button
            type="submit"
            disabled={isLoading || !staffId}
            className="w-full h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <>
                <UserCheck className="h-6 w-6" />
                <span>START SHIFT</span>
              </>
            )}
          </Button>

          <Link href="/" passHref className="w-full mt-10 block">
            <Button 
              variant="outline" 
              className="w-full h-16 text-lg font-bold border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl shadow-sm transition-all active:scale-[0.98] uppercase tracking-tight"
            >
              Manual Sale
            </Button>
          </Link>
        </div>
      </form>

      <div className="mt-12 text-center opacity-30">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Hardware ID: 882-991-POS</p>
          <div className="h-1 w-16 bg-slate-200 rounded-full mx-auto mt-2" />
      </div>
    </div>
  );
}
