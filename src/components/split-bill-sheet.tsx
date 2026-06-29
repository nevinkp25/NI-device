
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Users, Equal, Box, X, User, Receipt, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { TipSheet } from './tip-sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    baseReturnUrl: string; 
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
        setTipDetails({ isOpen: true, amount: itemSplitTotal, guestIndex: -1 }); // -1 for item split
    };

    const handlePaymentConfirmed = (finalAmount: number, method: 'card' | 'cash', guestIndex: number | null) => {
        if (guestIndex === null) return;
        
        // Remove items if it was an item split
        if (guestIndex === -1) {
            itemsToPay.forEach(item => removeFromCart(item.cartItemId));
        }

        const returnUrl = new URL(baseReturnUrl, window.location.origin);
        if (guestIndex !== -1) {
            returnUrl.searchParams.set('paidGuest', guestIndex.toString());
        }

        const paymentParams = new URLSearchParams({
            amount: finalAmount.toFixed(4),
            returnUrl: returnUrl.pathname + returnUrl.search,
            method: method,
        });

        const baseParams = new URLSearchParams(new URL(baseReturnUrl, window.location.origin).search);
        if (baseParams.get('table')) {
            paymentParams.set('table', baseParams.get('table')!);
        }

        router.push(`/${method}-payment?${paymentParams.toString()}`);
        onOpenChange(false);
    }

    const resetState = useCallback(() => {
        setSplitCount(2);
        setPaidGuests([]);
        setSelectedItems([]);
        setActiveTab('equally');
    }, []);

    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen, resetState]);
    
    // Process paid guests from URL if returning to this sheet
    useEffect(() => {
        if (isOpen && searchParams.has('paidGuest') && activeTab === 'equally') {
            const paidGuestIndex = searchParams.get('paidGuest');
            if (paidGuestIndex) {
                const index = parseInt(paidGuestIndex, 10);
                if (!paidGuests.includes(index)) {
                    setPaidGuests(prev => [...prev, index]);
                }
            }
        }
    }, [isOpen, searchParams, paidGuests.length, activeTab]);

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[92dvh] flex flex-col rounded-t-[2.5rem] p-0 border-t-0 shadow-2xl z-[100]" hideCloseButton>
                <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
                
                <SheetHeader className="p-4 flex-row items-center justify-between border-b bg-white">
                    <div className="flex items-center gap-3 text-left">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-lg font-bold uppercase">Split Bill</SheetTitle>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Choose Payment Type</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-10 w-10 rounded-full bg-slate-50">
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </SheetHeader>

                <div className="bg-slate-50/50 p-6 text-center border-b">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Check Total</p>
                    <h2 className="text-5xl font-black text-primary tabular-nums tracking-tighter">${totalAmount.toFixed(2)}</h2>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 p-1.5 h-16 bg-white border-b gap-2 px-4">
                        <TabsTrigger value="equally" className="rounded-xl h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold uppercase text-[10px] gap-2">
                            <Equal className="h-4 w-4" />
                            Equally
                        </TabsTrigger>
                        <TabsTrigger value="by-item" className="rounded-xl h-12 data-[state=active]:bg-primary data-[state=active]:text-white font-bold uppercase text-[10px] gap-2">
                            <Box className="h-4 w-4" />
                            By Item
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="equally" className="flex-grow overflow-y-auto p-4 no-scrollbar">
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white text-center space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Divide Between</p>
                                <div className="flex items-center justify-center gap-8">
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-14 w-14 rounded-2xl border-2 border-primary text-primary"
                                        onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                                        disabled={paidGuests.length > 0}
                                    >
                                        <Minus className="h-6 w-6 stroke-[3]" />
                                    </Button>
                                    <span className="text-5xl font-black text-primary tabular-nums">{splitCount}</span>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-14 w-14 rounded-2xl border-2 border-primary text-primary"
                                        onClick={() => setSplitCount(splitCount + 1)}
                                        disabled={paidGuests.length > 0}
                                    >
                                        <Plus className="h-6 w-6 stroke-[3]" />
                                    </Button>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Per Person Due</p>
                                    <p className="text-3xl font-black text-slate-900 tabular-nums">${perPersonAmount.toFixed(2)}</p>
                                </div>
                            </Card>

                            <div className="space-y-3">
                                {Array.from({ length: splitCount }).map((_, index) => {
                                    const isPaid = paidGuests.includes(index);
                                    return (
                                        <Card key={index} className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                            isPaid ? "bg-green-50/50 border-green-100" : "bg-white border-slate-100"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center",
                                                    isPaid ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-slate-900 uppercase">Guest {index + 1}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">${perPersonAmount.toFixed(2)} Share</p>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => setTipDetails({ isOpen: true, amount: perPersonAmount, guestIndex: index })}
                                                disabled={isPaid}
                                                className={cn(
                                                    "h-10 px-6 rounded-xl font-bold uppercase text-[10px] shadow-sm",
                                                    isPaid ? "bg-green-600 hover:bg-green-600 text-white" : "bg-primary text-white"
                                                )}
                                            >
                                                {isPaid ? "Settled" : "Process"}
                                            </Button>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="by-item" className="flex-grow overflow-y-auto p-4 no-scrollbar">
                        <div className="space-y-4 animate-in fade-in duration-500">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Receipt className="h-8 w-8 text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Items Settled</p>
                                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-primary font-bold uppercase text-[10px]">Return to Table</Button>
                                </div>
                            ) : (
                                <>
                                    <div className="px-1 flex items-center justify-between">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Items to Pay</h3>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map(i => i.cartItemId))}
                                            className="text-[10px] font-bold text-primary uppercase h-auto p-0"
                                        >
                                            {selectedItems.length === cartItems.length ? 'Deselect All' : 'Select All'}
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {cartItems.map(item => (
                                            <div 
                                                key={item.cartItemId}
                                                onClick={() => handleItemSelect(item.cartItemId)}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                                                    selectedItems.includes(item.cartItemId) ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-slate-100"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Checkbox 
                                                        checked={selectedItems.includes(item.cartItemId)}
                                                        className="h-6 w-6 rounded-lg border-2"
                                                    />
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-bold text-slate-900 uppercase leading-none">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.quantity}x • ${getDisplayPrice(item).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black text-slate-900 tabular-nums">${(getDisplayPrice(item) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {activeTab === 'by-item' && cartItems.length > 0 && (
                    <footer className="p-6 border-t bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-4">
                        <div className="space-y-2 px-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                <span>Selected Subtotal</span>
                                <span className="tabular-nums">${paymentSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                <span>Estimated Tax (5%)</span>
                                <span className="tabular-nums">${vatAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={handlePayForItemsClick}
                            disabled={selectedItems.length === 0}
                            className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl flex items-center justify-between px-8 uppercase"
                        >
                            <span className="font-bold text-sm">Process Partial</span>
                            <span className="text-xl font-black tabular-nums tracking-tighter">${itemSplitTotal.toFixed(2)}</span>
                        </Button>
                    </footer>
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
