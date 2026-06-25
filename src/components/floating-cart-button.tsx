
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { QuantitySelector } from './quantity-selector';
import { Separator } from './ui/separator';

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
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[40] animate-in fade-in duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
          "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-background/95 backdrop-blur-md border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 z-[50]",
          isOpen ? "rounded-t-[2.5rem]" : ""
        )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="p-6 space-y-4 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Your Order</h3>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)} 
                    className="h-10 w-10 rounded-full bg-slate-100"
                >
                   <X className="h-5 w-5" />
                </Button>
              </div>
              
              <ul className="divide-y-2 divide-slate-100">
                  {cartItems.map(item => {
                      const displayPrice = getDisplayPrice(item);
                      const variationString = getVariationString(item);
                      return (
                          <li key={item.cartItemId} className="flex flex-col py-5 gap-3">
                              <div className="flex items-start justify-between">
                                  <div className="flex-grow">
                                      <p className="text-lg font-black text-slate-900 uppercase leading-tight">{item.name}</p>
                                      {variationString && (
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                                            {variationString}
                                        </p>
                                      )}
                                      <p className="text-primary font-black mt-1">${displayPrice.toFixed(2)} ea</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-lg font-black font-mono text-slate-900">${(displayPrice * item.quantity).toFixed(2)}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <QuantitySelector
                                    quantity={item.quantity}
                                    onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    className="bg-white border-2 border-slate-100 h-12"
                                  />
                              </div>
                          </li>
                      )
                  })}
              </ul>
          </CollapsibleContent>

          <div className="flex items-center justify-between p-4 gap-4 bg-white/50">
            <div className="flex items-center gap-3">
              <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-100/50 text-slate-600 hover:bg-slate-200">
                      {isOpen ? <ChevronDown className="h-6 w-6 stroke-[3]" /> : <ChevronUp className="h-6 w-6 stroke-[3]" />}
                  </Button>
              </CollapsibleTrigger>
              <div className="relative">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <ShoppingBasket className="h-7 w-7 text-primary" />
                </div>
                <Badge className="absolute -top-2 -right-2 px-2 py-0.5 text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center bg-primary text-white border-4 border-white shadow-sm">
                  {totalItems}
                </Badge>
              </div>
              <div>
                <span className='text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]'>Subtotal</span>
                <p className="font-black text-2xl leading-none text-slate-900 tabular-nums tracking-tighter">${subtotal.toFixed(2)}</p>
              </div>
            </div>
            
            <Link href="/checkout" passHref className="flex-grow">
              <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-white shadow-xl rounded-2xl text-xl font-black uppercase tracking-tighter flex items-center justify-center gap-2">
                <span>Checkout</span>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </Collapsible>
      </div>
    </>
  );
}
