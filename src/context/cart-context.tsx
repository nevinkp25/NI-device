
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { MenuItem, CartItem } from '@/lib/data';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  decreaseSubtotal: (amount: number) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const updateTotal = (items: CartItem[]) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
  };
  
  const addToCart = (item: MenuItem) => {
    let newItems;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        newItems = prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newItems = [...prevItems, { ...item, quantity: 1 }];
      }
      updateTotal(newItems);
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    let newItems;
    setCartItems(prevItems => {
      if (quantity <= 0) {
        newItems = prevItems.filter(item => item.id !== itemId);
      } else {
        newItems = prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
      }
      updateTotal(newItems);
      return newItems;
    });
  };

  const removeFromCart = (itemId: string) => {
    let newItems;
    setCartItems(prevItems => {
        newItems = prevItems.filter(item => item.id !== itemId);
        updateTotal(newItems);
        return newItems;
    });
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSubtotal(0);
  }, []);

  const decreaseSubtotal = useCallback((amount: number) => {
    setSubtotal(prev => {
        const newSubtotal = prev - amount;
        if (newSubtotal <= 0.01) { // Use a small epsilon for float comparison
            clearCart();
            return 0;
        }
        return newSubtotal;
    });
     // In a real app, you might want to remove specific items paid for.
     // For this simulation, we just reduce the total. We'll clear items
     // once the subtotal is effectively zero.
  }, [clearCart]);


  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Recalculate subtotal from cartItems whenever they change.
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    decreaseSubtotal,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
