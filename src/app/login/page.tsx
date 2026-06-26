
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UserCheck, ArrowLeft } from 'lucide-react';
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
        title: "Staff ID Recognized",
        description: `Welcome back, User ${staffId}`,
    });

    setTimeout(() => {
      router.push('/navigation');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <Link href="/" className="fixed top-8 left-8">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-7 w-7 text-slate-400" />
          </Button>
      </Link>

      <div className="text-center mb-16 animate-in fade-in duration-700">
        <p className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-2">{restaurantName || 'RESTAURANT'}</p>
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter">STAFF PORTAL</h1>
        <p className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-widest">Shift Management System</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <label htmlFor="staffId" className="block text-xl font-bold text-center text-slate-600 uppercase tracking-tight">
            Input Employee PIN
          </label>
          <Input
            id="staffId"
            type="number"
            placeholder="0000"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            disabled={isLoading}
            className="text-center text-5xl h-24 font-black border-4 border-slate-200 rounded-3xl shadow-inner focus-visible:ring-primary tabular-nums tracking-tighter"
            autoFocus
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !staffId}
          className="w-full h-24 text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-3xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-10 w-10" />
          ) : (
            <>
              <UserCheck className="h-10 w-10" />
              <span>START SHIFT</span>
            </>
          )}
        </Button>
      </form>

      <div className="mt-12 text-center opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Hardware Terminal ID: 882-991</p>
      </div>
    </div>
  );
}
