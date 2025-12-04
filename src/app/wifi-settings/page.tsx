"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Wifi, WifiOff, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

export default function WifiSettingsPage() {
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState('SwiftBite_Guest_5G');

  const networks = [
    { name: 'SwiftBite_Guest_5G', strength: 90, isConnected: true },
    { name: 'SwiftBite_POS_Internal', strength: 85, isConnected: false },
    { name: 'Neighbour_Cafe_Free', strength: 50, isConnected: false },
    { name: 'xfinitywifi', strength: 40, isConnected: false },
  ];
  
  const handleConnect = (name: string) => {
    setIsConnecting(true);
    setConnectedNetwork('');
    setTimeout(() => {
        setIsConnecting(false);
        setConnectedNetwork(name);
    }, 2000);
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center p-4 border-b">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-semibold mx-auto">Wi-Fi Settings</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-grow p-4">
        <div className="flex items-center justify-between p-3 mb-4">
            <div className="flex items-center gap-3">
                {isWifiOn ? <Wifi className="h-5 w-5 text-primary" /> : <WifiOff className="h-5 w-5 text-muted-foreground" />}
                <span className="text-base font-semibold">Wi-Fi</span>
            </div>
            <Switch checked={isWifiOn} onCheckedChange={setIsWifiOn} />
        </div>

        {isWifiOn && (
            <div className="space-y-2">
                <h2 className="px-3 text-lg font-semibold">Networks</h2>
                {isConnecting && <Progress value={33} className="h-1 w-full" />}
                
                <ul className="space-y-1">
                    {networks.map((network) => (
                        <li key={network.name}>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer" onClick={() => handleConnect(network.name)}>
                                <div className="flex items-center gap-3">
                                    <span className="text-base">{network.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {connectedNetwork === network.name && !isConnecting && <Check className="h-5 w-5 text-primary" />}
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </main>
    </div>
  );
}
