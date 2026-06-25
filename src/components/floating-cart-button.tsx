
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { QuantitySelector } from './quantity-selector';

export function FloatingCartButton() {
  const { cartItems, totalItems, subtotal, updateQuantity, getDisplayPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (totalItems === 0) {
    return null;
  }
  
  const getVariationString = (item: (typeof cartItems)[0]) => {
    const variationValues = Object.values(item.selectedVariations);
    if (variationValues.length === 0) return null;
    return variationValues.join(', ');
  }

  return (
    <div className={cn(
      "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-background border-t shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 z-50",
      isOpen ? "rounded-t-3xl" : ""
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900 px-1">Your Order</h3>
            <ul className="divide-y border-t border-slate-100">
                {cartItems.map(item => {
                    const displayPrice = getDisplayPrice(item);
                    const variationString = getVariationString(item);
                    return (
                        <li key={item.cartItemId} className="py-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <span className="font-bold text-slate-800 block">{item.name}</span>
                                    {variationString && <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{variationString}</span>}
                                    <span className="text-sm text-slate-500 font-medium block mt-0.5">${displayPrice.toFixed(2)} ea</span>
                                </div>
                                <span className="font-bold font-mono text-slate-900">${(displayPrice * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <QuantitySelector
                                  quantity={item.quantity}
                                  onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                  onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="bg-slate-50 border border-slate-100 max-w-[140px]"
                                />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </CollapsibleContent>

        <div className="flex items-center justify-between p-4 gap-4 bg-white">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-600">
                    {isOpen ? <ChevronDown /> : <ChevronUp />}
                </Button>
            </CollapsibleTrigger>
            <div className="relative">
              <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center">
                  <ShoppingBasket className="h-6 w-6 text-primary" />
              </div>
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full flex items-center justify-center bg-primary text-white border-2 border-white">
                {totalItems}
              </Badge>
            </div>
            <div className="flex flex-col">
              <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Subtotal</span>
              <p className="font-bold text-xl text-slate-900 leading-tight">${subtotal.toFixed(2)}</p>
            </div>
          </div>
          
          <Link href="/checkout" passHref className="flex-grow">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-md rounded-2xl font-bold flex items-center justify-center gap-2">
              <span>Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Collapsible>
    </div>
  );
}
