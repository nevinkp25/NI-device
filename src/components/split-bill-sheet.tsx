
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Equal, Box, X, User, Check, Hash } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { TipSheet } from './tip-sheet';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    orderId: string;
    baseReturnUrl: string; 
    onProceedToPayment: (amount: number) => void;
}

type SplitStep = 'choice' | 'equally' | 'by-item';

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, orderId, baseReturnUrl }: SplitBillSheetProps) {
    const [step, setStep] = useState<SplitStep>('choice');
    const [splitCount, setSplitCount] = useState(2);
    const [paidGuests, setPaidGuests] = useState<number[]>([]);
    const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number, guestIndex: number | null}>({isOpen: false, amount: 0, guestIndex: null});
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, removeFromCart, getDisplayPrice } = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const perPersonAmount = totalAmount > 0 && splitCount > 0 ? totalAmount / splitCount : 0;
    
    const itemsToPay = useMemo(() => {
        return cartItems.filter(item => selectedItems.includes(item.cartItemId));
    }, [cartItems, selectedItems]);

    const paymentSubtotal = useMemo(() => {
        return itemsToPay.reduce((acc, item) => acc + getDisplayPrice(item) * item.quantity, 0);
    }, [itemsToPay, getDisplayPrice]);
    
    const vatAmount = paymentSubtotal * 0.05;
    const itemSplitTotal = paymentSubtotal + vatAmount;

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
            <SheetContent side="bottom" className="h-[95dvh] flex flex-col rounded-t-[2.5rem] p-0 border-t-0 shadow-2xl z-[100] bg-white" hideCloseButton>
                <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
                
                <SheetHeader className="p-6 flex-row items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3 text-left">
                        <SheetTitle className="text-xl font-bold uppercase">Split Equally</SheetTitle>
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
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grand Total Due</p>
                                <h2 className="text-6xl font-black text-slate-900 tabular-nums">${totalAmount.toFixed(2)}</h2>
                            </div>

                            <Button 
                                onClick={() => setStep('equally')}
                                className="w-full h-24 bg-white border-2 border-slate-100 hover:border-primary text-slate-900 rounded-[2rem] flex items-center justify-between px-6 shadow-sm group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 bg-primary/5 rounded-[1.25rem] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Equal className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-base uppercase">Split Equally</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Divide total among guests</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-slate-300 group-hover:text-primary" />
                            </Button>

                            <Button 
                                onClick={() => setStep('by-item')}
                                className="w-full h-24 bg-white border-2 border-slate-100 hover:border-primary text-slate-900 rounded-[2rem] flex items-center justify-between px-6 shadow-sm group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 bg-primary/5 rounded-[1.25rem] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Box className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-base uppercase">Split by Item</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Select specific items to pay</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-slate-300 group-hover:text-primary" />
                            </Button>
                        </div>
                    )}

                    {step === 'equally' && (
                        <div className="px-6 space-y-6 animate-in fade-in duration-500">
                            {/* Hero Voucher Card */}
                            <Card className="relative overflow-hidden rounded-[2.5rem] p-8 border border-slate-100 bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] shadow-sm">
                                <div className="absolute top-4 right-8 flex items-center gap-1 opacity-60">
                                    <Hash className="h-3 w-3 text-primary" />
                                    <p className="text-[10px] font-black text-primary uppercase">ID: {orderId}</p>
                                </div>

                                <div className="text-center space-y-1 mb-8">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-6xl font-black text-slate-900 tabular-nums leading-none">${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Including Tax & Service</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                                        <span>Payment Progress</span>
                                        <span>{Math.round(progressValue)}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-orange-400 to-primary transition-all duration-1000 ease-out"
                                            style={{ width: `${progressValue}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {paidGuests.length} OF {splitCount} GUESTS SETTLED
                                    </p>
                                </div>
                            </Card>

                            {/* Guest Selector Card */}
                            <Card className="p-4 rounded-[2rem] border-none bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-between">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                                    disabled={paidGuests.length > 0}
                                >
                                    <Minus className="h-6 w-6 stroke-[3]" />
                                </Button>
                                <div className="text-center">
                                    <p className="text-4xl font-black text-slate-900 tabular-nums leading-none">{splitCount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Guests</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-14 w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                                    onClick={() => setSplitCount(splitCount + 1)}
                                    disabled={paidGuests.length > 0}
                                >
                                    <Plus className="h-6 w-6 stroke-[3]" />
                                </Button>
                            </Card>

                            {/* Share Value Display */}
                            <Card className="p-6 rounded-[2rem] border-none bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Each Guest Pays</p>
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <span className="text-5xl font-black tabular-nums leading-none">${perPersonAmount.toFixed(2)}</span>
                                </div>
                            </Card>

                            {/* Guest List */}
                            <div className="space-y-4 pt-2">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase px-1 tracking-widest">Guest Settlement List</h3>
                                <div className="space-y-3">
                                    {Array.from({ length: splitCount }).map((_, index) => {
                                        const isPaid = paidGuests.includes(index);
                                        return (
                                            <Card key={index} className={cn(
                                                "flex items-center justify-between p-5 rounded-[2rem] border transition-all",
                                                isPaid ? "bg-slate-50/50 border-slate-100" : "bg-white border-slate-50 shadow-sm"
                                            )}>
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-full flex items-center justify-center border",
                                                        isPaid ? "bg-white text-primary border-slate-100" : "bg-slate-100 text-primary border-transparent"
                                                    )}>
                                                        <User className="h-6 w-6" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-base font-black text-slate-900 leading-tight">Guest {index + 1}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase leading-none">${perPersonAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                {isPaid ? (
                                                    <div className="flex items-center gap-1.5 text-primary font-black uppercase text-[10px] px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                                                        <Check className="h-3.5 w-3.5 stroke-[4]" />
                                                        <span>PAID</span>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        onClick={() => setTipDetails({ isOpen: true, amount: perPersonAmount, guestIndex: index })}
                                                        className="h-10 px-8 rounded-xl font-bold uppercase text-xs bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/10 transition-all active:scale-95"
                                                    >
                                                        PAY
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
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table Total</p>
                                <h2 className="text-4xl font-black text-slate-900 tabular-nums">${totalAmount.toFixed(2)}</h2>
                            </div>

                            <div className="space-y-3">
                                <div className="px-1 flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Items to Pay</h3>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map(i => i.cartItemId))}
                                        className="text-[10px] font-black text-primary uppercase h-auto p-0"
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
                                                "flex items-center justify-between p-5 rounded-[1.75rem] border transition-all cursor-pointer",
                                                selectedItems.includes(item.cartItemId) ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-slate-100"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <Checkbox 
                                                    checked={selectedItems.includes(item.cartItemId)}
                                                    className="h-6 w-6 rounded-lg border-2"
                                                />
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-slate-900 uppercase leading-none">{item.name}</p>
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
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                                <span>Partial Subtotal</span>
                                <span className="tabular-nums">${paymentSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                                <span>Taxes (5%)</span>
                                <span className="tabular-nums">${vatAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setTipDetails({ isOpen: true, amount: itemSplitTotal, guestIndex: -1 })}
                            disabled={selectedItems.length === 0}
                            className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl flex items-center justify-between px-8 transition-all active:scale-[0.98]"
                        >
                            <span className="font-black text-sm uppercase">Process Share</span>
                            <span className="text-2xl font-black tabular-nums">${itemSplitTotal.toFixed(2)}</span>
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
