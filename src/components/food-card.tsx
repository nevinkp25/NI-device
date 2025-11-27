"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import type { MenuItem } from '@/lib/data';
import { Plus } from 'lucide-react';
import { QuantitySelector } from './quantity-selector';

export function FoodCard({ item }: { item: MenuItem }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find(ci => ci.id === item.id);

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-3 flex-grow flex items-center justify-center">
        <CardTitle className="text-base font-headline font-semibold leading-tight text-center">{item.name}</CardTitle>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
        {cartItem ? (
          <QuantitySelector
            quantity={cartItem.quantity}
            onIncrease={() => updateQuantity(item.id, cartItem.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, cartItem.quantity - 1)}
          />
        ) : (
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => addToCart(item)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}