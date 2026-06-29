
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Building2, Terminal, Menu, ShieldAlert, Settings, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        title: "Accessing Terminal",
        description: `Connecting to ${slug.toUpperCase()} branch...`,
    });

    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0051B5] p-8 text-white relative">
      {/* Quick Access Burger Menu */}
      <div className="fixed top-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-12 w-12 border-2 border-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-slate-200 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-2">Terminal Systems</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => toast({ title: "Supervisor Mode", description: "Manager credential override required." })}
            >
              <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Supervisor Menu</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="rounded-xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => router.push('/transaction-history')}
            >
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Manual Sale</span>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="rounded-xl h-14 gap-3 cursor-pointer focus:bg-slate-50" 
              onClick={() => router.push('/settings')}
            >
              <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Refined Branding Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl font-black tracking-tighter leading-none">NETWORK</h1>
        <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px w-8 bg-white/20"></span>
            <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-70">Dine Terminal</p>
            <span className="h-px w-8 bg-white/20"></span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="space-y-4">
          <div className="text-center">
            <label htmlFor="restaurantSlug" className="inline-block text-[11px] font-bold opacity-60 uppercase tracking-widest mb-1">
                Enter Branch Identifier
            </label>
          </div>
          
          <div className="relative group">
              <Input
                id="restaurantSlug"
                type="text"
                placeholder="Restaurant-Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isLoading}
                className="text-center text-xl h-16 font-bold bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder:text-white/20 focus-visible:ring-white/40 uppercase tracking-tight transition-all"
                autoFocus
              />
              <div className="mt-4 flex items-center justify-center gap-1.5 opacity-30">
                  <span className="h-1 w-1 bg-white rounded-full"></span>
                  <p className="text-[9px] font-bold uppercase tracking-widest">Enterprise Validation Required</p>
                  <span className="h-1 w-1 bg-white rounded-full"></span>
              </div>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !slug}
          className="w-full h-16 text-lg font-bold bg-white text-[#0051B5] hover:bg-white/90 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            <>
              <Building2 className="h-5 w-5" />
              <span>ACCESS TERMINAL</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
      
      <footer className="fixed bottom-10 flex flex-col items-center gap-2 opacity-20">
          <p className="text-[8px] font-black tracking-[0.4em] uppercase">Secured by Network POS Infrastructure</p>
          <div className="h-1 w-24 bg-white/30 rounded-full" />
      </footer>
    </div>
  );
}
