
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, CreditCard, RefreshCw, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function TerminalConnectivityPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customPaymentsEnabled, setCustomPaymentsEnabled] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/80">
      <header className="flex items-center p-4 h-16 shrink-0">
        <Link href="/settings" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-900">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-6 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Terminal & Connectivity Section */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
               <CreditCard className="h-6 w-6 text-[#0069B1]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Terminal & Connectivity</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Manage N-Genius terminal connectivity and settings
              </p>
            </div>
          </div>

          <Card className="rounded-[2rem] border-none shadow-sm bg-slate-100/60 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-800">Device Status</span>
                <span className="text-base font-bold text-green-600">Ready</span>
              </div>
              
              <div className="h-px bg-slate-200" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Connectivity</span>
                  <span className="font-bold text-slate-900 uppercase">WIFI</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Terminal ID</span>
                  <span className="font-black text-slate-900 tracking-tight">88889011</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">Merchant ID</span>
                  <span className="font-black text-slate-900 tracking-tight">0010000000030</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">N-Genius Version</span>
                  <span className="font-black text-slate-900 tracking-tight">2.08.804</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
              className="w-full h-14 border-2 border-slate-300 rounded-2xl bg-transparent text-slate-800 font-bold uppercase text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </Button>
          </Card>
        </section>

        {/* Custom Payments Section */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
             <div className="mt-1">
               <Smartphone className="h-6 w-6 text-[#0069B1]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Custom Payments</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Allow entering a custom amount when paying an order
              </p>
            </div>
          </div>

          <Card className="rounded-[2rem] border-none shadow-sm bg-slate-100/60 p-8 flex items-center justify-between">
            <span className="text-base font-bold text-slate-800">Enable Custom Payments</span>
            <Switch 
              checked={customPaymentsEnabled} 
              onCheckedChange={setCustomPaymentsEnabled}
              className="data-[state=checked]:bg-[#0069B1]"
            />
          </Card>
        </section>
      </main>

      <footer className="p-8 text-center opacity-20">
         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Network N-Genius Infrastructure</p>
      </footer>
    </div>
  );
}
