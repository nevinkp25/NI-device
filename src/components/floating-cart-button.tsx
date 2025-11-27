"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';

export function FloatingCartButton() {
  const { totalItems, subtotal } = useCart();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-background/95 backdrop-blur-sm border-t"
      )}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBasket className="h-6 w-6 text-primary" />
            <Badge variant="secondary" className="absolute -top-2 -right-3 px-1.5 py-0.5 text-xs h-auto">
              {totalItems}
            </Badge>
          </div>
          <div>
            <span className='text-sm text-muted-foreground'>Subtotal</span>
            <p className="font-bold text-lg leading-tight">${subtotal.toFixed(2)}</p>
          </div>
        </div>
        <Link href="/checkout" passHref>
          <Button className="h-12 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg text-base">
            <span>Checkout</span>
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}
