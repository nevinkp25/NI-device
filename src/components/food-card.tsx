
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/data';
import { Plus } from 'lucide-react';
import { QuantitySelector } from './quantity-selector';
import { VariationPickerSheet } from './variation-picker-sheet';
import { generateCartItemId } from '@/context/cart-context';
import { cn } from '@/lib/utils';


export function FoodCard({ item }: { item: MenuItem }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [isVariationSheetOpen, setVariationSheetOpen] = useState(false);

  const hasVariations = item.variations && item.variations.length > 0;

  // For simple items, there's only one possible cart item.
  // For items with variations, we need to find all cart items matching the base item ID.
  const itemsInCart = cartItems.filter(ci => ci.id === item.id);
  const firstItemInCart = itemsInCart[0];

  const handleSimpleAdd = () => {
    addToCart(item, {});
  };

  const handleVariationAdd = () => {
    setVariationSheetOpen(true);
  };
  
  const handleCardClick = () => {
    if (hasVariations && itemsInCart.length > 0) {
      setVariationSheetOpen(true);
    }
  }

  // If it's a simple item or an item with variations that has been added only once.
  const cartItem = itemsInCart.length === 1 ? itemsInCart[0] : undefined;

  return (
    <>
      <Card 
        className={cn(
          "flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300",
          (hasVariations && itemsInCart.length > 0) && "cursor-pointer"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-base font-semibold leading-tight text-center h-10 flex items-center justify-center">{item.name}</CardTitle>
           {cartItem && cartItem.selectedVariations && Object.keys(cartItem.selectedVariations).length > 0 && (
            <div className="text-center text-xs text-muted-foreground pt-1">
              {Object.values(cartItem.selectedVariations).join(', ')}
            </div>
          )}
           {itemsInCart.length > 1 && (
             <div className="text-center text-xs text-primary font-semibold pt-1">
              Multiple selections
            </div>
          )}
        </CardHeader>
        <CardContent className="p-3 flex-grow"></CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between items-center mt-auto">
          <p className="font-bold text-primary text-lg">${item.price.toFixed(2)}</p>
          {cartItem ? (
            <QuantitySelector
              quantity={cartItem.quantity}
              onIncrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
              onDecrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
            />
          ) : itemsInCart.length > 1 ? (
             <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={(e) => { e.stopPropagation(); handleVariationAdd(); }}
              >
                <Plus className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={(e) => {
                e.stopPropagation();
                hasVariations ? handleVariationAdd() : handleSimpleAdd();
              }}
            >
              <Plus className="h-5 w-5" />
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
