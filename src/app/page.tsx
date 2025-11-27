"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Utensils } from 'lucide-react';

export default function Home() {
  const [staffId, setStaffId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push('/menu');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center">
        <div className="inline-block p-4 bg-primary rounded-full mb-6">
          <Utensils className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-gray-800">SwiftBite</h1>
        <p className="text-muted-foreground mt-2 mb-8">Fast, Fresh, Fuel for Your Day.</p>
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
            className="text-center text-lg h-12"
          />
          <Button
            type="submit"
            disabled={isLoading || !staffId}
            className="w-full h-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
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
