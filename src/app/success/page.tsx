"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-background p-8">
      <div className="animate-in fade-in zoom-in-50 duration-1000">
        <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto" />
      </div>

      <h1 className="text-3xl font-headline font-bold mt-6 mb-2 animate-in fade-in-0 slide-in-from-bottom-5 delay-300 duration-700">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 animate-in fade-in-0 slide-in-from-bottom-5 delay-500 duration-700">
        Your order has been placed.
        <br />
        Thank you for using SwiftBite!
      </p>

      <div className="animate-in fade-in-0 slide-in-from-bottom-5 delay-700 duration-700">
        <Link href="/" passHref>
          <Button className="h-12 px-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
