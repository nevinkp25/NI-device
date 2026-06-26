
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
 * Styled to be distinct from the application branding.
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
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100 p-6">
        <div className="w-full max-w-[360px] space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-3">
            <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-2xl">
               <ShieldCheck className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Authorization Required</h2>
            <p className="text-sm text-slate-500">Please verify your identity to access the terminal design.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 h-14 rounded-2xl pl-12 font-medium focus-visible:ring-slate-700"
                  autoFocus
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 h-14 rounded-2xl pl-12 font-medium focus-visible:ring-slate-700"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
              </div>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-xl animate-in shake duration-300">
                <p className="text-red-400 text-xs font-medium text-center">
                  Invalid security credentials
                </p>
              </div>
            )}

            <Button 
              type="submit"
              className="w-full h-16 bg-slate-100 text-slate-950 hover:bg-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.97] text-base"
            >
              Verify Identity
            </Button>
          </form>

          <div className="pt-12 text-center opacity-20">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em]">Restricted Access Protocol</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
