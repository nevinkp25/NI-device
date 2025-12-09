
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
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
            <div className="animate-in fade-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-20 w-20 text-primary" />
            </div>
        </div>
        
        <h1 className="text-2xl font-bold">Post Paid Enabled</h1>
        {orderId && (
            <p className="text-muted-foreground mb-6">
                Order #{orderId} has been marked as Post Paid.
            </p>
        )}

        <p className="text-sm text-muted-foreground mb-6">
            Customer can now pay at the counter.
        </p>
        
        <div className="mt-6 space-y-3">
            <p className="text-xs text-muted-foreground">Redirecting to home screen...</p>
            <Link href="/navigation" passHref>
                <Button className="w-full h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                    <Home className="mr-2"/>
                    Back to Home Now
                </Button>
            </Link>
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
