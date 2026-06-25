
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/data';
import { Plus } from 'lucide-react';
import { QuantitySelector } from './quantity-selector';
import { VariationPickerSheet } from './variation-picker-sheet';
import { cn } from '@/lib/utils';

export function FoodCard({ item }: { item: MenuItem }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [isVariationSheetOpen, setVariationSheetOpen] = useState(false);

  const hasVariations = item.variations && item.variations.length > 0;
  const itemsInCart = cartItems.filter(ci => ci.id === item.id);
  const cartItem = itemsInCart.length > 0 ? itemsInCart[0] : undefined;

  const handleSimpleAdd = () => {
    addToCart(item, {});
  };

  const handleVariationAdd = () => {
    setVariationSheetOpen(true);
  };
  
  const handleCardClick = () => {
    if (hasVariations) {
      setVariationSheetOpen(true);
    }
  }

  return (
    <>
      <Card 
        className={cn(
          "group flex flex-col overflow-hidden transition-all duration-300 rounded-[1.75rem] bg-white border h-full shadow-sm hover:shadow-md",
          (itemsInCart.length > 0) 
            ? "border-primary/30 ring-1 ring-primary/10 bg-primary/[0.02]" 
            : "border-slate-100 hover:border-slate-200"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-4 pb-2 flex-grow">
          <CardTitle className="text-base font-bold text-slate-900 tracking-tight leading-snug">
            {item.name}
          </CardTitle>
           {cartItem && cartItem.selectedVariations && Object.keys(cartItem.selectedVariations).length > 0 && (
            <div className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mt-1">
              {Object.values(cartItem.selectedVariations).join(', ')}
            </div>
          )}
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <div className="w-full flex items-center justify-between mb-1">
            <p className="font-bold text-lg text-slate-800 tabular-nums">
              ${item.price.toFixed(2)}
            </p>
          </div>
          
          <div className="w-full min-h-[44px]">
            {cartItem ? (
              <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <QuantitySelector
                      quantity={cartItem.quantity}
                      onIncrease={() => updateQuantity(cartItemId, cartItem.quantity + 1)}
                      onDecrease={() => updateQuantity(cartItemId, cartItem.quantity - 1)}
                      className="bg-slate-50 border border-slate-100"
                  />
              </div>
            ) : (
              <Button
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
                onClick={(e) => {
                  e.stopPropagation();
                  hasVariations ? handleVariationAdd() : handleSimpleAdd();
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                ADD
              </Button>
            )}
          </div>

          <div className="h-3 flex items-center justify-center">
            {hasVariations && (
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Customizable
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
      {hasVariations && (
        <VariationPickerSheet
            isOpen={isVariationSheetOpen}
            onOpenChange={setVariationSheetOpen}
            item={item}
        />
      )}
    </>
  );
}
