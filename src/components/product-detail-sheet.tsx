
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
import { 
  Minus, 
  Plus, 
  X, 
  Info, 
  MessageSquareText, 
  Check, 
  AlertCircle, 
  Flame, 
  Zap, 
  Dna, 
  Wheat,
  Circle,
  ShieldAlert,
  Beef
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem, CartItemVariationSelection } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

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
      <SheetContent side="bottom" className="h-[95dvh] flex flex-col p-0 rounded-t-[2.5rem] border-t-0 shadow-2xl z-[110] bg-white" hideCloseButton>
        <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
        
        <SheetHeader className="p-6 border-b flex-row items-center justify-between bg-white shrink-0">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
                <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{item.name}</SheetTitle>
            </div>
            <p className="text-[10px] font-black text-[#0051B5] uppercase tracking-[0.2em]">Terminal Order Preparation</p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-slate-50 border-2 border-slate-100">
              <X className="h-6 w-6 text-slate-500" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6 space-y-12 no-scrollbar pb-40">
          {/* HIGH IMPACT ALLERGEN ALERT */}
          {item.allergens && item.allergens.length > 0 && (
            <section className="bg-red-50/50 border-2 border-red-100 rounded-3xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                        <ShieldAlert className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-red-700 uppercase tracking-tight">Allergen Warning</h3>
                        <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest">Crucial Dietary Audit Required</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, idx) => (
                        <Badge key={idx} className="bg-white text-red-600 border-red-200 font-black text-xs uppercase px-4 py-1.5 rounded-xl shadow-sm">
                            {allergen}
                        </Badge>
                    ))}
                </div>
            </section>
          )}

          {/* PREMIUM NUTRITIONAL DASHBOARD */}
          {item.nutrition && (
            <section className="space-y-4">
               <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Flame className="h-4 w-4 text-orange-500" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Nutritional Dashboard</h3>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200 text-slate-400">Standard Audit</Badge>
               </div>
               
               <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white border-2 border-slate-50 rounded-[1.5rem] p-4 text-center space-y-1 shadow-sm group hover:border-orange-100 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Energy</p>
                    <p className="text-lg font-black text-slate-900 leading-none tabular-nums group-hover:text-orange-600">{item.nutrition.kcal}</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">kcal</p>
                  </div>
                  <div className="bg-white border-2 border-slate-50 rounded-[1.5rem] p-4 text-center space-y-1 shadow-sm group hover:border-blue-100 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protein</p>
                    <p className="text-lg font-black text-slate-900 leading-none tabular-nums group-hover:text-blue-600">{item.nutrition.protein}g</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Build</p>
                  </div>
                  <div className="bg-white border-2 border-slate-50 rounded-[1.5rem] p-4 text-center space-y-1 shadow-sm group hover:border-green-100 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Carbs</p>
                    <p className="text-lg font-black text-slate-900 leading-none tabular-nums group-hover:text-green-600">{item.nutrition.carbs}g</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Energy</p>
                  </div>
                  <div className="bg-white border-2 border-slate-50 rounded-[1.5rem] p-4 text-center space-y-1 shadow-sm group hover:border-yellow-100 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fat</p>
                    <p className="text-lg font-black text-slate-900 leading-none tabular-nums group-hover:text-yellow-600">{item.nutrition.fat}g</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Fuel</p>
                  </div>
               </div>
            </section>
          )}

          {/* ITEM BIO CARD */}
          <section className="space-y-4">
             <div className="flex items-center gap-2.5 px-1">
                <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center">
                    <Info className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Kitchen Bio</h3>
             </div>
             <div className="bg-slate-50/50 border-2 border-slate-50 rounded-3xl p-5">
               <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                  "{item.description || "Freshly prepared house specialty using premium seasonal ingredients, expertly cooked to order by our kitchen team."}"
               </p>
             </div>
          </section>

          {/* CONFIGURATION SECTIONS */}
          {item.variations?.map((variation) => {
             const isIncremental = variation.type === 'incremental';
             const isMultiple = variation.type === 'multiple';
             const isSingle = variation.type === 'required' || variation.type === 'optional';
             const selectedValue = selectedVariations[variation.id] || '';
             const selectedIds = selectedValue.split(',').map(v => v.split(':')[0]);

             return (
                <section 
                  key={variation.id} 
                  ref={el => variationRefs.current[variation.id] = el}
                  className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Zap className="h-4 w-4 text-[#0051B5]" />
                        </div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                            {variation.name}
                        </h3>
                    </div>
                    <span className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase border-2",
                        variation.type === 'required' ? "text-red-600 bg-red-50 border-red-100" : "text-slate-400 bg-slate-50 border-slate-100"
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
                            "flex items-center justify-between p-5 rounded-[1.75rem] border-2 transition-all cursor-pointer",
                            (isActive || qty > 0) ? "border-[#0051B5] bg-[#0051B5]/5 shadow-md shadow-[#0051B5]/5" : "border-slate-50 bg-white"
                        )}>
                            <div className="flex items-center gap-5">
                                {isMultiple ? (
                                    <Checkbox checked={isActive} className="h-6 w-6 rounded-lg border-2 border-slate-200 data-[state=checked]:border-[#0051B5] data-[state=checked]:bg-[#0051B5]" />
                                ) : isSingle ? (
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
                                        {isActive && <div className="h-3 w-3 rounded-full bg-[#0051B5]" />}
                                    </div>
                                ) : null}

                                <div className="flex flex-col">
                                    <span className="font-black text-base leading-tight text-slate-900 uppercase tracking-tight">{option.name}</span>
                                    <span className={cn(
                                        "text-[10px] font-bold opacity-60 uppercase mt-0.5",
                                        option.priceModifier > 0 ? "text-green-600" : ""
                                    )}>
                                        {option.priceModifier !== 0 ? `+$${option.priceModifier.toFixed(2)} unit` : "Included in Base"}
                                    </span>
                                </div>
                            </div>

                            {isIncremental && (
                                <div className="flex items-center gap-4 bg-white p-1 rounded-2xl border-2 border-slate-100 shadow-inner" onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500" 
                                        onClick={() => handleIncrementalChange(variation.id, option.id, -1)}
                                        disabled={qty <= 0}
                                    >
                                        <Minus className="h-5 w-5 stroke-[4]" />
                                    </Button>
                                    <span className="w-6 text-center font-black text-xl text-slate-900 tabular-nums">{qty}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 rounded-xl text-[#0051B5] hover:bg-[#0051B5]/5" 
                                        onClick={() => handleIncrementalChange(variation.id, option.id, 1)}
                                    >
                                        <Plus className="h-5 w-5 stroke-[4]" />
                                    </Button>
                                </div>
                            )}
                        </div>
                      )
                    })}
                  </div>
                </section>
             )
          })}

          <section className="space-y-4 pb-12">
            <div className="flex items-center gap-2.5 text-slate-400 px-1">
                <div className="h-8 w-8 bg-slate-50 rounded-xl flex items-center justify-center">
                    <MessageSquareText className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">Kitchen Prep Note</h3>
            </div>
            <Textarea 
                placeholder="Ex: No onions, extra hot, medium-well sauce on side..."
                className="min-h-[120px] bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-5 text-sm font-medium focus-visible:ring-[#0051B5]/20 resize-none shadow-inner placeholder:text-slate-300"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </section>
        </div>

        <SheetFooter className="p-6 border-t bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)] shrink-0 z-20">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Volume</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight uppercase">Base Quantity</p>
                </div>
                <div className="flex items-center gap-8 bg-slate-50 p-2 rounded-2xl border-2 border-slate-100 shadow-inner">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-xl bg-white shadow-md border-2 border-slate-100 active:scale-90" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-6 w-6 stroke-[4] text-slate-400" />
                    </Button>
                    <span className="w-8 text-center font-black text-3xl tabular-nums text-slate-900 tracking-tighter">{quantity}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-xl bg-white shadow-md border-2 border-[#0051B5]/20 text-[#0051B5] active:scale-90" 
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        <Plus className="h-6 w-6 stroke-[4]" />
                    </Button>
                </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!areAllRequiredSelected}
              className={cn(
                "w-full h-20 text-white text-xl font-black rounded-[2rem] shadow-2xl uppercase tracking-tight flex items-center justify-center gap-4 transition-all duration-500",
                areAllRequiredSelected ? "bg-[#E54360] hover:bg-[#D43D56] active:scale-[0.98] shadow-[#E54360]/20" : "bg-slate-100 text-slate-300 border-2 border-slate-50 shadow-none"
              )}
            >
              {areAllRequiredSelected ? (
                <>
                  <span>Commit to Ticket</span>
                  <div className="h-10 w-px bg-white/20 mx-1" />
                  <span className="bg-white/10 px-5 py-2 rounded-2xl text-xl font-black tracking-tighter tabular-nums">${finalPrice.toFixed(2)}</span>
                </>
              ) : (
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6" />
                    <span>Awaiting Selection</span>
                </div>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

