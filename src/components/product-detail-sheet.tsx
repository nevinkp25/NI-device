
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
import { Minus, Plus, X, Info, Flame, Scale, Wheat, Beef, MessageSquareText, Check } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { MenuItem, CartItemVariationSelection } from '@/lib/data';

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

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      const defaultSelections: CartItemVariationSelection = {};
      // Set defaults for required variations if they only have one option or we want a pre-select
      item.variations?.forEach(variation => {
        if (variation.type === 'required' && variation.options.length > 0) {
           // We could optionally pre-select the first one, but better to let waiter choose
           // defaultSelections[variation.id] = variation.options[0].id;
        }
      });
      setSelectedVariations(defaultSelections);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [isOpen, item.variations]);

  const handleVariationSelect = (variationId: string, optionId: string, type: 'required' | 'optional' | 'multiple') => {
    setSelectedVariations(prev => {
      const newSelections = { ...prev };
      
      if (type === 'multiple') {
        const currentVals = prev[variationId] ? prev[variationId].split(',') : [];
        if (currentVals.includes(optionId)) {
          const filtered = currentVals.filter(v => v !== optionId);
          if (filtered.length > 0) newSelections[variationId] = filtered.join(',');
          else delete newSelections[variationId];
        } else {
          newSelections[variationId] = [...currentVals, optionId].join(',');
        }
      } else {
        // Toggle for optional single-select, or just set for required
        if (type === 'optional' && prev[variationId] === optionId) {
          delete newSelections[variationId];
        } else {
          newSelections[variationId] = optionId;
          
          // Auto-scroll logic: If it's a required field and we just selected it, 
          // find the next required variation that isn't filled and scroll to it.
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
             }, 100);
          }
        }
      }
      return newSelections;
    });
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
      const selectedId = selectedVariations[variation.id];
      if (selectedId) {
        const selectedIds = selectedId.split(',');
        selectedIds.forEach(id => {
          const option = variation.options.find(o => o.id === id);
          if (option) price += option.priceModifier;
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
        
        <SheetHeader className="p-6 border-b flex-row items-center justify-between">
          <div className="text-left">
            <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight uppercase">{item.name}</SheetTitle>
            <p className="text-sm font-bold text-primary uppercase tracking-tight mt-1">Starting from ${item.price.toFixed(2)}</p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-slate-100">
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6 space-y-10 no-scrollbar pb-24">
          {/* Description Section */}
          <section className="space-y-3">
             <div className="flex items-center gap-2 text-slate-400">
                <Info className="h-4 w-4" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">About this Dish</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                {item.description || "Freshly prepared house specialty using premium seasonal ingredients."}
             </p>
          </section>

          {/* Variations Sections */}
          {item.variations?.map((variation) => {
             const isMultiple = variation.type === 'multiple';
             const selectedIds = selectedVariations[variation.id]?.split(',') || [];

             return (
                <section 
                  key={variation.id} 
                  ref={el => variationRefs.current[variation.id] = el}
                  className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      {variation.name}
                      {isMultiple && <span className="text-[9px] font-bold text-slate-400 normal-case">(Select multiple)</span>}
                    </h3>
                    {variation.type === 'required' ? (
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md uppercase">
                        Optional
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {variation.options.map(option => {
                      const isActive = selectedIds.includes(option.id);
                      return (
                        <Button
                          key={option.id}
                          variant="outline"
                          onClick={() => handleVariationSelect(variation.id, option.id, variation.type)}
                          className={cn(
                            "h-20 flex-col rounded-2xl border-2 transition-all p-3 text-left items-start gap-1",
                            isActive 
                              ? "border-primary bg-primary/5 text-primary shadow-sm" 
                              : "border-slate-100 bg-white text-slate-900 hover:border-slate-300"
                          )}
                        >
                          <div className="flex justify-between w-full items-start">
                             <span className="font-bold text-sm leading-tight">{option.name}</span>
                             {isActive && <Check className="h-4 w-4 shrink-0 mt-0.5" />}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold opacity-60",
                            option.priceModifier > 0 ? "text-green-600" : ""
                          )}>
                            {option.priceModifier !== 0 
                              ? `${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier.toFixed(2)}` 
                              : "Standard"
                            }
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </section>
             )
          })}

          {/* Nutritional Facts Grid */}
          {item.nutrition && (
            <section className="bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Scale className="h-4 w-4" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Nutritional Info</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                 {[
                   { label: 'KCAL', val: item.nutrition.kcal, icon: Flame, color: 'text-orange-500' },
                   { label: 'PROT', val: `${item.nutrition.protein}g`, icon: Beef, color: 'text-red-500' },
                   { label: 'CARB', val: `${item.nutrition.carbs}g`, icon: Wheat, color: 'text-amber-600' },
                   { label: 'FAT', val: `${item.nutrition.fat}g`, icon: Scale, color: 'text-blue-500' }
                 ].map((stat, i) => (
                   <div key={i} className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <span className={cn("text-[10px] font-bold tracking-tighter mb-1 opacity-60")}>{stat.label}</span>
                      <span className="text-sm font-black text-slate-900">{stat.val}</span>
                   </div>
                 ))}
              </div>
            </section>
          )}

          {/* Allergen Information */}
          {item.allergens && item.allergens.length > 0 && (
            <section className="space-y-3 px-1">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  Allergen Warnings
               </h3>
               <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen, i) => (
                    <span key={i} className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100 uppercase tracking-tight">
                        {allergen}
                    </span>
                  ))}
               </div>
            </section>
          )}

          {/* Special Kitchen Request */}
          <section className="space-y-3 pb-8">
            <div className="flex items-center gap-2 text-slate-500 px-1">
                <MessageSquareText className="h-4 w-4" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Kitchen Prep Request</h3>
            </div>
            <Textarea 
                placeholder="Ex: No onions, well done, extra hot..."
                className="min-h-[100px] bg-slate-50 border-slate-200 rounded-[1.5rem] p-4 text-sm font-medium focus-visible:ring-primary/20 resize-none"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </section>
        </div>

        <SheetFooter className="p-6 border-t bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Covers</p>
                    <p className="text-lg font-bold text-slate-900 tracking-tight">Quantity</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-6 w-6 stroke-[3]" />
                    </Button>
                    <span className="w-8 text-center font-black text-2xl tabular-nums tracking-tighter text-slate-900">{quantity}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-xl bg-white shadow-sm border border-primary/20 text-primary" 
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
                "w-full h-20 text-white text-xl font-bold rounded-[1.75rem] shadow-xl transition-all active:scale-[0.98] uppercase tracking-tight flex items-center justify-center gap-4 border-none",
                areAllRequiredSelected ? "bg-[#E54360] hover:bg-[#D43D56]" : "bg-slate-300"
              )}
            >
              {areAllRequiredSelected ? (
                <>
                  <span>Add to Order</span>
                  <div className="h-10 w-px bg-white/20 mx-1" />
                  <span className="bg-white/10 px-4 py-1.5 rounded-xl text-lg font-bold tracking-tight">${finalPrice.toFixed(2)}</span>
                </>
              ) : (
                <span>Complete Selections</span>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
