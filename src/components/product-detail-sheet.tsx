
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
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import type { MenuItem, CartItemVariationSelection } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

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
      <SheetContent side="bottom" className="h-[95dvh] flex flex-col p-0 rounded-t-[2.5rem] border-t-0 shadow-2xl z-[110] bg-slate-50" hideCloseButton>
        <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
        
        <SheetHeader className="p-6 border-b flex-row items-center justify-between bg-white shrink-0">
          <div className="text-left">
            <SheetTitle className="text-2xl font-bold text-slate-900 leading-tight uppercase">{item.name}</SheetTitle>
            <p className="text-xs font-semibold text-primary uppercase">Order Preparation Details</p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100">
              <X className="h-6 w-6 text-slate-500" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar pb-40">
          {/* ALLERGEN ALERT */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                        <ShieldAlert className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-red-700 uppercase">Allergen Warning</h3>
                        <p className="text-xs font-medium text-red-500">Dietary Audit Required</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, idx) => (
                        <Badge key={idx} className="bg-white text-red-600 border-red-200 font-bold text-xs uppercase px-3 py-1 rounded-lg">
                            {allergen}
                        </Badge>
                    ))}
                </div>
            </div>
          )}

          {/* NUTRITIONAL DASHBOARD */}
          {item.nutrition && (
            <div className="space-y-3">
               <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <h3 className="text-xs font-bold uppercase text-slate-500">Nutritional Facts</h3>
                    </div>
               </div>
               
               <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Energy', val: item.nutrition.kcal, unit: 'kcal', icon: Flame, color: 'text-orange-600' },
                    { label: 'Protein', val: item.nutrition.protein, unit: 'g', icon: Zap, color: 'text-blue-600' },
                    { label: 'Carbs', val: item.nutrition.carbs, unit: 'g', icon: Info, color: 'text-green-600' },
                    { label: 'Fat', val: item.nutrition.fat, unit: 'g', icon: AlertTriangle, color: 'text-yellow-600' }
                  ].map((macro, i) => (
                    <Card key={i} className="rounded-2xl p-3 text-center space-y-0.5 border-none shadow-sm bg-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{macro.label}</p>
                        <p className={cn("text-lg font-bold leading-none tabular-nums", macro.color)}>{macro.val}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase">{macro.unit}</p>
                    </Card>
                  ))}
               </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <Card className="rounded-2xl p-5 border-none shadow-sm bg-white">
             <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase text-slate-500">Item Bio</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                "{item.description || "Freshly prepared house specialty using premium seasonal ingredients."}"
             </p>
          </Card>

          {/* CONFIGURATION SECTIONS */}
          {item.variations?.map((variation) => {
             const isIncremental = variation.type === 'incremental';
             const isMultiple = variation.type === 'multiple';
             const isSingle = variation.type === 'required' || variation.type === 'optional';
             const selectedValue = selectedVariations[variation.id] || '';
             const selectedIds = selectedValue.split(',').map(v => v.split(':')[0]);

             return (
                <div 
                  key={variation.id} 
                  ref={el => variationRefs.current[variation.id] = el}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase">
                            {variation.name}
                        </h3>
                    </div>
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase border",
                        variation.type === 'required' ? "text-red-600 bg-red-50 border-red-100" : "text-slate-500 bg-slate-100 border-slate-200"
                    )}>
                        {variation.type === 'required' ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {variation.options.map(option => {
                      const isActive = selectedIds.includes(option.id);
                      const qty = isIncremental ? getIncrementalQty(variation.id, option.id) : 0;
                      
                      return (
                        <Card 
                            key={option.id} 
                            onClick={() => !isIncremental && handleVariationSelect(variation.id, option.id, variation.type)}
                            className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer shadow-sm",
                            (isActive || qty > 0) ? "border-primary bg-primary/[0.03]" : "border-transparent bg-white"
                        )}>
                            <div className="flex items-center gap-4">
                                {isMultiple ? (
                                    <Checkbox checked={isActive} className="h-5 w-5 rounded-md border-2 border-slate-200 data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                                ) : isSingle ? (
                                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                                        {isActive && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                    </div>
                                ) : null}

                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-slate-800 uppercase leading-none">{option.name}</span>
                                    <span className={cn(
                                        "text-[10px] font-semibold uppercase mt-1",
                                        option.priceModifier > 0 ? "text-green-600" : "text-slate-400"
                                    )}>
                                        {option.priceModifier !== 0 ? `+$${option.priceModifier.toFixed(2)}` : "Included"}
                                    </span>
                                </div>
                            </div>

                            {isIncremental && (
                                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500" 
                                        onClick={() => handleIncrementalChange(variation.id, option.id, -1)}
                                        disabled={qty <= 0}
                                    >
                                        <Minus className="h-4 w-4 stroke-[3]" />
                                    </Button>
                                    <span className="w-4 text-center font-bold text-sm text-slate-900 tabular-nums">{qty}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-lg text-primary" 
                                        onClick={() => handleIncrementalChange(variation.id, option.id, 1)}
                                    >
                                        <Plus className="h-4 w-4 stroke-[3]" />
                                    </Button>
                                </div>
                            )}
                        </Card>
                      )
                    })}
                  </div>
                </div>
             )
          })}

          {/* KITCHEN NOTE */}
          <div className="space-y-2 pb-10">
            <div className="flex items-center gap-2 px-1">
                <MessageSquareText className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase text-slate-500">Preparation Note</h3>
            </div>
            <Textarea 
                placeholder="E.g., Extra spicy, medium-well, sauce on side..."
                className="min-h-[100px] bg-white border-none rounded-2xl p-4 text-sm font-medium shadow-sm focus-visible:ring-primary/20 resize-none placeholder:text-slate-300"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="p-6 border-t bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.08)] shrink-0 z-20">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity</p>
                    <p className="text-lg font-bold text-slate-900 uppercase">Base Units</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-200 active:scale-90" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-5 w-5 stroke-[3] text-slate-400" />
                    </Button>
                    <span className="w-6 text-center font-bold text-2xl tabular-nums text-slate-900">{quantity}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl bg-white shadow-sm border border-primary/20 text-primary active:scale-90" 
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        <Plus className="h-5 w-5 stroke-[3]" />
                    </Button>
                </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!areAllRequiredSelected}
              className={cn(
                "w-full h-16 text-white text-lg font-bold rounded-2xl shadow-xl uppercase transition-all duration-300",
                areAllRequiredSelected ? "bg-primary hover:bg-primary/90 shadow-primary/20" : "bg-slate-200 text-slate-400 shadow-none pointer-events-none"
              )}
            >
              {areAllRequiredSelected ? (
                <div className="flex items-center justify-center gap-4">
                  <span>Add to Cart</span>
                  <div className="h-6 w-px bg-white/20" />
                  <span className="tabular-nums">${finalPrice.toFixed(2)}</span>
                </div>
              ) : (
                "Select Required Options"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
