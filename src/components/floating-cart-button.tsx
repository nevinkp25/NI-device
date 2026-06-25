
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight, ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';
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
    <>
      {/* Dark Backdrop Overlay - Covers everything including header */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-[60] animate-in fade-in duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t-2 border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out z-[70]",
        isOpen ? "rounded-t-[2.5rem]" : ""
      )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="p-0 overflow-hidden">
              <div className="bg-[#F8FAFC] p-6 space-y-5 max-h-[70vh] overflow-y-auto pt-8">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-2xl text-slate-900 tracking-tight uppercase">Your Selection</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 font-semibold uppercase text-[10px] tracking-widest hover:bg-transparent" 
                    onClick={() => setIsOpen(false)}
                  >
                      Hide Details
                  </Button>
                </div>

                <ul className="space-y-4">
                    {cartItems.map(item => {
                        const displayPrice = getDisplayPrice(item);
                        const variationString = getVariationString(item);
                        return (
                            <li key={item.cartItemId} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-grow">
                                        <span className="font-bold text-xl text-slate-900 block leading-tight tracking-tight">
                                          {item.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold block mt-1 tracking-widest uppercase">
                                          ${displayPrice.toFixed(2)} EACH
                                        </span>
                                        {variationString && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                                              {variationString}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                    <span className="font-bold text-xl text-slate-900 tabular-nums">
                                      ${(displayPrice * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="bg-slate-50/80 p-1 rounded-2xl">
                                    <QuantitySelector
                                      quantity={item.quantity}
                                      onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                      onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                      className="bg-transparent border-none h-12 px-3"
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="h-4" />
              </div>
          </CollapsibleContent>

          <div className="flex items-center justify-between p-5 gap-4 bg-white relative">
            {/* Tactile Handle for Expansion */}
            <CollapsibleTrigger asChild>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-200 rounded-full cursor-pointer hover:bg-slate-300 transition-colors flex items-center justify-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                </div>
            </CollapsibleTrigger>

            <CollapsibleTrigger className="flex items-center gap-4 text-left outline-none group flex-shrink-0">
              <div className="relative">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ShoppingBasket className="h-7 w-7 text-primary" />
                </div>
                <Badge className="absolute -top-1.5 -right-1.5 h-6 min-w-6 flex items-center justify-center p-0 font-bold text-[12px] rounded-lg bg-primary text-white border-2 border-white shadow-md">
                  {totalItems}
                </Badge>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>TOTAL</span>
                    {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronUp className="h-3.5 w-3.5 text-slate-400" />}
                </div>
                <p className="font-bold text-2xl text-slate-900 leading-none tracking-tighter tabular-nums">${subtotal.toFixed(2)}</p>
              </div>
            </CollapsibleTrigger>
            
            <Link href="/checkout" passHref className="flex-grow">
              <Button className="w-full h-14 bg-[#E54360] hover:bg-[#D43D56] text-white shadow-xl rounded-[1.25rem] font-bold uppercase tracking-tight text-lg flex items-center justify-center gap-3 transition-all active:scale-95 group">
                <span>Checkout</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Collapsible>
      </div>
    </>
  );
}
