
"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X, Info, Flame, Scale, Wheat, Beef, MessageSquareText } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { MenuItem, CartItemVariationSelection, ItemVariation } from '@/lib/data';

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

  // Set default selections for required variations when the sheet opens
  useEffect(() => {
    if (isOpen) {
      const defaultSelections: CartItemVariationSelection = {};
      item.variations?.forEach(variation => {
        if (variation.type === 'required') {
          defaultSelections[variation.id] = variation.options[0].id;
        }
      });
      setSelectedVariations(defaultSelections);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [isOpen, item.variations]);

  const handleVariationSelect = (variationId: string, optionId: string, type: 'required' | 'optional') => {
    setSelectedVariations(prev => {
      const newSelections = { ...prev };
      if (type === 'optional' && newSelections[variationId] === optionId) {
        delete newSelections[variationId];
      } else {
        newSelections[variationId] = optionId;
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
        const option = variation.options.find(o => o.id === selectedId);
        if (option) price += option.priceModifier;
      }
    });
    return price * quantity;
  }, [item, selectedVariations, quantity]);

  const handleAddToCart = () => {
    if (!areAllRequiredSelected) return;
    // We'll update the addToCart to support instructions in a real app, 
    // for now we'll just pass it as is
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
            <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">${item.price.toFixed(2)} Base Price</p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-slate-100">
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar pb-10">
          {/* Description Section */}
          <section className="space-y-3">
             <div className="flex items-center gap-2 text-slate-400">
                <Info className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Description</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                {item.description || "Freshly prepared house specialty using premium seasonal ingredients."}
             </p>
          </section>

          {/* Nutritional Facts Grid */}
          {item.nutrition && (
            <section className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Scale className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Nutritional Facts</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                 {[
                   { label: 'KCAL', val: item.nutrition.kcal, icon: Flame, color: 'text-orange-500' },
                   { label: 'PROT', val: `${item.nutrition.protein}g`, icon: Beef, color: 'text-red-500' },
                   { label: 'CARB', val: `${item.nutrition.carbs}g`, icon: Wheat, color: 'text-amber-600' },
                   { label: 'FAT', val: `${item.nutrition.fat}g`, icon: Scale, color: 'text-blue-500' }
                 ].map((stat, i) => (
                   <div key={i} className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <span className={cn("text-[10px] font-bold uppercase tracking-tighter mb-1 opacity-60")}>{stat.label}</span>
                      <span className="text-sm font-black text-slate-900">{stat.val}</span>
                   </div>
                 ))}
              </div>
            </section>
          )}

          {/* Allergen Information */}
          {item.allergens && item.allergens.length > 0 && (
            <section className="space-y-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  Allergen Information
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

          {/* Variations Section */}
          {item.variations?.map((variation) => (
            <section key={variation.id} className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {variation.name}
                </h3>
                {variation.type === 'required' && (
                  <span className="text-[9px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded-md">
                    Required Selection
                  </span>
                )}
              </div>
              <ToggleGroup 
                type="single" 
                value={selectedVariations[variation.id]}
                onValueChange={(value) => value && handleVariationSelect(variation.id, value, variation.type)}
                className="grid grid-cols-2 gap-3"
              >
                {variation.options.map(option => (
                    <ToggleGroupItem 
                        key={option.id} 
                        value={option.id}
                        className="h-16 flex-col border-2 rounded-2xl data-[state=on]:border-primary data-[state=on]:bg-primary/5 transition-all"
                    >
                        <span className="font-bold text-sm uppercase tracking-tight">{option.name}</span>
                        <span className={cn(
                            "text-[10px] font-bold mt-0.5 opacity-60", 
                        )}>
                            {option.priceModifier !== 0 ? 
                                `${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier.toFixed(2)}` : "Standard"
                            }
                        </span>
                    </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </section>
          ))}

          {/* Special Kitchen Request */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-500 px-1">
                <MessageSquareText className="h-4 w-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Special Kitchen Request</h3>
            </div>
            <Textarea 
                placeholder="Ex: No onions, sauce on the side, well done..."
                className="min-h-[100px] bg-slate-50 border-slate-200 rounded-[1.5rem] p-4 text-base font-medium focus-visible:ring-primary/20 resize-none"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </section>
        </div>

        <SheetFooter className="p-6 border-t bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</p>
                    <p className="text-lg font-black text-slate-900 tracking-tighter uppercase">Add Count</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-100 p-1.5 rounded-2xl">
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
              className="w-full h-20 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-[1.75rem] shadow-xl transition-all active:scale-[0.98] uppercase tracking-tighter flex items-center justify-center gap-4"
            >
              <span>Add to Order</span>
              <div className="h-10 w-px bg-white/20 mx-1" />
              <span className="bg-white/10 px-4 py-1.5 rounded-xl text-lg font-black tracking-tight">${finalPrice.toFixed(2)}</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
