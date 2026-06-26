
"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, ChevronRight, Palette, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const settingsOptions = [
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
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">Settings</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow p-4">
        <div className="space-y-2">
            <div className="p-3">
              <h2 className="font-semibold text-lg">General</h2>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                    <Label htmlFor="dark-mode-switch" className="text-base font-normal">Dark Mode</Label>
                </div>
                <Switch id="dark-mode-switch" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                    <Label htmlFor="auto-print-switch" className="text-base font-normal">Auto-print Receipts</Label>
                </div>
                <Switch id="auto-print-switch" defaultChecked />
            </div>

            <Separator className="my-4" />

            <div className="p-3">
              <h2 className="font-semibold text-lg">Preferences</h2>
            </div>

            <ul className="space-y-1">
            {settingsOptions.map((option) => (
                <li key={option.name}>
                    <Link href={option.path}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
                            <div className="flex items-center gap-3">
                                <option.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="text-base">{option.name}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Link>
                </li>
            ))}
            </ul>
        </div>
      </main>
      <footer className="p-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              End Shift
          </Button>
      </footer>
    </div>
  );
}
