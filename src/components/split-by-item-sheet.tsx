
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Box, X } from 'lucide-react';
import Link from 'next/link';

interface SplitByItemSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onProceedToPayment: (amount: number) => void;
}

export function SplitByItemSheet({ isOpen, onOpenChange, onProceedToPayment }: SplitByItemSheetProps) {
  const { cartItems, removeFromCart, getDisplayPrice } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Reset selected items when sheet is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
    }
  }, [isOpen]);

  const handleItemSelect = (cartItemId: string) => {
    setSelectedItems(prev =>
      prev.includes(cartItemId)
        ? prev.filter(id => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const itemsToPay = useMemo(() => {
    return cartItems.filter(item => selectedItems.includes(item.cartItemId));
  }, [cartItems, selectedItems]);

  const paymentSubtotal = useMemo(() => {
    return itemsToPay.reduce((acc, item) => acc + getDisplayPrice(item) * item.quantity, 0);
  }, [itemsToPay, getDisplayPrice]);
  
  const vatAmount = paymentSubtotal * 0.05;
  const total = paymentSubtotal + vatAmount;

  const handlePayClick = () => {
    if (itemsToPay.length === 0) return;
    onProceedToPayment(total);
    // Remove items from cart after initiating payment process
    itemsToPay.forEach(item => removeFromCart(item.cartItemId));
    onOpenChange(false);
  };

  const getVariationString = (item: (typeof cartItems)[0]) => {
    const variationValues = Object.values(item.selectedVariations);
    if (variationValues.length === 0) return null;
    return variationValues.join(', ');
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90dvh] flex flex-col rounded-t-lg p-0" hideCloseButton>
        <SheetHeader className="p-4 border-b flex-row items-center justify-between">
          <div className='flex items-center gap-2'>
              <Box className="h-6 w-6 text-primary"/>
              <SheetTitle>Split by Item</SheetTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}><X className="h-5 w-5"/></Button>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-2xl font-bold">Bill Settled!</h2>
                <p className="text-muted-foreground mt-2 mb-6">All items have been paid for.</p>
                <Link href="/navigation" passHref>
                    <Button className="bg-accent text-accent-foreground">Back to Home</Button>
                </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Select items to pay</h2>
              
              <Card className="p-4 shadow-sm">
                <p className='text-sm text-muted-foreground mb-4'>Select one or more items to pay for now. The remaining items can be paid for by the next person.</p>
                <ul className="divide-y">
                  {cartItems.map(item => {
                    const displayPrice = getDisplayPrice(item);
                    const variationString = getVariationString(item);
                    return (
                      <li key={item.cartItemId} className="py-2">
                          <div className="flex items-center gap-4 p-2 rounded-lg">
                              <Checkbox 
                                  id={`sheet-item-${item.cartItemId}`} 
                                  checked={selectedItems.includes(item.cartItemId)}
                                  onCheckedChange={() => handleItemSelect(item.cartItemId)}
                                  className="h-6 w-6"
                              />
                              <Label 
                                  htmlFor={`sheet-item-${item.cartItemId}`}
                                  className="flex-grow flex justify-between items-center cursor-pointer"
                              >
                                  <div>
                                      <p className="font-medium">{item.name} <span className="text-muted-foreground text-sm">x{item.quantity}</span></p>
                                       {variationString && <p className="text-xs text-muted-foreground">{variationString}</p>}
                                  </div>
                                  <span className="font-mono font-semibold">${(displayPrice * item.quantity).toFixed(2)}</span>
                              </Label>
                          </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="p-4 border-t bg-background/95 backdrop-blur-sm shadow-lg">
            <div className='w-full space-y-3'>
                <div className='p-2 space-y-1'>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-mono">${paymentSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>VAT (5%)</span>
                        <span className="font-mono">${vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-1 border-t mt-1">
                        <span>Total for Selected Items</span>
                        <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                </div>
                <Button 
                    onClick={handlePayClick}
                    disabled={itemsToPay.length === 0} 
                    className="w-full h-14 bg-primary text-primary-foreground text-lg"
                >
                    Pay for Selected Items (${total.toFixed(2)})
                </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
