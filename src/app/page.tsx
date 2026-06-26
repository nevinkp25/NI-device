
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RestaurantEntryPage() {
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;

    setIsLoading(true);
    if (typeof window !== 'undefined') {
        localStorage.setItem('restaurantSlug', slug.toLowerCase());
    }
    
    toast({
        title: "Accessing Restaurant",
        description: `Connecting to ${slug.toUpperCase()} terminal...`,
    });

    // Simulate connection delay for professional feel
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0051B5] p-8 text-white">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-7xl font-black tracking-tighter">NETWORK</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-1 w-12 bg-white/30 rounded-full"></span>
            <p className="text-xl font-bold uppercase tracking-[0.3em] opacity-80">DINE SYSTEM</p>
            <span className="h-1 w-12 bg-white/30 rounded-full"></span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-10">
        <div className="space-y-4">
          <label htmlFor="restaurantSlug" className="block text-xl font-bold text-center opacity-90 uppercase tracking-widest">
            Enter Restaurant Slug
          </label>
          <div className="relative">
              <Input
                id="restaurantSlug"
                type="text"
                placeholder="RESTAURANT-NAME"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isLoading}
                className="text-center text-3xl h-24 font-black bg-white/10 border-4 border-white/20 rounded-3xl text-white placeholder:text-white/20 focus-visible:ring-white/50 uppercase tracking-tighter"
                autoFocus
              />
              <div className="absolute -bottom-6 left-0 w-full text-center">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Verified Hardware ID Required</p>
              </div>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !slug}
          className="w-full h-24 text-2xl font-black bg-white text-[#0051B5] hover:bg-white/90 rounded-3xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-10 w-10" />
          ) : (
            <>
              <Building2 className="h-8 w-8" />
              <span>ACCESS TERMINAL</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
      
      <footer className="fixed bottom-10 opacity-30">
          <p className="text-[9px] font-black tracking-[0.5em] uppercase">Enterprise Grade POS Integration</p>
      </footer>
    </div>
  );
}
