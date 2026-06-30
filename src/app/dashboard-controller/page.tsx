
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  LayoutGrid, 
  FileText, 
  QrCode, 
  Zap, 
  ShieldCheck,
  ToggleRight,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { id: 'new-order', label: 'New Order', icon: FileText, description: 'Direct access to table identification and menu.' },
  { id: 'table-settlement', label: 'Table Settlement', icon: LayoutGrid, description: 'Shortcut to bill settlement flow.' },
  { id: 'scan-qr', label: 'Scan QR Code', icon: QrCode, description: 'Optical scanner for table validation.' },
  { id: 'direct-sale', label: 'Direct Sale', icon: Zap, description: 'Quick checkout for manual orders.' },
];

export default function DashboardControllerPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    'new-order': true,
    'table-settlement': true,
    'scan-qr': true,
    'direct-sale': true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboard-quick-actions');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    }
  }, []);

  const handleToggle = (id: string) => {
    const nextSettings = { ...settings, [id]: !settings[id] };
    setSettings(nextSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-quick-actions', JSON.stringify(nextSettings));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white border-b px-4 h-16 flex items-center shadow-sm">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-900 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex flex-col items-center mx-auto">
          <h1 className="text-sm font-black uppercase text-slate-900 tracking-tight leading-none">Dashboard Controller</h1>
          <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Independent Protocol</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-6 space-y-8 animate-in fade-in duration-500 max-w-[420px] mx-auto w-full pb-32">
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
                <ToggleRight className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest">Interface Visibility</h2>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed px-1">
                Toggle the visibility of quick actions on the main terminal dashboard. The layout will automatically adjust.
            </p>
        </div>

        <div className="space-y-4">
          {QUICK_ACTIONS.map((action) => (
            <Card 
              key={action.id} 
              className={cn(
                "rounded-[2rem] border-2 p-5 flex items-center justify-between transition-all duration-300 shadow-sm",
                settings[action.id] ? "bg-white border-primary/10" : "bg-slate-100/50 border-transparent opacity-60"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                    settings[action.id] ? "bg-blue-50 text-primary shadow-inner" : "bg-slate-200 text-slate-400"
                )}>
                  <action.icon className="h-7 w-7" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-sm text-slate-900 uppercase leading-none">{action.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 leading-tight max-w-[140px]">
                    {action.description}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                 <Switch 
                    checked={settings[action.id]} 
                    onCheckedChange={() => handleToggle(action.id)}
                    className="data-[state=checked]:bg-primary"
                 />
                 <div className="flex items-center gap-1.5">
                    {settings[action.id] ? (
                        <><Eye className="h-3 w-3 text-emerald-500" /><span className="text-[8px] font-black text-emerald-600 uppercase">Visible</span></>
                    ) : (
                        <><EyeOff className="h-3 w-3 text-slate-400" /><span className="text-[8px] font-black text-slate-500 uppercase">Hidden</span></>
                    )}
                 </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-6 text-center shadow-xl space-y-4">
            <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Management Access Only</p>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                "Settings applied here are stored in local browser cache and affect only this specific terminal device."
            </p>
            <Link href="/navigation" passHref>
                <Button className="w-full h-12 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all uppercase text-xs">
                    Return to Dashboard
                </Button>
            </Link>
        </div>
      </main>
      
      <footer className="p-10 flex flex-col items-center">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Network POS Infrastructure Controller</p>
      </footer>
    </div>
  );
}

// Utility to handle class merging
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
