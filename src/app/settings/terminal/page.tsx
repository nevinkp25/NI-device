
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  CreditCard, 
  RefreshCw, 
  Smartphone, 
  Printer, 
  FileBarChart, 
  Info,
  ChevronRight,
  ShieldCheck,
  Settings2
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TerminalConnectivityPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customPaymentsEnabled, setCustomPaymentsEnabled] = useState(false);
  const [autoPrint, setAutoPrint] = useState(true);
  const [printQr, setPrintQr] = useState(true);
  const [showTipLine, setShowTipLine] = useState(false);
  const [autoZReport, setAutoZReport] = useState(true);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const SettingRow = ({ label, description, checked, onCheckedChange }: { label: string, description?: string, checked: boolean, onCheckedChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{label}</p>
        {description && <p className="text-[10px] font-medium text-slate-400 uppercase leading-none">{description}</p>}
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-[#0069B1]"
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/80">
      <header className="sticky top-0 z-50 bg-white border-b px-4 h-16 flex items-center shadow-sm">
        <Link href="/settings" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-900">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-sm font-black mx-auto uppercase text-slate-900 tracking-tight">Terminal Configuration</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        {/* 1. Terminal & Connectivity */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 text-[#0069B1]">
             <CreditCard className="h-5 w-5" />
             <h2 className="text-xs font-black uppercase tracking-[0.15em]">Terminal Connectivity</h2>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase">Device Status</span>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-black text-green-600 uppercase">System Ready</span>
                </div>
              </div>
              
              <Separator className="bg-slate-50" />

              <div className="space-y-3">
                {[
                    { label: 'Connectivity', value: 'WIFI (Enterprise)' },
                    { label: 'Terminal ID', value: '88889011' },
                    { label: 'Merchant ID', value: '0010000000030' },
                    { label: 'N-Genius Ver', value: '2.08.804' }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-400 uppercase">{item.label}</span>
                        <span className="font-black text-slate-900 tracking-tight">{item.value}</span>
                    </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
              className="w-full h-12 border-2 border-slate-100 rounded-xl bg-slate-50 text-slate-800 font-bold uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-[0.98]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Link Status</span>
            </Button>
          </Card>
        </section>

        {/* 2. Custom Payments */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 text-[#0069B1]">
             <Smartphone className="h-5 w-5" />
             <h2 className="text-xs font-black uppercase tracking-[0.15em]">Payment Entry</h2>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-5">
            <SettingRow 
                label="Custom Amounts" 
                description="Allow manual value entry at settlement"
                checked={customPaymentsEnabled}
                onCheckedChange={setCustomPaymentsEnabled}
            />
          </Card>
        </section>

        {/* 3. Order Receipt Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 text-[#0069B1]">
             <Printer className="h-5 w-5" />
             <h2 className="text-xs font-black uppercase tracking-[0.15em]">Order Receipt Settings</h2>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-5 divide-y divide-slate-50">
            <SettingRow 
                label="Auto-Print Receipt" 
                description="Print after successful settlement"
                checked={autoPrint}
                onCheckedChange={setAutoPrint}
            />
            <SettingRow 
                label="Include QR Code" 
                description="Display feedback QR on receipt footer"
                checked={printQr}
                onCheckedChange={setPrintQr}
            />
            <SettingRow 
                label="Display Tip Line" 
                description="Show manual tip entry line on print"
                checked={showTipLine}
                onCheckedChange={setShowTipLine}
            />
          </Card>
        </section>

        {/* 4. Auto Z-Report */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 text-[#0069B1]">
             <FileBarChart className="h-5 w-5" />
             <h2 className="text-xs font-black uppercase tracking-[0.15em]">Financial Audit</h2>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white p-5">
            <SettingRow 
                label="Auto Z-Report" 
                description="Generate report automatically at shift end"
                checked={autoZReport}
                onCheckedChange={setAutoZReport}
            />
          </Card>
        </section>

        {/* 5. App Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 text-[#0069B1]">
             <Info className="h-5 w-5" />
             <h2 className="text-xs font-black uppercase tracking-[0.15em]">App Information</h2>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner">
                            <Settings2 className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 leading-none">Network Dine POS</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Version 2.4.1 (Stable)</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-[#0069B1] border-blue-100 font-black text-[9px] uppercase px-2 py-0.5 rounded-md">Production</Badge>
                </div>
                
                <Separator className="bg-slate-50" />
                
                <div className="space-y-2.5">
                    <button className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase hover:text-[#0069B1] transition-colors">
                        <span>Check for System Updates</span>
                        <ChevronRight className="h-4 w-4 opacity-30" />
                    </button>
                    <button className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase hover:text-[#0069B1] transition-colors">
                        <span>Legal & Compliance</span>
                        <ChevronRight className="h-4 w-4 opacity-30" />
                    </button>
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                <div className="flex items-center justify-center gap-1.5 opacity-40">
                    <ShieldCheck className="h-3 w-3 text-slate-900" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Secure Enterprise Build #031306</p>
                </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="p-8 text-center opacity-20 pointer-events-none">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Network N-Genius Infrastructure</p>
      </footer>
    </div>
  );
}
