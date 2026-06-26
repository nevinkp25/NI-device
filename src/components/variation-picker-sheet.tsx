
"use client";

import { useState, useEffect, useMemo } from 'export function VariationPickerSheet({ isOpen, onOpenChange, item }: VariationPickerSheetProps) {
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
                            className="h-auto py-2 flex flex-col items-center justify-center"
                        >
                            <span>{option.name}</span>
                            <span className="text-xs">
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
                    className="h-auto py-2 flex-col"
                >
                    <span>{option.name}</span>
                    <span className={cn("text-xs", option.priceModifier >= 0 ? "text-green-600" : "text-red-600")}>
                        {option.priceModifier !== 0 && 
                            `${option.priceModifier > 0 ? '+' : ''}$${option.priceModifier.toFixed(2)}`
                        }
                    </span>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] flex flex-col p-0">
        <SheetHeader className="p-4 border-b flex-row items-center justify-between">
          <SheetTitle className="text-xl">Prep Instructions: {item.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon"><X className="h-5 w-5" /></Button>
          </SheetClose>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto p-4 space-y-6">
          {item.variations?.map((variation) => (
            <div key={variation.id}>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                {variation.name} 
                {variation.type === 'required' && <span className="text-xs text-primary ml-2">(Mandatory)</span>}
              </h3>
              {renderVariationGroup(variation)}
            </div>
          ))}
        </div>

        <SheetFooter className="p-4 border-t bg-background/95 backdrop-blur-sm shadow-lg">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Quantity</p>
                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                        <Minus className="h-5 w-5" />
                    </Button>
                    <span className="w-10 text-center font-bold text-2xl">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>
             <Separator />
            <Button
              onClick={handleAddToCart}
              disabled={!areAllRequiredSelected}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg uppercase font-bold tracking-tight"
            >
              Confirm Prep & Add (${finalPrice.toFixed(2)})
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
