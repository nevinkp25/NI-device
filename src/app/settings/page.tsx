
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CreditCard, 
  RefreshCw, 
  Printer, 
  FileBarChart, 
  Info,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customPaymentsEnabled, setCustomPaymentsEnabled] = useState(false);
  const [autoPrint, setAutoPrint] = useState(true);
  const [showTipLine, setShowTipLine] = useState(false);
  const [autoZReport, setAutoZReport] = useState(true);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('staffId');
    }
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white border-b px-4 h-16 flex items-center shadow-sm">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-900">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-sm font-black mx-auto uppercase text-slate-900 tracking-tight">System Settings</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-6 space-y-8 animate-in fade-in duration-500 pb-32">
        {/* 1. Terminal & Connectivity */}
        <section className="space-y-2">
          <div className="flex items-center gap-3 px-1 text-slate-900">
             <div className="h-10 w-10 bg-[#0051B5]/10 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#0051B5]" />
             </div>
             <h2 className="text-lg font-bold tracking-tight">Terminal & Connectivity</h2>
          </div>
          <p className="text-xs font-medium text-slate-500 px-1 leading-relaxed">
            Manage N-Genius terminal connectivity and settings
          </p>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">Device Status</span>
                <span className="text-sm font-medium text-green-600">Ready</span>
              </div>
              
              <Separator className="bg-slate-50" />

              <div className="space-y-4">
                {[
                    { label: 'Connectivity', value: 'WIFI' },
                    { label: 'Terminal ID', value: '88889011' },
                    { label: 'Merchant ID', value: '0010000000030' },
                    { label: 'N-Genius Version', value: '2.08.804' }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-500">{item.label}</span>
                        <span className="font-bold text-slate-900 tracking-tight">{item.value}</span>
                    </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
              className="w-full h-14 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 text-[#0051B5] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </Button>
          </Card>
        </section>

        {/* 2. Custom Payments */}
        <section className="space-y-2">
          <div className="flex items-center gap-3 px-1 text-slate-900">
             <div className="h-10 w-10 bg-[#0051B5]/10 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#0051B5]" />
             </div>
             <h2 className="text-lg font-bold tracking-tight">Custom Payments</h2>
          </div>
          <p className="text-xs font-medium text-slate-500 px-1 leading-relaxed">
            Allow entering a custom amount when paying an order
          </p>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Enable Custom Payments</span>
                <Switch 
                    checked={customPaymentsEnabled} 
                    onCheckedChange={setCustomPaymentsEnabled}
                    className="data-[state=checked]:bg-[#0051B5]"
                />
            </div>
          </Card>
        </section>

        {/* 3. Order Receipt Settings */}
        <section className="space-y-2">
          <div className="flex items-center gap-3 px-1 text-slate-900">
             <div className="h-10 w-10 bg-[#0051B5]/10 rounded-xl flex items-center justify-center">
                <Printer className="h-6 w-6 text-[#0051B5]" />
             </div>
             <h2 className="text-lg font-bold tracking-tight">Order Receipt Settings</h2>
          </div>
          <p className="text-xs font-medium text-slate-500 px-1 leading-relaxed">
            Configure receipt printing behavior after settlement
          </p>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6 divide-y divide-slate-50">
            <div className="flex items-center justify-between py-4 first:pt-0">
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Auto-Print Receipt</p>
                    <p className="text-[10px] font-medium text-slate-400">Print after successful settlement</p>
                </div>
                <Switch checked={autoPrint} onCheckedChange={setAutoPrint} className="data-[state=checked]:bg-[#0051B5]" />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Display Tip Line</p>
                    <p className="text-[10px] font-medium text-slate-400">Show manual tip entry line on print</p>
                </div>
                <Switch checked={showTipLine} onCheckedChange={setShowTipLine} className="data-[state=checked]:bg-[#0051B5]" />
            </div>
          </Card>
        </section>

        {/* 4. Auto Z-Report */}
        <section className="space-y-2">
          <div className="flex items-center gap-3 px-1 text-slate-900">
             <div className="h-10 w-10 bg-[#0051B5]/10 rounded-xl flex items-center justify-center">
                <FileBarChart className="h-6 w-6 text-[#0051B5]" />
             </div>
             <h2 className="text-lg font-bold tracking-tight">Auto Z-Report</h2>
          </div>
          <p className="text-xs font-medium text-slate-500 px-1 leading-relaxed">
            Financial auditing and shift end reporting
          </p>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Auto Z-Report</p>
                    <p className="text-[10px] font-medium text-slate-400">Generate report automatically at shift end</p>
                </div>
                <Switch checked={autoZReport} onCheckedChange={setAutoZReport} className="data-[state=checked]:bg-[#0051B5]" />
            </div>
          </Card>
        </section>

        {/* 5. App Information */}
        <section className="space-y-2">
          <div className="flex items-center gap-3 px-1 text-slate-900">
             <div className="h-10 w-10 bg-[#0051B5]/10 rounded-xl flex items-center justify-center">
                <Info className="h-6 w-6 text-[#0051B5]" />
             </div>
             <h2 className="text-lg font-bold tracking-tight">App Information</h2>
          </div>
          <p className="text-xs font-medium text-slate-500 px-1 leading-relaxed">
            Production environment and build details
          </p>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">Network Dine POS</p>
                        <p className="text-[10px] font-bold text-slate-400">Production Build</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-[#0051B5] border-blue-100 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">v15.0</Badge>
                </div>
                <Separator className="bg-slate-50" />
                <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-400">Build Number</span>
                    <span className="font-bold text-slate-900">15</span>
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                <div className="flex items-center justify-center gap-1.5 opacity-40">
                    <ShieldCheck className="h-3 w-3 text-slate-900" />
                    <p className="text-[9px] font-bold tracking-[0.2em] text-slate-900 uppercase">Secure Enterprise Session</p>
                </div>
            </div>
          </Card>
        </section>

        <section className="pt-4">
            <Button 
                variant="outline" 
                className="w-full h-16 border-2 border-red-100 text-red-600 rounded-2xl font-bold uppercase text-xs hover:bg-red-50 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm" 
                onClick={handleLogout}
            >
                <LogOut className="h-5 w-5" />
                Reset Terminal Session
            </Button>
        </section>
      </main>

      <footer className="p-8 text-center opacity-20 pointer-events-none">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Network N-Genius Infrastructure</p>
      </footer>
    </div>
  );
}
