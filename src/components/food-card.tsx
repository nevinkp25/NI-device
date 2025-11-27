"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/data';
import { Plus } from 'lucide-react';
import { QuantitySelector } from './quantity-selector';

export function FoodCard({ item }: { item: MenuItem }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find(ci => ci.id === item.id);

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-headline font-semibold leading-tight text-center h-10 flex items-center justify-center">{item.name}</CardTitle>
      </CardHeader>
      <CardFooter className="p-3 pt-0 flex justify-between items-center mt-auto">
        <p className="font-bold text-primary text-lg">${item.price.toFixed(2)}</p>
        {cartItem ? (
          <QuantitySelector
            quantity={cartItem.quantity}
            onIncrease={() => updateQuantity(item.id, cartItem.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, cartItem.quantity - 1)}
          />
        ) : (
          <Button
            size="icon"
            className="h-9 w-9 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => addToCart(item)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
