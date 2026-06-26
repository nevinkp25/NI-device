
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/data';
import { Plus, Settings2 } from 'lucide-react';
import { QuantitySelector } from './quantity-selector';
import { ProductDetailSheet } from './product-detail-sheet';
import { cn } from '@/lib/utils';

export function FoodCard({ item }: { item: MenuItem }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [isDetailSheetOpen, setDetailSheetOpen] = useState(false);

  const itemsInCart = cartItems.filter(ci => ci.id === item.id);
  const cartItem = itemsInCart.length > 0 ? itemsInCart[0] : undefined;
  const hasVariations = item.variations && item.variations.length > 0;

  const handleQuickAdd = () => {
    // If it has variations, always open sheet
    if (hasVariations) {
        setDetailSheetOpen(true);
    } else {
        addToCart(item, {});
    }
  };
  
  const handleCardClick = () => {
    setDetailSheetOpen(true);
  }

  return (
    <>
      <Card 
        className={cn(
          "group relative flex flex-col overflow-hidden transition-all duration-300 rounded-[1.75rem] bg-white border h-full shadow-sm hover:shadow-md cursor-pointer",
          (itemsInCart.length > 0) 
            ? "border-primary/30 ring-1 ring-primary/10 bg-primary/[0.02]" 
            : "border-slate-100 hover:border-slate-200"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-5 pb-2 flex-grow">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight leading-tight uppercase">
            {item.name}
          </CardTitle>
          
          {/* Simple, clean "Customizable" identifier below the name */}
          {hasVariations && !cartItem && (
            <div className="flex items-center gap-1.5 mt-1.5 text-primary">
              <Settings2 className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Customizable</span>
            </div>
          )}

           {/* Current Selections if already in cart */}
           {cartItem && cartItem.selectedVariations && Object.keys(cartItem.selectedVariations).length > 0 && (
            <div className="text-[10px] text-primary/70 font-bold uppercase tracking-tight mt-1.5 bg-primary/5 px-2 py-0.5 rounded-md w-fit">
              {Object.values(cartItem.selectedVariations).join(', ')}
            </div>
          )}
        </CardHeader>
        <CardFooter className="p-5 pt-0 flex flex-col gap-3">
          <div className="w-full flex items-center justify-between">
            <p className="font-black text-xl text-slate-900 tracking-tighter tabular-nums">
              ${item.price.toFixed(2)}
            </p>
          </div>
          
          <div className="w-full min-h-[50px]">
            {cartItem ? (
              <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <QuantitySelector
                      quantity={cartItem.quantity}
                      onIncrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                      onDecrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                      className="bg-slate-50 border border-slate-100 h-12"
                  />
              </div>
            ) : (
              <Button
                className="w-full h-12 rounded-[1rem] bg-primary hover:bg-primary/90 text-white text-[11px] font-bold shadow-md transition-all active:scale-[0.98] uppercase tracking-tight"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAdd();
                }}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add to Order
              </Button>
            )}
          </div>
          
          {/* Clean "Tap for Details" footer hint */}
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight text-center w-full mt-1">
            Tap for Details
          </p>
        </CardFooter>
      </Card>

      <ProductDetailSheet
          isOpen={isDetailSheetOpen}
          onOpenChange={setDetailSheetOpen}
          item={item}
      />
    </>
  );
}
