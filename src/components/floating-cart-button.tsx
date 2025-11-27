"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { QuantitySelector } from './quantity-selector';

export function FloatingCartButton() {
  const { cartItems, updateQuantity, removeFromCart, totalItems, subtotal } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-background/80 backdrop-blur-sm border-t transition-all duration-300 ease-in-out",
        isExpanded ? "h-3/4" : "h-auto"
      )}>
      <div className="flex flex-col h-full">
        {isExpanded && (
          <div className="flex-grow overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-2">Your Order</h2>
            <ul className="divide-y">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center py-3 gap-3">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-primary font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex items-center justify-between w-full mb-4">
            <div className='flex items-center gap-2'>
              <ShoppingBasket />
              <Badge variant="secondary" className="text-base">{totalItems}</Badge>
            </div>
            <div className='flex items-center gap-2 font-bold'>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
          <Link href="/checkout" passHref>
            <Button className="w-full h-14 bg-accent text-accent-foreground text-lg hover:bg-accent/90 shadow-lg">
              <div className="flex items-center justify-center w-full gap-4">
                <span>Proceed to Checkout</span>
                <ArrowRight />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
