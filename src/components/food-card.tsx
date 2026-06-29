
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariations) {
        setDetailSheetOpen(true);
    } else {
        // Trigger dot animation
        const rect = e.currentTarget.getBoundingClientRect();
        window.dispatchEvent(new CustomEvent('add-to-cart-animation', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        }));
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
          "group relative flex flex-col overflow-hidden transition-all duration-300 rounded-[1.5rem] bg-white border h-full shadow-sm hover:shadow-md cursor-pointer",
          (itemsInCart.length > 0) 
            ? "border-primary/20 ring-1 ring-primary/5 bg-primary/[0.01]" 
            : "border-slate-100 hover:border-slate-200"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-4 pb-2 flex-grow space-y-1">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-sm font-black text-slate-900 leading-tight tracking-tight uppercase">
              {item.name}
            </CardTitle>
            {hasVariations && (
                <div className="h-5 w-5 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Settings2 className="h-3 w-3 text-primary" />
                </div>
            )}
          </div>
          
          {hasVariations && !cartItem && (
            <div className="flex items-center gap-1 text-primary">
              <span className="text-[8px] font-black uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">Customizable</span>
            </div>
          )}

           {cartItem && cartItem.selectedVariations && Object.keys(cartItem.selectedVariations).length > 0 && (
            <div className="text-[8px] text-primary/70 font-bold uppercase tracking-tight mt-1 bg-primary/5 px-2 py-0.5 rounded-md w-fit line-clamp-1">
              {Object.values(cartItem.selectedVariations).join(', ')}
            </div>
          )}
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
          <div className="w-full">
            <p className="font-black text-lg text-slate-900 tracking-tighter tabular-nums">
              ${item.price.toFixed(2)}
            </p>
          </div>
          
          <div className="w-full">
            {cartItem ? (
              <div onClick={(e) => e.stopPropagation()} className="w-full">
                  <QuantitySelector
                      quantity={cartItem.quantity}
                      onIncrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                      onDecrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                      className="bg-slate-50 border-none h-11"
                  />
              </div>
            ) : (
              <Button
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white text-[10px] font-bold shadow-sm transition-all active:scale-[0.98] uppercase tracking-tight"
                onClick={handleQuickAdd}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Item
              </Button>
            )}
          </div>
          
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight text-center w-full">
            Tap for Prep Details
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
