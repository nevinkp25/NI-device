"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


const NetworkLogo = () => (
    <svg width="240" height="50" viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <text x="0" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="currentColor">
            network
        </text>
        <text x="185" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="#E53935">
            &gt;
        </text>
    </svg>
);


export default function Home() {
  const [staffId, setStaffId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) return;

    setIsLoading(true);
    // Simulate API call and store staffId
    if (typeof window !== 'undefined') {
        localStorage.setItem('staffId', staffId);
    }
    
    setTimeout(() => {
      router.push('/navigation');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center mb-12">
        <NetworkLogo />
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="space-y-4">
          <Input
            id="staffId"
            type="text"
            placeholder="Enter Staff ID Number"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            disabled={isLoading}
            className="text-center text-lg h-14"
          />
          <Button
            type="submit"
            disabled={isLoading || !staffId}
            className="w-full h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Recognize Staff ID'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
