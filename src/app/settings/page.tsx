
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
  LogOut,
  Wifi,
  Smartphone,
  ChevronRight
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
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-900 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-sm font-black mx-auto uppercase text-slate-900 tracking-tight">System Configuration</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-5 space-y-6 animate-in fade-in duration-500 pb-32 max-w-[420px] mx-auto w-full">
        
        {/* Section 1: Hardware & Connectivity */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
             <Smartphone className="h-4 w-4 text-slate-400" />
             <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Terminal & Connectivity</h2>
          </div>
          <Card className="rounded-[1.5rem] border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-5 space-y-5">
              <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-xl border border-green-100">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-700 uppercase">Device Status</span>
                </div>
                <span className="text-xs font-black text-green-700 uppercase tracking-tighter">Ready</span>
              </div>
              
              <div className="space-y-3 px-1">
                {[
                    { label: 'Connectivity', value: 'WIFI', icon: Wifi },
                    { label: 'Terminal ID', value: '88889011' },
                    { label: 'Merchant ID', value: '0010000000030' },
                    { label: 'N-Genius Version', value: '2.08.804' }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-500">{item.label}</span>
                        <span className="font-bold text-slate-900 tracking-tight tabular-nums">{item.value}</span>
                    </div>
                ))}
              </div>

              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={isRefreshing}
                className="w-full h-12 border-2 border-slate-100 rounded-xl text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all bg-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-[#0051B5] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Hardware Status</span>
              </Button>
            </div>
            <div className="bg-slate-50/50 p-3 text-center border-t border-slate-100">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Manage N-Genius terminal connectivity and settings</p>
            </div>
          </Card>
        </div>

        {/* Section 2: Payment Logic */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
             <CreditCard className="h-4 w-4 text-slate-400" />
             <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Transaction Controls</h2>
          </div>
          <Card className="rounded-[1.5rem] border-slate-200 shadow-sm bg-white p-5">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">Custom Payments</p>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">Allow entering a custom amount when paying an order</p>
                </div>
                <Switch 
                    checked={customPaymentsEnabled} 
                    onCheckedChange={setCustomPaymentsEnabled}
                    className="data-[state=checked]:bg-[#0051B5]"
                />
            </div>
          </Card>
        </div>

        {/* Section 3: Operations & Receipts */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
             <Printer className="h-4 w-4 text-slate-400" />
             <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Printer & Audit</h2>
          </div>
          <Card className="rounded-[1.5rem] border-slate-200 shadow-sm bg-white overflow-hidden divide-y divide-slate-50">
            <div className="p-5 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                    <p className="text-sm font-bold text-slate-900">Auto-Print Receipt</p>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">Print after successful settlement</p>
                </div>
                <Switch checked={autoPrint} onCheckedChange={setAutoPrint} className="data-[state=checked]:bg-[#0051B5]" />
            </div>
            <div className="p-5 flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                    <p className="text-sm font-bold text-slate-900">Display Tip Line</p>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">Show manual tip entry line on print</p>
                </div>
                <Switch checked={showTipLine} onCheckedChange={setShowTipLine} className="data-[state=checked]:bg-[#0051B5]" />
            </div>
            <div className="p-5 flex items-center justify-between bg-slate-50/20">
                <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">Auto Z-Report</p>
                        <Badge variant="outline" className="text-[9px] font-black uppercase py-0 px-1.5 border-slate-200 text-slate-400">Compliance</Badge>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">Generate report automatically at shift end</p>
                </div>
                <Switch checked={autoZReport} onCheckedChange={setAutoZReport} className="data-[state=checked]:bg-[#0051B5]" />
            </div>
          </Card>
        </div>

        {/* Section 4: System Audit */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
             <Info className="h-4 w-4 text-slate-400" />
             <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">App Information</h2>
          </div>
          <Card className="rounded-[1.5rem] border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">Network Dine POS</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production Build</p>
                    </div>
                    <div className="text-right">
                        <Badge variant="outline" className="bg-blue-50 text-[#0051B5] border-blue-100 font-black text-[10px] uppercase px-2.5 py-1 rounded-lg">v15.0</Badge>
                    </div>
                </div>
                <Separator className="bg-slate-100" />
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-tighter">Build Number</span>
                    <span className="font-black text-slate-900 tabular-nums">15</span>
                </div>
            </div>
            
            <div className="bg-slate-900 p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-white" />
                    <p className="text-[9px] font-black tracking-[0.2em] text-white uppercase">Secure Enterprise Session Active</p>
                </div>
            </div>
          </Card>
        </div>

        {/* Section 5: Destructive Actions */}
        <div className="pt-4 px-1">
            <Button 
                variant="outline" 
                className="w-full h-14 border-2 border-red-100 text-red-600 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-50 hover:border-red-200 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm bg-white" 
                onClick={handleLogout}
            >
                <LogOut className="h-4 w-4" />
                Reset Terminal Session
            </Button>
            <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mt-6">
               Network POS Infrastructure Infrastructure v2.4
            </p>
        </div>
      </main>
    </div>
  );
}
