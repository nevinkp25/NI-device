
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
  const cartItem = itemsInCart.length === 1 ? itemsInCart[0] : undefined;

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
          "flex flex-col overflow-hidden border-2 transition-all duration-300 rounded-3xl bg-card h-full min-h-[160px] shadow-sm",
          (hasVariations || itemsInCart.length > 0) 
            ? "border-primary shadow-primary/10" 
            : "border-slate-100 hover:border-slate-200"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-4 pb-0 flex-grow">
          <CardTitle className="text-lg font-black leading-tight text-slate-900 uppercase tracking-tighter">
            {item.name}
          </CardTitle>
           {cartItem && cartItem.selectedVariations && Object.keys(cartItem.selectedVariations).length > 0 && (
            <div className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
              {Object.values(cartItem.selectedVariations).join(', ')}
            </div>
          )}
        </CardHeader>
        <CardFooter className="p-4 pt-2 flex flex-col gap-3">
          <div className="w-full flex justify-between items-center px-1">
            <p className="font-black text-2xl text-primary tabular-nums tracking-tighter">
              ${item.price.toFixed(2)}
            </p>
          </div>
          {cartItem ? (
            <QuantitySelector
              quantity={cartItem.quantity}
              onIncrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
              onDecrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
            />
          ) : (
            <Button
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-black shadow-xl active:scale-95 transition-all uppercase tracking-tighter"
              onClick={(e) => {
                e.stopPropagation();
                hasVariations ? handleVariationAdd() : handleSimpleAdd();
              }}
            >
              <Plus className="h-6 w-6 mr-1 stroke-[4]" />
              ADD
            </Button>
          )}
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
