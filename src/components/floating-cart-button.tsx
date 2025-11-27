"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function FloatingCartButton() {
  const { totalItems, subtotal } = useCart();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-4 bg-background/80 backdrop-blur-sm border-t">
      <Link href="/checkout" passHref>
        <Button className="w-full h-14 bg-accent text-accent-foreground text-lg hover:bg-accent/90 shadow-lg">
          <div className="flex items-center justify-between w-full">
            <div className='flex items-center gap-2'>
              <ShoppingBasket />
              <Badge variant="secondary" className="text-base">{totalItems}</Badge>
            </div>
            <span>Proceed to Checkout</span>
            <div className='flex items-center gap-2'>
              <span>${subtotal.toFixed(2)}</span>
              <ArrowRight />
            </div>
          </div>
        </Button>
      </Link>
    </div>
  );
}
