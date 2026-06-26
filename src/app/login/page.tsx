
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, UserCheck, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    if (staffId.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid ID",
        description: "Employee ID must be exactly 6 digits.",
      });
      return;
    }

    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('staffId', staffId);
    }
    
    toast({
        title: "Access Granted",
        description: `Welcome back, Staff #${staffId}`,
    });

    setTimeout(() => {
      router.push('/navigation');
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <div className="h-20 w-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Store className="h-10 w-10 text-primary" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{restaurantName || 'BRANCH TERMINAL'}</p>
        <h1 className="text-3xl font-bold text-slate-900">Staff Login</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <Input
            id="staffId"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            value={staffId}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 6) setStaffId(val);
            }}
            disabled={isLoading}
            className="text-center text-4xl h-24 font-bold border-2 border-slate-100 rounded-2xl focus-visible:ring-primary/20 tabular-nums"
            autoFocus
          />
          <p className="text-center text-xs text-slate-400 font-medium">Enter your 6-digit employee identification number</p>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || staffId.length !== 6}
          className="w-full h-16 text-lg font-bold bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6" />
              <span>START SHIFT</span>
            </div>
          )}
        </Button>
      </form>

      <div className="mt-20 text-center opacity-30">
          <p className="text-[10px] font-bold uppercase tracking-widest">Secure Terminal Session</p>
      </div>
    </div>
  );
}
