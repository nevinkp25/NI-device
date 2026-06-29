
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Users, Equal, Box, X, User, Receipt, Check, CreditCard, Landmark } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { TipSheet } from './tip-sheet';
import { Checkbox } from './ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    baseReturnUrl: string; 
    onProceedToPayment: (amount: number) => void;
}

type SplitStep = 'choice' | 'equally' | 'by-item';

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, baseReturnUrl, onProceedToPayment }: SplitBillSheetProps) {
    const [step, setStep] = useState<SplitStep>('choice');
    const [splitCount, setSplitCount] = useState(2);
    const [paidGuests, setPaidGuests] = useState<number[]>([]);
    const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number, guestIndex: number | null}>({isOpen: false, amount: 0, guestIndex: null});
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, removeFromCart, getDisplayPrice } = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const perPersonAmount = totalAmount > 0 && splitCount > 0 ? totalAmount / splitCount : 0;
    
    // Process "By Item" calculations
    const itemsToPay = useMemo(() => {
        return cartItems.filter(item => selectedItems.includes(item.cartItemId));
    }, [cartItems, selectedItems]);

    const paymentSubtotal = useMemo(() => {
        return itemsToPay.reduce((acc, item) => acc + getDisplayPrice(item) * item.quantity, 0);
    }, [itemsToPay, getDisplayPrice]);
    
    const vatAmount = paymentSubtotal * 0.05;
    const itemSplitTotal = paymentSubtotal + vatAmount;

    // Payment Logic
    const handlePaymentConfirmed = (finalAmount: number, method: 'card' | 'cash', guestIndex: number | null) => {
        if (guestIndex === null) return;
        
        if (guestIndex === -1) {
            itemsToPay.forEach(item => removeFromCart(item.cartItemId));
        }

        const returnUrl = new URL(baseReturnUrl, window.location.origin);
        if (guestIndex !== -1) {
            returnUrl.searchParams.set('paidGuest', guestIndex.toString());
            returnUrl.searchParams.set('activeSplit', 'equally');
            returnUrl.searchParams.set('splitCount', splitCount.toString());
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

    // State management for returning from payment
    useEffect(() => {
        if (isOpen) {
            const activeSplit = searchParams.get('activeSplit');
            const urlSplitCount = searchParams.get('splitCount');
            const paidGuestIndex = searchParams.get('paidGuest');

            if (activeSplit === 'equally') {
                setStep('equally');
                if (urlSplitCount) setSplitCount(parseInt(urlSplitCount, 10));
                if (paidGuestIndex) {
                    const index = parseInt(paidGuestIndex, 10);
                    setPaidGuests(prev => prev.includes(index) ? prev : [...prev, index]);
                }
            }
        } else {
            // Reset state when sheet is completely closed
            setTimeout(() => {
                setStep('choice');
                setSplitCount(2);
                setPaidGuests([]);
                setSelectedItems([]);
            }, 300);
        }
    }, [isOpen, searchParams]);

    const progressValue = (paidGuests.length / splitCount) * 100;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[95dvh] flex flex-col rounded-t-[2.5rem] p-0 border-t-0 shadow-2xl z-[100]" hideCloseButton>
                <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
                
                <SheetHeader className="p-6 flex-row items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3 text-left">
                        {step !== 'choice' && (
                            <Button variant="ghost" size="icon" onClick={() => setStep('choice')} className="h-8 w-8 rounded-full bg-slate-50 mr-1">
                                <Receipt className="h-4 w-4" />
                            </Button>
                        )}
                        <SheetTitle className="text-xl font-bold uppercase">Split Bill</SheetTitle>
                    </div>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50">
                            <X className="h-5 w-5 text-slate-500" />
                        </Button>
                    </SheetClose>
                </SheetHeader>

                <div className="flex-grow overflow-y-auto no-scrollbar pb-10">
                    {step === 'choice' && (
                        <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-1 mb-8">
                                <p className="text-xs font-bold text-slate-400 uppercase">Check Total</p>
                                <h2 className="text-5xl font-black text-primary tabular-nums tracking-tight">${totalAmount.toFixed(2)}</h2>
                            </div>

                            <Button 
                                onClick={() => setStep('equally')}
                                className="w-full h-24 bg-white border-2 border-slate-100 hover:border-primary/20 text-slate-900 rounded-[1.5rem] flex items-center justify-between px-6 shadow-sm group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Equal className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-base uppercase">Split Equally</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Divide total among guests</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-slate-300" />
                            </Button>

                            <Button 
                                onClick={() => setStep('by-item')}
                                className="w-full h-24 bg-white border-2 border-slate-100 hover:border-primary/20 text-slate-900 rounded-[1.5rem] flex items-center justify-between px-6 shadow-sm group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Box className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-base uppercase">Split by Item</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Select specific dishes to pay</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-slate-300" />
                            </Button>
                        </div>
                    )}

                    {step === 'equally' && (
                        <div className="px-6 space-y-6 animate-in fade-in duration-500">
                            {/* Hero Voucher Card */}
                            <Card className="relative overflow-hidden rounded-[2.5rem] p-8 border-none bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl">
                                <div className="text-center space-y-1 mb-8">
                                    <p className="text-xs font-bold text-white/60 uppercase">Total Amount</p>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-xl font-bold">AED</span>
                                        <span className="text-6xl font-black tabular-nums tracking-tighter">{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase">Including tax & service</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase">
                                        <span>Payment Progress</span>
                                        <span>{Math.round(progressValue)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white transition-all duration-1000 ease-out"
                                            style={{ width: `${progressValue}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-[10px] font-bold uppercase text-white/60">
                                        {paidGuests.length} of {splitCount} Guest paid
                                    </p>
                                </div>
                            </Card>

                            {/* Split Controls */}
                            <Card className="p-6 rounded-[2rem] border-none bg-white shadow-sm flex items-center justify-between">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400"
                                    onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                                    disabled={paidGuests.length > 0}
                                >
                                    <Minus className="h-6 w-6 stroke-[3]" />
                                </Button>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-slate-900 tabular-nums">{splitCount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Guest</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-14 w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20"
                                    onClick={() => setSplitCount(splitCount + 1)}
                                    disabled={paidGuests.length > 0}
                                >
                                    <Plus className="h-6 w-6 stroke-[3]" />
                                </Button>
                            </Card>

                            {/* Share Value Display */}
                            <Card className="p-6 rounded-[2rem] border-none bg-white shadow-sm text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Each Guests pays</p>
                                <div className="flex items-baseline justify-center gap-1.5 text-primary">
                                    <span className="text-sm font-bold">AED</span>
                                    <span className="text-4xl font-black tabular-nums tracking-tight">{perPersonAmount.toFixed(2)}</span>
                                </div>
                            </Card>

                            {/* Guest List */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase px-1">Select who is paying</h3>
                                <div className="space-y-3">
                                    {Array.from({ length: splitCount }).map((_, index) => {
                                        const isPaid = paidGuests.includes(index);
                                        return (
                                            <Card key={index} className={cn(
                                                "flex items-center justify-between p-5 rounded-[1.75rem] border transition-all",
                                                isPaid ? "bg-slate-50/80 border-slate-100" : "bg-white border-slate-50 shadow-sm"
                                            )}>
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center border",
                                                        isPaid ? "bg-white text-primary border-slate-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                                    )}>
                                                        <User className="h-6 w-6" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-bold text-slate-900 uppercase">Guest {index + 1}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">AED {perPersonAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                {isPaid ? (
                                                    <div className="flex items-center gap-1.5 text-primary font-bold uppercase text-[10px] px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                                                        <Check className="h-3.5 w-3.5 stroke-[4]" />
                                                        <span>Paid</span>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        onClick={() => setTipDetails({ isOpen: true, amount: perPersonAmount, guestIndex: index })}
                                                        className="h-11 px-8 rounded-xl font-bold uppercase text-xs bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10"
                                                    >
                                                        Pay
                                                    </Button>
                                                )}
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'by-item' && (
                        <div className="p-6 space-y-6 animate-in fade-in duration-500">
                             <div className="text-center space-y-1 mb-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Partial Settlement</p>
                                <h2 className="text-4xl font-black text-slate-900 tabular-nums">${totalAmount.toFixed(2)}</h2>
                            </div>

                            <div className="space-y-3">
                                <div className="px-1 flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Items</h3>
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
                                            onClick={() => {
                                                setSelectedItems(prev =>
                                                    prev.includes(item.cartItemId)
                                                        ? prev.filter(id => id !== item.cartItemId)
                                                        : [...prev, item.cartItemId]
                                                );
                                            }}
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
                            </div>
                        </div>
                    )}
                </div>

                {step === 'by-item' && cartItems.length > 0 && (
                    <footer className="p-6 border-t bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-4 shrink-0">
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
                            onClick={() => setTipDetails({ isOpen: true, amount: itemSplitTotal, guestIndex: -1 })}
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
