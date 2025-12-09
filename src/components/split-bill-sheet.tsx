

"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Users, Equal, Box, X, User } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { TipSheet } from './tip-sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import Link from 'next/link';

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    baseReturnUrl: string; // e.g., /checkout or /order-status?table=3
    onProceedToPayment: (amount: number) => void;
}

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, baseReturnUrl, onProceedToPayment }: SplitBillSheetProps) {
    const [splitCount, setSplitCount] = useState(2);
    const [paidGuests, setPaidGuests] = useState<number[]>([]);
    const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number, guestIndex: number | null}>({isOpen: false, amount: 0, guestIndex: null});
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, removeFromCart, getDisplayPrice, clearCart, loadCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('equally');

    const perPersonAmount = totalAmount > 0 && splitCount > 0 ? totalAmount / splitCount : 0;
    
    // START: Split by item logic
    const itemsToPay = useMemo(() => {
        return cartItems.filter(item => selectedItems.includes(item.cartItemId));
    }, [cartItems, selectedItems]);

    const paymentSubtotal = useMemo(() => {
        return itemsToPay.reduce((acc, item) => acc + getDisplayPrice(item) * item.quantity, 0);
    }, [itemsToPay, getDisplayPrice]);
    
    const vatAmount = paymentSubtotal * 0.05;
    const itemSplitTotal = paymentSubtotal + vatAmount;

    const handleItemSelect = (cartItemId: string) => {
        setSelectedItems(prev =>
        prev.includes(cartItemId)
            ? prev.filter(id => id !== cartItemId)
            : [...prev, cartItemId]
        );
    };

    const handlePayForItemsClick = () => {
        if (itemsToPay.length === 0) return;
        onProceedToPayment(itemSplitTotal);
        // Remove items from cart after initiating payment process
        itemsToPay.forEach(item => removeFromCart(item.cartItemId));
        onOpenChange(false);
    };

    const getVariationString = (item: (typeof cartItems)[0]) => {
        const variationValues = Object.values(item.selectedVariations);
        if (variationValues.length === 0) return null;
        return variationValues.join(', ');
    }
    // END: Split by item logic


    const resetState = useCallback(() => {
        setSplitCount(2);
        setPaidGuests([]);
        setSelectedItems([]);
        setActiveTab('equally');
        // When resetting, ensure the cart is reloaded to its original state if items were virtually removed
        if(baseReturnUrl.includes('order-status')){
            //This is a bit of a hack, would be better to pass the order items in
        } else {
             loadCart(cartItems);
        }

    }, [baseReturnUrl, cartItems, loadCart]);

    useEffect(() => {
        if (!isOpen) {
             if (searchParams.has('paidGuest')) {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('paidGuest');
                newUrl.searchParams.delete('amount');
                newUrl.searchParams.delete('returnUrl');
                newUrl.searchParams.delete('transactionId');
                newUrl.searchParams.delete('table');
                window.history.replaceState({}, '', newUrl.toString());
            }
            resetState();
        } else {
            // Reset selections when opening
            setSelectedItems([]);
        }
    }, [isOpen, searchParams, resetState]);
    
    useEffect(() => {
        if (isOpen && searchParams.has('paidGuest') && activeTab === 'equally') {
            const paidGuestIndex = searchParams.get('paidGuest');
            if (paidGuestIndex) {
                const index = parseInt(paidGuestIndex, 10);
                if (!paidGuests.includes(index)) {
                    const newPaidGuests = [...paidGuests, index];
                    setPaidGuests(newPaidGuests);

                    if (newPaidGuests.length >= splitCount) {
                        setTimeout(() => {
                            clearCart();
                            onOpenChange(false);
                            router.push('/navigation');
                        }, 800);
                    }
                }
            }
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('paidGuest');
            window.history.replaceState({}, '', newUrl.toString());
        }
    }, [isOpen, searchParams, paidGuests, splitCount, clearCart, onOpenChange, router, activeTab]);

    const handlePayForSplit = (guestIndex: number) => {
        const remainingGuests = splitCount - paidGuests.length;
        const amountToPay = totalAmount - (paidGuests.length * perPersonAmount);
        const currentSplitAmount = Math.min(perPersonAmount, amountToPay / (remainingGuests > 0 ? remainingGuests : 1));
        
        setTipDetails({ isOpen: true, amount: currentSplitAmount, guestIndex });
    }
    
    const handlePaymentConfirmed = (finalAmount: number, method: 'card' | 'cash', guestIndex: number | null) => {
        if (guestIndex === null) return;
        
        const returnUrl = new URL(baseReturnUrl, window.location.origin);
        returnUrl.searchParams.set('paidGuest', guestIndex.toString());

        const paymentParams = new URLSearchParams({
            amount: finalAmount.toFixed(4),
            returnUrl: returnUrl.pathname + returnUrl.search,
        });

        const baseParams = new URLSearchParams(new URL(baseReturnUrl, window.location.origin).search);
        if (baseParams.get('table')) {
            paymentParams.set('table', baseParams.get('table')!);
        }

        router.push(`/${method}-payment?${paymentParams.toString()}`);
        onOpenChange(false);
    }


    const handleSheetChange = (open: boolean) => {
        if (!open) {
            resetState();
        }
        onOpenChange(open);
    };

    useEffect(() => {
        setPaidGuests([]);
    }, [splitCount]);

    return (
        <Sheet open={isOpen} onOpenChange={handleSheetChange}>
            <SheetContent side="bottom" className="h-[90dvh] flex flex-col rounded-t-lg p-0" hideCloseButton>
                <SheetHeader className="p-4 border-b flex-row items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <Users className="h-6 w-6 text-primary"/>
                        <SheetTitle>Split the Bill</SheetTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleSheetChange(false)}><X className="h-5 w-5"/></Button>
                </SheetHeader>
                
                 <div className="text-center pt-4">
                    <p className="text-muted-foreground">Total Amount</p>
                    <h2 className="text-5xl font-bold text-primary">${totalAmount.toFixed(2)}</h2>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mt-4 mx-auto max-w-[90%]">
                        <TabsTrigger value="equally"><Equal className="h-4 w-4 mr-2"/>Split Equally</TabsTrigger>
                        <TabsTrigger value="by-item"><Box className="h-4 w-4 mr-2"/>Split by Item</TabsTrigger>
                    </TabsList>
                    <TabsContent value="equally" className="flex-grow overflow-y-auto p-4">
                       <div className="space-y-4 animate-in fade-in-0 duration-300">
                             <p className="text-center text-muted-foreground font-semibold">Split between how many people?</p>
                            <Card className="flex items-center justify-between p-2">
                                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => setSplitCount(Math.max(2, splitCount - 1))} disabled={splitCount <= 2 || paidGuests.length > 0}>
                                    <Minus className="h-6 w-6" />
                                </Button>
                                <div className="text-center">
                                    <p className="font-bold text-4xl">{splitCount}</p>
                                    <p className="text-sm text-muted-foreground">people</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => setSplitCount(splitCount + 1)} disabled={paidGuests.length > 0}>
                                    <Plus className="h-6 w-6" />
                                </Button>
                            </Card>
                            <Card className="p-4 text-center bg-muted">
                                <p className="text-muted-foreground">Each person pays</p>
                                <p className="font-bold text-3xl text-primary">${perPersonAmount.toFixed(2)}</p>
                            </Card>
                            
                            <div className="space-y-2 pt-4">
                               <p className="text-center text-muted-foreground font-semibold">Select who is paying:</p>
                                {Array.from({ length: splitCount }).map((_, index) => {
                                    const isPaid = paidGuests.includes(index);
                                    return (
                                        <Card key={index} className="flex items-center justify-between p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted p-2 rounded-full"><User className="h-5 w-5 text-muted-foreground"/></div>
                                                <div>
                                                    <p className="font-semibold">Guest {index + 1}</p>
                                                    <p className="text-sm text-muted-foreground">${perPersonAmount.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <Button onClick={() => handlePayForSplit(index)} disabled={isPaid}>
                                                {isPaid ? "Paid" : "Pay"}
                                            </Button>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="by-item" className="flex-grow overflow-y-auto p-4">
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
                    </TabsContent>
                </Tabs>

                {activeTab === 'by-item' && cartItems.length > 0 && (
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
                                    <span className="font-mono">${itemSplitTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button 
                                onClick={handlePayForItemsClick}
                                disabled={itemsToPay.length === 0} 
                                className="w-full h-14 bg-primary text-primary-foreground text-lg"
                            >
                                Pay for Selected Items (${itemSplitTotal.toFixed(2)})
                            </Button>
                        </div>
                    </SheetFooter>
                )}
                
                 <TipSheet
                    isOpen={tipDetails.isOpen}
                    onOpenChange={(isOpen) => setTipDetails(prev => ({...prev, isOpen}))}
                    billAmount={tipDetails.amount}
                    onPaymentConfirmed={(finalAmount, method) => handlePaymentConfirmed(finalAmount, method, tipDetails.guestIndex)}
                 />

            </SheetContent>
        </Sheet>
    );
}
