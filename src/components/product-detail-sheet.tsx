
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, Info, Flame, Scale, Wheat, Beef, MessageSquareText, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem, CartItemVariationSelection } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';

interface ProductDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: MenuItem;
}

export function ProductDetailSheet({ isOpen, onOpenChange, item }: ProductDetailSheetProps) {
  const { addToCart } = useCart();
  const [selectedVariations, setSelectedVariations] = useState<CartItemVariationSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const variationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (isOpen) {
      setSelectedVariations({});
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [isOpen]);

  const handleVariationSelect = (variationId: string, optionId: string, type: 'required' | 'optional' | 'multiple' | 'incremental') => {
    setSelectedVariations(prev => {
      const newSelections = { ...prev };
      const currentVal = prev[variationId] || '';
      
      if (type === 'multiple') {
        const parts = currentVal ? currentVal.split(',') : [];
        if (parts.includes(optionId)) {
          const filtered = parts.filter(p => p !== optionId);
          if (filtered.length > 0) newSelections[variationId] = filtered.join(',');
          else delete newSelections[variationId];
        } else {
          newSelections[variationId] = [...parts, optionId].join(',');
        }
      } else {
        if (type === 'optional' && currentVal === optionId) {
          delete newSelections[variationId];
        } else {
          newSelections[variationId] = optionId;
          
          if (type === 'required') {
             setTimeout(() => {
                const currentIndex = item.variations?.findIndex(v => v.id === variationId) ?? -1;
                const nextVariation = item.variations?.[currentIndex + 1];
                if (nextVariation && variationRefs.current[nextVariation.id]) {
                    variationRefs.current[nextVariation.id]?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
             }, 150);
          }
        }
      }
      return newSelections;
    });
  };

  const handleIncrementalChange = (variationId: string, optionId: string, delta: number) => {
    setSelectedVariations(prev => {
        const newSelections = { ...prev };
        const currentVal = prev[variationId] || '';
        const parts = currentVal ? currentVal.split(',') : [];
        
        const partIndex = parts.findIndex(p => p.startsWith(`${optionId}:`));
        let newQty = 0;
        
        if (partIndex !== -1) {
            const [, qtyStr] = parts[partIndex].split(':');
            newQty = Math.max(0, parseInt(qtyStr, 10) + delta);
            if (newQty > 0) {
                parts[partIndex] = `${optionId}:${newQty}`;
            } else {
                parts.splice(partIndex, 1);
            }
        } else if (delta > 0) {
            newQty = delta;
            parts.push(`${optionId}:${newQty}`);
        }

        if (parts.length > 0) {
            newSelections[variationId] = parts.join(',');
        } else {
            delete newSelections[variationId];
        }
        
        return newSelections;
    });
  };

  const getIncrementalQty = (variationId: string, optionId: string) => {
    const val = selectedVariations[variationId] || '';
    const parts = val.split(',');
    const part = parts.find(p => p.startsWith(`${optionId}:`));
    if (!part) return 0;
    const [, qtyStr] = part.split(':');
    return parseInt(qtyStr, 10);
  };

  const areAllRequiredSelected = useMemo(() => {
    return item.variations?.every(v => {
      if (v.type === 'required') {
        return !!selectedVariations[v.id];
      }
      return true;
    }) ?? true;
  }, [item.variations, selectedVariations]);

  const finalPrice = useMemo(() => {
    let price = item.price;
    item.variations?.forEach(variation => {
      const selectionValue = selectedVariations[variation.id];
      if (selectionValue) {
        const parts = selectionValue.split(',');
        parts.forEach(part => {
            const [optionId, qtyStr] = part.split(':');
            const qty = qtyStr ? parseInt(qtyStr, 10) : 1;
            const option = variation.options.find(o => o.id === optionId);
            if (option) price += (option.priceModifier * qty);
        });
      }
    });
    return price * quantity;
  }, [item, selectedVariations, quantity]);

  const handleAddToCart = () => {
    if (!areAllRequiredSelected) return;
    addToCart(item, selectedVariations, quantity);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95dvh] flex flex-col p-0 rounded-t-[2.5rem] border-t-0 shadow-2xl z-[110]" hideCloseButton>
        <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
        
        <SheetHeader className="p-6 border-b flex-row items-center justify-between bg-white shrink-0">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
                <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{item.name}</SheetTitle>
            </div>
            <p className="text-sm font-bold text-primary uppercase tracking-tight">Terminal Order Setup</p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-slate-50">
              <X className="h-6 w-6 text-slate-500" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
          {/* Item Bio */}
          <section className="space-y-3">
             <div className="flex items-center gap-2 text-slate-400">
                <Info className="h-4 w-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Kitchen Bio</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                {item.description || "Freshly prepared house specialty using premium seasonal ingredients."}
             </p>
          </section>

          {/* Configuration Sections */}
          {item.variations?.map((variation) => {
             const isIncremental = variation.type === 'incremental';
             const isMultiple = variation.type === 'multiple';
             const selectedValue = selectedVariations[variation.id] || '';
             const selectedIds = selectedValue.split(',').map(v => v.split(':')[0]);

             return (
                <section 
                  key={variation.id} 
                  ref={el => variationRefs.current[variation.id] = el}
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      {variation.name}
                      {(isMultiple || isIncremental) && <span className="text-[9px] font-bold text-slate-400 normal-case">(Add multiples)</span>}
                    </h3>
                    <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-md uppercase border",
                        variation.type === 'required' ? "text-red-600 bg-red-50 border-red-100" : "text-slate-400 border-slate-200"
                    )}>
                        {variation.type === 'required' ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {variation.options.map(option => {
                      const isActive = selectedIds.includes(option.id);
                      const qty = isIncremental ? getIncrementalQty(variation.id, option.id) : 0;
                      
                      return (
                        <div 
                            key={option.id} 
                            onClick={() => !isIncremental && handleVariationSelect(variation.id, option.id, variation.type)}
                            className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                            (isActive || qty > 0) ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 bg-white"
                        )}>
                            <div className="flex flex-col">
                                <span className="font-black text-sm leading-tight text-slate-900 uppercase">{option.name}</span>
                                <span className={cn(
                                    "text-[10px] font-bold opacity-60 uppercase",
                                    option.priceModifier > 0 ? "text-green-600" : ""
                                )}>
                                    {option.priceModifier !== 0 ? `+$${option.priceModifier.toFixed(2)} unit` : "Included"}
                                </span>
                            </div>

                            {isIncremental ? (
                                <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500" 
                                        onClick={() => handleIncrementalChange(variation.id, option.id, -1)}
                                        disabled={qty <= 0}
                                    >
                                        <Minus className="h-5 w-5 stroke-[3]" />
                                    </Button>
                                    <span className="w-6 text-center font-black text-xl text-slate-900 tabular-nums">{qty}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-lg text-primary hover:bg-primary/5" 
                                        onClick={() => handleIncrementalChange(variation.id, option.id, 1)}
                                    >
                                        <Plus className="h-5 w-5 stroke-[3]" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-10 w-10 flex items-center justify-center">
                                    {isActive ? (
                                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                                            <Check className="h-5 w-5 stroke-[4]" />
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full border-2 border-slate-200" />
                                    )}
                                </div>
                            )}
                        </div>
                      )
                    })}
                  </div>
                </section>
             )
          })}

          <section className="space-y-3 pb-8">
            <div className="flex items-center gap-2 text-slate-500 px-1">
                <MessageSquareText className="h-4 w-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Kitchen Prep Request</h3>
            </div>
            <Textarea 
                placeholder="Ex: No onions, well done, extra hot..."
                className="min-h-[100px] bg-slate-50 border-slate-200 rounded-[1.5rem] p-4 text-sm font-medium focus-visible:ring-primary/20 resize-none shadow-inner"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </section>
        </div>

        <SheetFooter className="p-6 border-t bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.08)] shrink-0">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Volume</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight uppercase">Base Quantity</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200 active:scale-90" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-6 w-6 stroke-[3]" />
                    </Button>
                    <span className="w-8 text-center font-black text-2xl tabular-nums text-slate-900">{quantity}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-xl bg-white shadow-sm border border-primary/20 text-primary active:scale-90" 
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        <Plus className="h-6 w-6 stroke-[3]" />
                    </Button>
                </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!areAllRequiredSelected}
              className={cn(
                "w-full h-20 text-white text-xl font-black rounded-[1.75rem] shadow-xl uppercase tracking-tight flex items-center justify-center gap-4 transition-all duration-300",
                areAllRequiredSelected ? "bg-[#E54360] hover:bg-[#D43D56] active:scale-[0.98]" : "bg-slate-200"
              )}
            >
              {areAllRequiredSelected ? (
                <>
                  <span>Commit to Order</span>
                  <div className="h-10 w-px bg-white/20 mx-1" />
                  <span className="bg-white/10 px-4 py-1.5 rounded-xl text-lg font-black tracking-tighter tabular-nums">${finalPrice.toFixed(2)}</span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Incomplete Prep</span>
                </div>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
