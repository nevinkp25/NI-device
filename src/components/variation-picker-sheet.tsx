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
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { MenuItem, CartItemVariationSelection, ItemVariation } from '@/lib/data';

interface VariationPickerSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: MenuItem;
}

export function VariationPickerSheet({ isOpen, onOpenChange, item }: VariationPickerSheetProps) {
  const { addToCart } = useCart();
  const [selectedVariations, setSelectedVariations] = useState<CartItemVariationSelection>({});
  const [quantity, setQuantity] = useState(1);

  // Set default selections for required variations when the sheet opens
  useEffect(() => {
    if (isOpen) {
      const defaultSelections: CartItemVariationSelection = {};
      item.variations?.forEach(variation => {
        if (variation.type === 'required') {
          // Default to the first option if not already set
          defaultSelections[variation.id] = variation.options[0].id;
        }
      });
      setSelectedVariations(defaultSelections);
      setQuantity(1); // Reset quantity
    }
  }, [isOpen, item.variations]);

  const handleVariationSelect = (variationId: string, optionId: string, type: 'required' | 'optional') => {
    setSelectedVariations(prev => {
      const newSelections = { ...prev };
      if (type === 'optional' && newSelections[variationId] === optionId) {
        // Deselect optional item
        delete newSelections[variationId];
      } else {
        newSelections[variationId] = optionId;
      }
      return newSelections;
    });
  };
  
  const handleMultiVariationSelect = (variationId: string, optionId: string) => {
    setSelectedVariations(prev => {
        const currentSelections = prev[variationId] ? prev[variationId].split(',') : [];
        const newSelections = currentSelections.includes(optionId)
            ? currentSelections.filter(id => id !== optionId)
            : [...currentSelections, optionId];
        
        const updated = { ...prev };
        if (newSelections.length > 0) {
            updated[variationId] = newSelections.join(',');
        } else {
            delete updated[variationId];
        }
        return updated;
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
        if (variation.name === "Extras") { // handle multi-select
             const selectedIds = selectedId.split(',');
             selectedIds.forEach(id => {
                const option = variation.options.find(o => o.id === id);
                if (option) price += option.priceModifier;
             })
        } else {
            const option = variation.options.find(o => o.id === selectedId);
            if (option) price += option.priceModifier;
        }
      }
    });
    return price * quantity;
  }, [item, selectedVariations, quantity]);

  const handleAddToCart = () => {
    if (!areAllRequiredSelected) return;
    addToCart(item, selectedVariations, quantity);
    onOpenChange(false);
  };
  
  const renderVariationGroup = (variation: ItemVariation) => {
    if (variation.name === "Extras") { // Multi-select for extras
        return (
             <div className="grid grid-cols-2 gap-2">
                {variation.options.map(option => {
                    const isSelected = selectedVariations[variation.id]?.split(',').includes(option.id);
                    return (
                        <Button
                            key={option.id}
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => handleMultiVariationSelect(variation.id, option.id)}
                            className="h-auto py-2 flex flex-col items-center justify-center border-2 transition-all"
                        >
                            <span className="font-bold text-sm">{option.name}</span>
                            <span className="text-[10px] font-bold text-slate-400">
                                +${option.priceModifier.toFixed(2)}
                            </span>
                        </Button>
                    );
                })}
            </div>
        )
    }

    return (
        <ToggleGroup 
            type="single" 
            value={selectedVariations[variation.id]}
            onValueChange={(value) => {
                if (value) {
                    handleVariationSelect(variation.id, value, variation.type)
                }
            }}
            className="grid grid-cols-3 gap-2"
        >
            {variation.options.map(option => (
                <ToggleGroupItem 
                    key={option.id} 
                    value={option.id}
                    aria-label={`Select ${option.name}`}
                    className="h-auto py-3 flex-col border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/5 transition-all"
                >
                    <span className="font-bold text-xs">{option.name}</span>
                    <span className={cn(
                        "text-[10px] font-bold mt-1", 
                        option.priceModifier >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                        {option.priceModifier !== 0 && 
                            `${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier.toFixed(2)}`
                        }
                        {option.priceModifier === 0 && "Incl."}
                    </span>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] flex flex-col p-0 rounded-t-[2.5rem] border-t-0 shadow-2xl z-[110]">
        <SheetHeader className="p-5 border-b flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight">Prep Instructions</SheetTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.name}</p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100"><X className="h-5 w-5" /></Button>
          </SheetClose>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto p-5 space-y-8 no-scrollbar">
          {item.variations?.map((variation) => (
            <div key={variation.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {variation.name}
                </h3>
                {variation.type === 'required' && (
                  <span className="text-[9px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded-md">
                    Mandatory
                  </span>
                )}
              </div>
              {renderVariationGroup(variation)}
            </div>
          ))}
        </div>

        <SheetFooter className="p-5 border-t bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="w-full space-y-5">
            <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Ticket Quantity</p>
                <div className="flex items-center gap-4 bg-slate-50 p-1 rounded-xl">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-lg bg-white shadow-sm border border-slate-200 active:scale-90" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4 stroke-[3]" />
                    </Button>
                    <span className="w-6 text-center font-bold text-xl tabular-nums tracking-tighter">{quantity}</span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-lg bg-white shadow-sm border border-primary/20 text-primary active:scale-90" 
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        <Plus className="h-4 w-4 stroke-[3]" />
                    </Button>
                </div>
            </div>
             <Separator className="bg-slate-100" />
            <Button
              onClick={handleAddToCart}
              disabled={!areAllRequiredSelected}
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-tight flex items-center justify-center gap-3"
            >
              <span>ADD TO ORDER</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono tracking-tight">${finalPrice.toFixed(2)}</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}