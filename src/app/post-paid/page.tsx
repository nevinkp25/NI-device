
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home } from 'lucide-react';
import Link from 'next/link';

function PostPaidContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/navigation');
    }, 5000); // Increased to 5 seconds for better user experience

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-6">
            <div className="animate-in fade-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-24 w-24 text-primary" />
            </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Post-Paid Enabled</h1>
        {orderId && (
            <p className="text-lg text-muted-foreground mb-4">
                Order #{orderId} is now marked as post-paid.
            </p>
        )}

        <p className="text-muted-foreground mb-8">
            The customer can proceed to the counter for payment.
        </p>
        
        <div className="mt-8 space-y-3">
            <Link href="/navigation" passHref>
                <Button className="w-full h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    <Home className="mr-2 h-6 w-6"/>
                    Back to Home
                </Button>
            </Link>
             <p className="text-xs text-muted-foreground pt-2">
                Redirecting automatically in a few seconds...
            </p>
        </div>
      </div>
    </div>
  );
}

export default function PostPaidPage() {
    return (
        <Suspense fallback={<div>Processing...</div>}>
            <PostPaidContent />
        </Suspense>
    )
}
