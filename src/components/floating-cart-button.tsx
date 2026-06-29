
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBasket, ArrowRight, ChevronUp, ChevronDown, ShoppingBag, MessageSquareText, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { QuantitySelector } from './quantity-selector';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function FloatingCartButton() {
  const { 
    cartItems, 
    totalItems, 
    subtotal, 
    updateQuantity, 
    getDisplayPrice, 
    updateItemInstructions, 
    orderInstructions, 
    setOrderInstructions 
  } = useCart();
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
      {/* Dark Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] animate-in fade-in duration-300 backdrop-blur-[2px]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-[70] transition-all duration-500 ease-in-out",
        isOpen ? "bottom-4" : "bottom-6"
      )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="p-0 overflow-hidden mb-3">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[70vh] animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 border-b bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 tracking-tight uppercase">Order Details</h3>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
                    <ul className="space-y-3">
                        {cartItems.map(item => {
                            const displayPrice = getDisplayPrice(item);
                            const variationString = getVariationString(item);
                            return (
                                <li key={item.cartItemId} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-grow">
                                            <span className="font-bold text-base text-slate-900 block leading-tight tracking-tight">
                                              {item.name}
                                            </span>
                                            {variationString && (
                                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                {variationString}
                                              </p>
                                            )}
                                        </div>
                                        <span className="font-bold text-base text-slate-900 tabular-nums">
                                          ${(displayPrice * item.quantity).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1">
                                        <MessageSquareText className="h-3 w-3" />
                                        <span>Prep Note</span>
                                      </div>
                                      <Input 
                                        placeholder="Specific prep info..." 
                                        className="h-8 text-[11px] bg-slate-50/50 border-slate-100 rounded-lg focus-visible:ring-primary/20"
                                        value={item.specialInstructions || ''}
                                        onChange={(e) => updateItemInstructions(item.cartItemId, e.target.value)}
                                      />
                                    </div>
                                    
                                    <div className="bg-slate-50/50 rounded-xl">
                                        <QuantitySelector
                                          quantity={item.quantity}
                                          onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                          onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                          className="bg-transparent border-none h-10 px-2"
                                        />
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="pt-2 space-y-3">
                      <div className="flex items-center gap-2.5 px-1">
                        <MessageSquareText className="h-4 w-4 text-slate-400" />
                        <h4 className="font-bold text-[11px] text-slate-500 uppercase tracking-widest">General Kitchen Note</h4>
                      </div>
                      <Textarea 
                        placeholder="Overall notes for this order ticket..." 
                        className="min-h-[70px] bg-slate-50/50 border-slate-100 rounded-xl text-xs focus-visible:ring-primary/20 resize-none p-3"
                        value={orderInstructions}
                        onChange={(e) => setOrderInstructions(e.target.value)}
                      />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Running Subtotal</span>
                    <span className="text-xl font-bold text-slate-900 tracking-tighter tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
              </div>
          </CollapsibleContent>

          {/* Floating Pill Design */}
          <div className="bg-slate-900 text-white rounded-full p-1.5 shadow-2xl flex items-center gap-1.5 border border-white/10 backdrop-blur-md">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-3 pl-4 pr-3 py-2 outline-none group hover:bg-white/5 rounded-full transition-colors">
                <div className="relative" id="floating-cart-target">
                  <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <ShoppingBasket className="h-5 w-5" />
                  </div>
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 font-bold text-[10px] rounded-full bg-[#E54360] text-white border-2 border-slate-900 shadow-md">
                    {totalItems}
                  </Badge>
                </div>
                <div className="flex flex-col text-left">
                  <p className="font-bold text-lg leading-none tracking-tighter tabular-nums">${subtotal.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className='text-[8px] text-white/50 font-bold uppercase tracking-widest'>Review</span>
                    {isOpen ? <ChevronDown className="h-2 w-2 text-white/50" /> : <ChevronUp className="h-2 w-2 text-white/50" />}
                  </div>
                </div>
              </button>
            </CollapsibleTrigger>
            
            <div className="h-10 w-px bg-white/10 mx-1" />

            <Link href="/checkout" passHref className="flex-grow">
              <Button className="w-full h-12 bg-[#E54360] hover:bg-[#D43D56] text-white shadow-lg rounded-full font-bold uppercase tracking-tight text-sm flex items-center justify-center gap-2 transition-all active:scale-95 group border-none">
                <span>Place Order</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Collapsible>
      </div>
    </>
  );
}
