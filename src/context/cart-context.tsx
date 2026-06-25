
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { MenuItem, CartItem, CartItemVariationSelection } from '@/lib/data';

// Helper to generate a unique ID for a cart item based on its variations
export const generateCartItemId = (itemId: string, variations: CartItemVariationSelection) => {
    const variationString = Object.keys(variations).sort().map(key => `${key}:${variations[key]}`).join('|');
    return `${itemId}[${variationString}]`;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, selectedVariations: CartItemVariationSelection, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateItemInstructions: (cartItemId: string, instructions: string) => void;
  loadCart: (items: CartItem[]) => void;
  clearCart: () => void;
  decreaseSubtotal: (amount: number) => void;
  getItem: (cartItemId: string) => CartItem | undefined;
  totalItems: number;
  subtotal: number;
  getDisplayPrice: (item: CartItem) => number;
  orderInstructions: string;
  setOrderInstructions: (instructions: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [orderInstructions, setOrderInstructions] = useState('');

  const getDisplayPrice = useCallback((item: CartItem) => {
    let finalPrice = item.price;
    if (item.variations && item.selectedVariations) {
        for (const variation of item.variations) {
            const selectedOptionId = item.selectedVariations[variation.id];
            if (selectedOptionId) {
                const selectedOption = variation.options.find(opt => opt.id === selectedOptionId);
                if (selectedOption) {
                    finalPrice += selectedOption.priceModifier;
                }
            }
        }
    }
    return finalPrice;
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newSubtotal = items.reduce((sum, item) => sum + getDisplayPrice(item) * item.quantity, 0);
    setSubtotal(newSubtotal);
  };

  const addToCart = (item: MenuItem, selectedVariations: CartItemVariationSelection, quantity: number = 1) => {
    const cartItemId = generateCartItemId(item.id, selectedVariations);
    
    let newItems;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.cartItemId === cartItemId);
      
      if (existingItem) {
        newItems = prevItems.map(cartItem =>
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        const newItem: CartItem = {
          ...item,
          cartItemId,
          quantity: quantity,
          selectedVariations,
        };
        newItems = [...prevItems, newItem];
      }
      updateTotal(newItems);
      return newItems;
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    let newItems;
    setCartItems(prevItems => {
      if (quantity <= 0) {
        newItems = prevItems.filter(item => item.cartItemId !== cartItemId);
      } else {
        newItems = prevItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        );
      }
      updateTotal(newItems);
      return newItems;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    let newItems;
    setCartItems(prevItems => {
        newItems = prevItems.filter(item => item.cartItemId !== cartItemId);
        updateTotal(newItems);
        return newItems;
    });
  };

  const updateItemInstructions = (cartItemId: string, instructions: string) => {
    setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
            item.cartItemId === cartItemId ? { ...item, specialInstructions: instructions } : item
        );
        return newItems;
    });
  };
  
  const getItem = (cartItemId: string) => {
    return cartItems.find(item => item.cartItemId === cartItemId);
  }

  const loadCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
    updateTotal(items);
  }, [getDisplayPrice]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSubtotal(0);
    setOrderInstructions('');
  }, []);

  const decreaseSubtotal = useCallback((amount: number) => {
    setSubtotal(prev => Math.max(0, prev - amount));
  }, []);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    updateTotal(cartItems);
  }, [cartItems, getDisplayPrice]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    updateItemInstructions,
    loadCart,
    clearCart,
    decreaseSubtotal,
    getItem,
    totalItems,
    subtotal,
    getDisplayPrice,
    orderInstructions,
    setOrderInstructions,
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
