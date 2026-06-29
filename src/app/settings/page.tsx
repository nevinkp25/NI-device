
"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, ChevronRight, Palette, Lock, LogOut, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const settingsOptions = [
    { name: 'Terminal & Connectivity', icon: Terminal, path: '/settings/terminal' },
    { name: 'Appearance', icon: Palette, path: '#' },
    { name: 'Notifications', icon: Bell, path: '#' },
    { name: 'Account & Security', icon: Lock, path: '#' },
  ];

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('staffId');
    }
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50/50">
      <header className="flex items-center p-4 border-b bg-white">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="text-slate-900 rounded-full h-10 w-10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-sm font-black mx-auto uppercase text-slate-900 tracking-tight">System Settings</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4">
        <div className="space-y-2">
            <div className="p-3">
              <h2 className="font-black text-xs uppercase text-slate-400 tracking-widest">General Management</h2>
            </div>
            
            <ul className="space-y-1">
            {settingsOptions.map((option) => (
                <li key={option.name}>
                    <Link href={option.path}>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#0069B1]/30 cursor-pointer transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                    <option.icon className="h-5 w-5 text-[#0069B1]" />
                                </div>
                                <span className="text-sm font-bold text-slate-900 tracking-tight">{option.name}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-300" />
                        </div>
                    </Link>
                </li>
            ))}
            </ul>

            <Separator className="my-6 opacity-50" />

            <div className="p-3">
              <h2 className="font-black text-xs uppercase text-slate-400 tracking-widest">Interface Preferences</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <Label htmlFor="dark-mode-switch" className="text-sm font-bold text-slate-900">Dark Mode</Label>
                </div>
                <Switch id="dark-mode-switch" />
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mt-2">
                <div className="flex items-center gap-3">
                    <Label htmlFor="auto-print-switch" className="text-sm font-bold text-slate-900">Auto-print Receipts</Label>
                </div>
                <Switch id="auto-print-switch" defaultChecked />
            </div>
        </div>
      </main>
      <footer className="p-6">
          <Button variant="outline" className="w-full h-14 border-2 border-red-100 text-red-600 rounded-2xl font-black uppercase text-xs hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Reset Terminal Session
          </Button>
      </footer>
    </div>
  );
}
