
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, User } from 'lucide-react';

/**
 * DesignGuard Component
 * 
 * Provides a secure login layer for the application design.
 * Requires specific credentials to access the terminal design.
 */
export function DesignGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const authStatus = sessionStorage.getItem('design_authorized');
    if (authStatus === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'design@emenu.net' && password === 'admin031306') {
      sessionStorage.setItem('design_authorized', 'true');
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) return null;

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0051B5] text-white p-6">
        <div className="w-full max-w-[340px] space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-xl">
               <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase">Design Guard</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Enterprise Access Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 rounded-2xl pl-12 font-bold focus-visible:ring-white/30"
                  autoFocus
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40" />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 rounded-2xl pl-12 font-bold focus-visible:ring-white/30"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl">
                <p className="text-red-200 text-[9px] font-black uppercase tracking-[0.2em] text-center">
                  Invalid Security Credentials
                </p>
              </div>
            )}

            <Button 
              type="submit"
              className="w-full h-16 bg-white text-[#0051B5] hover:bg-white/90 font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all active:scale-95 text-sm"
            >
              Verify Identity
            </Button>
          </form>

          <div className="pt-12 text-center opacity-20">
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">Terminal Node Secure Protocol</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
