"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { QuantitySelector } from './quantity-selector';
import { Separator } from './ui/separator';

export function FloatingCartButton() {
  const { cartItems, totalItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-background/95 backdrop-blur-sm border-t"
      )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="p-4 space-y-3 max-h-60 overflow-y-auto">
            <h3 className="text-lg font-headline font-semibold">Your Order</h3>
            <ul className="divide-y">
                {cartItems.map(item => (
                    <li key={item.id} className="flex items-center py-3 gap-3">
                    <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-primary font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
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
        </CollapsibleContent>
        <Separator />
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    {isOpen ? <ChevronDown /> : <ChevronUp />}
                    <span className="sr-only">Toggle cart details</span>
                </Button>
            </CollapsibleTrigger>
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
      </Collapsible>
    </div>
  );
}
