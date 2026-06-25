
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
      {/* Dark Backdrop Overlay - High z-index to cover header/stepper */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] animate-in fade-in duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t-2 border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out z-[70]",
        isOpen ? "rounded-t-[2.5rem]" : ""
      )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="p-0 overflow-hidden">
              <div className="bg-slate-50/50 p-6 space-y-6 max-h-[65vh] overflow-y-auto pt-8">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h3 className="font-black text-xl text-slate-900 tracking-tighter uppercase">Your Selection</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-transparent" 
                    onClick={() => setIsOpen(false)}
                  >
                      Hide Details
                  </Button>
                </div>

                <ul className="space-y-3">
                    {cartItems.map(item => {
                        const displayPrice = getDisplayPrice(item);
                        const variationString = getVariationString(item);
                        return (
                            <li key={item.cartItemId} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
                                        {variationString && (
                                          <span className="inline-block bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1">
                                            {variationString}
                                          </span>
                                        )}
                                        <span className="text-xs text-slate-400 font-bold block mt-2 tracking-wide uppercase">${displayPrice.toFixed(2)} EACH</span>
                                    </div>
                                    <span className="font-black font-mono text-lg text-slate-900">${(displayPrice * item.quantity).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-4 border-t pt-3 border-slate-50">
                                    <QuantitySelector
                                      quantity={item.quantity}
                                      onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                      onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                      className="bg-slate-50 border-none h-10 px-2"
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>
              </div>
          </CollapsibleContent>

          <div className="flex items-center justify-between p-5 gap-4 bg-white relative">
            {/* Handle Bar for Expansion */}
            <CollapsibleTrigger asChild>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-slate-200 rounded-full cursor-pointer hover:bg-slate-300 transition-colors flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-300 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-slate-300 mx-0.5" />
                    <div className="w-1 h-1 rounded-full bg-slate-300 mx-0.5" />
                </div>
            </CollapsibleTrigger>

            <CollapsibleTrigger className="flex items-center gap-4 text-left outline-none group">
              <div className="relative">
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ShoppingBasket className="h-7 w-7 text-primary" />
                </div>
                <Badge className="absolute -top-1 -right-1 h-6 min-w-6 flex items-center justify-center p-0 font-black text-[11px] rounded-lg bg-primary text-white border-2 border-white shadow-sm">
                  {totalItems}
                </Badge>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                    <span className='text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]'>TOTAL</span>
                    {isOpen ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronUp className="h-3 w-3 text-slate-400" />}
                </div>
                <p className="font-black text-2xl text-slate-900 leading-none tracking-tighter">${subtotal.toFixed(2)}</p>
              </div>
            </CollapsibleTrigger>
            
            <Link href="/checkout" passHref className="flex-grow">
              <Button className="w-full h-14 bg-[#E54360] hover:bg-[#E54360]/90 text-white shadow-lg rounded-[1.25rem] font-black uppercase tracking-tighter text-lg flex items-center justify-center gap-3 transition-all active:scale-95 group">
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
