
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Equal, Box, X, User, Check, Hash } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { TipSheet } from './tip-sheet';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

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
    const [tipDetails, setTipDetails] =({isOpen: false, amount: 0, guestIndex: null});
    const [isScrolled, setIsScrolled] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, removeFromCart, getDisplayPrice, clearCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
            const successUrl = "/navigation";
            router.push(`/${method}-payment?amount=${finalAmount.toFixed(2)}&returnUrl=${successUrl}&table=${searchParams.get('table') || ''}`);
            onOpenChange(false);
            return;
        }

        const nextPaidGuests = [...paidGuests, guestIndex];
        const isLastGuest = nextPaidGuests.length === splitCount;

        let returnUrlStr = "";
        if (isLastGuest) {
            clearCart();
            returnUrlStr = "/navigation"; 
        } else {
            const url = new URL(baseReturnUrl, window.location.origin);
            url.searchParams.set('activeSplit', 'equally');
            url.searchParams.set('splitCount', splitCount.toString());
            url.searchParams.set('paidGuests', nextPaidGuests.join(','));
            url.searchParams.set('justPaid', 'true');
            returnUrlStr = url.pathname + url.search;
        }

        const paymentParams = new URLSearchParams({
            amount: finalAmount.toFixed(2),
            returnUrl: returnUrlStr,
            method: method,
            table: searchParams.get('table') || '',
        });

        router.push(`/${method}-payment?${paymentParams.toString()}`);
        onOpenChange(false);
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setIsScrolled(scrollTop > 20);
    };

    useEffect(() => {
        if (isOpen) {
            const activeSplit = searchParams.get('activeSplit');
            const urlSplitCount = searchParams.get('splitCount');
            const urlPaidGuests = searchParams.get('paidGuests');

            if (activeSplit === 'equally') {
                setStep('equally');
                if (urlSplitCount) setSplitCount(parseInt(urlSplitCount, 10));
                if (urlPaidGuests) {
                    const indices = urlPaidGuests.split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
                    setPaidGuests(indices);
                }
            }
        } else {
            const timer = setTimeout(() => {
                setStep('choice');
                setSplitCount(2);
                setPaidGuests([]);
                setSelectedItems([]);
                setIsScrolled(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, searchParams]);

    const progressValue = (paidGuests.length / splitCount) * 100;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[95dvh] flex flex-col rounded-t-[2.5rem] p-0 border-t-0 shadow-2xl z-[100] bg-white" hideCloseButton>
                <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 shrink-0" />
                
                <SheetHeader className="p-4 flex-row items-center justify-between bg-white shrink-0 border-b">
                    <SheetTitle className="text-xl font-black uppercase text-slate-900">
                        {step === 'equally' ? 'Split Equally' : 'Split Bill'}
                    </SheetTitle>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50">
                            <X className="h-5 w-5 text-slate-500" />
                        </Button>
                    </SheetClose>
                </SheetHeader>

                <div 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-grow overflow-y-auto no-scrollbar pb-10 px-5 relative"
                >
                    {step === 'choice' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
                            <div className="text-center space-y-1 mb-8">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Grand Total Due</p>
                                <h2 className="text-6xl font-black text-slate-900 tabular-nums tracking-tighter">${totalAmount.toFixed(2)}</h2>
                            </div>

                            <Button 
                                onClick={() => setStep('equally')}
                                className="w-full h-24 bg-white border-2 border-slate-100 hover:border-[#0069B1]/50 hover:bg-[#0069B1]/5 text-slate-900 rounded-[20px] flex items-center justify-between px-6 shadow-sm group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 bg-[#0069B1]/10 rounded-[1.25rem] flex items-center justify-center">
                                        <Equal className="h-7 w-7 text-[#0069B1]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-base uppercase">Split Equally</p>
                                        <p className="text-[10px] font-bold text-slate-700 uppercase">Divide total among guests</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-slate-400 group-hover:text-[#0069B1]" />
                            </Button>

                            <Button 
                                onClick={() => setStep('by-item')}
                                className="w-full h-24 bg-white border-2 border-slate-100 hover:border-[#0069B1]/50 hover:bg-[#0069B1]/5 text-slate-900 rounded-[20px] flex items-center justify-between px-6 shadow-sm group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 bg-[#0069B1]/10 rounded-[1.25rem] flex items-center justify-center">
                                        <Box className="h-7 w-7 text-[#0069B1]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-base uppercase">Split by Item</p>
                                        <p className="text-[10px] font-bold text-slate-700 uppercase">Select specific items to pay</p>
                                    </div>
                                </div>
                                <Plus className="h-5 w-5 text-slate-400 group-hover:text-[#0069B1]" />
                            </Button>
                        </div>
                    )}

                    {step === 'equally' && (
                        <div className="pt-2">
                            <div className={cn(
                                "sticky top-0 z-50 transition-all duration-300 -mx-5 px-5 bg-transparent mb-2",
                                isScrolled ? "opacity-100 py-3" : "opacity-0 h-0 overflow-hidden pointer-events-none"
                            )}>
                                <div className="p-[1.5px] bg-gradient-to-br from-[#0069B1] via-sky-400 to-orange-300 rounded-[20px]">
                                    <Card className="relative overflow-hidden rounded-[inherit] p-3 border-none bg-gradient-to-br from-[#F0F7FF] via-white to-[#FFF9F5] flex flex-col gap-2 shadow-none">
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[9px] font-black text-slate-700 uppercase">Total Amount</span>
                                            <span className="text-xl font-black text-slate-900 tabular-nums">AED {totalAmount.toFixed(2)}</span>
                                            <span className="text-[9px] font-black text-[#0069B1]">{Math.round(progressValue)}%</span>
                                        </div>
                                        <div className="px-2">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-orange-400 to-[#0069B1] transition-all duration-1000 ease-out"
                                                    style={{ width: `${progressValue}%` }}
                                                />
                                            </div>
                                            <p className="text-center text-[8px] font-black text-slate-700 uppercase mt-1">
                                                {paidGuests.length} OF {splitCount} GUESTS PAID
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="space-y-6 pt-2">
                                <div className={cn(
                                    "transition-all duration-500 transform origin-top",
                                    isScrolled ? "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden" : "opacity-100 scale-100"
                                )}>
                                    <div className="p-[1.5px] bg-gradient-to-br from-[#0069B1] via-sky-400 to-orange-300 rounded-[20px] shadow-sm">
                                        <Card className="relative overflow-hidden rounded-[20px] p-5 border-none bg-gradient-to-br from-[#F0F7FF] via-white to-[#FFF9F5] space-y-4 shadow-none">
                                            <div className="text-center space-y-1">
                                                <div className="flex items-center justify-center mb-2">
                                                    <div className="bg-[#0069B1]/10 text-[#0069B1] px-4 py-1 rounded-xl border border-[#0069B1]/20 shadow-sm flex items-center gap-1.5">
                                                        <Hash className="h-3 w-3" />
                                                        <span className="text-[10px] font-black uppercase">Order #{orderId}</span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Total Balance Due</p>
                                                <div className="flex items-baseline justify-center gap-1.5">
                                                    <span className="text-base font-black text-slate-500">AED</span>
                                                    <span className="text-5xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">{totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <Separator className="bg-slate-200/50" />

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[10px] font-black text-slate-700 uppercase">Payment Progress</span>
                                                    <span className="text-[10px] font-black text-[#0069B1]">{Math.round(progressValue)}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-orange-400 via-sky-500 to-[#0069B1] transition-all duration-1000 ease-out"
                                                        style={{ width: `${progressValue}%` }}
                                                    />
                                                </div>
                                                <p className="text-center text-[9px] font-black text-slate-700 uppercase">
                                                    {paidGuests.length} OF {splitCount} GUESTS PAID
                                                </p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                <Card className="p-2 rounded-[20px] border-none bg-slate-50/80 shadow-sm flex items-center justify-between px-6">
                                    <button 
                                        onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                                        disabled={paidGuests.length > 0}
                                        className="h-12 w-12 rounded-2xl bg-white text-slate-700 hover:bg-[#0069B1]/5 shadow-sm border border-slate-200 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
                                    >
                                        <Minus className="h-5 w-5 stroke-[3]" />
                                    </button>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-slate-900 tabular-nums leading-none">{splitCount}</p>
                                        <p className="text-[10px] font-black text-slate-700 uppercase mt-1">Guests</p>
                                    </div>
                                    <button 
                                        onClick={() => setSplitCount(splitCount + 1)}
                                        disabled={paidGuests.length > 0}
                                        className="h-12 w-12 rounded-2xl bg-[#0069B1] text-white hover:bg-[#0069B1]/90 shadow-md flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
                                    >
                                        <Plus className="h-5 w-5 stroke-[3]" />
                                    </button>
                                </Card>

                                <Card className="p-5 rounded-[20px] border-2 border-slate-100 bg-white shadow-md text-center space-y-0.5">
                                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Share Per Guest</p>
                                    <div className="flex items-baseline justify-center gap-1.5 text-[#0069B1]">
                                        <span className="text-base font-black">AED</span>
                                        <span className="text-4xl font-black tabular-nums leading-none tracking-tight">{perPersonAmount.toFixed(2)}</span>
                                    </div>
                                </Card>

                                <div className="space-y-4 pt-2">
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase px-1 tracking-widest">GUEST LIST</h3>
                                    <div className="space-y-3">
                                        {Array.from({ length: splitCount }).map((_, index) => {
                                            const isPaid = paidGuests.includes(index);
                                            return (
                                                <Card key={index} className={cn(
                                                    "flex items-center justify-between p-4 rounded-[1.75rem] border transition-all duration-300",
                                                    isPaid ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm hover:border-[#0069B1]/30"
                                                )}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-[#0069B1]/10 flex items-center justify-center text-[#0069B1] border border-[#0069B1]/20">
                                                            <User className="h-6 w-6" />
                                                        </div>
                                                        <div className="space-y-0.5 text-left">
                                                            <p className="text-sm font-black text-slate-900 leading-tight">Guest {index + 1}</p>
                                                            <p className="text-[11px] font-black text-slate-700 uppercase leading-none">AED {perPersonAmount.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    {isPaid ? (
                                                        <div className="flex items-center gap-1.5 text-[#0069B1] font-black uppercase text-[10px] px-4 py-2 bg-[#0069B1]/10 rounded-2xl border border-[#0069B1]/20">
                                                            <Check className="h-3.5 w-3.5 stroke-[4]" />
                                                            <span>PAID</span>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => setTipDetails({ isOpen: true, amount: perPersonAmount, guestIndex: index })}
                                                            className="h-11 px-8 rounded-2xl font-black uppercase text-[11px] bg-[#0069B1] hover:bg-[#0069B1]/90 text-white shadow-lg active:scale-95 transition-all"
                                                        >
                                                            PAY
                                                        </button>
                                                    )}
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'by-item' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
                             <div className="text-center space-y-1 mb-4">
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Table Total</p>
                                <h2 className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">${totalAmount.toFixed(2)}</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="px-1 flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Items to Pay</h3>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map(i => i.cartItemId))}
                                        className="text-[10px] font-black text-[#0069B1] uppercase h-auto p-0 hover:bg-transparent hover:text-[#0069B1]/80"
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
                                                "flex items-center justify-between p-5 rounded-[1.75rem] border-2 transition-all cursor-pointer",
                                                selectedItems.includes(item.cartItemId) ? "bg-[#0069B1]/5 border-[#0069B1] shadow-sm" : "bg-white border-slate-100 hover:border-[#0069B1]/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <Checkbox 
                                                    checked={selectedItems.includes(item.cartItemId)}
                                                    className="h-6 w-6 rounded-lg border-2 data-[state=checked]:bg-[#0069B1] data-[state=checked]:border-[#0069B1]"
                                                />
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-slate-900 uppercase leading-none">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-700 uppercase">{item.quantity}x • ${getDisplayPrice(item).toFixed(2)}</p>
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
                    <footer className="p-6 border-t-2 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-4 shrink-0">
                        <div className="space-y-2 px-2">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-700 uppercase">
                                <span>Partial Subtotal</span>
                                <span className="tabular-nums">${paymentSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-700 uppercase">
                                <span>Taxes (5%)</span>
                                <span className="tabular-nums">${vatAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setTipDetails({ isOpen: true, amount: itemSplitTotal, guestIndex: -1 })}
                            disabled={selectedItems.length === 0}
                            className="w-full h-16 bg-[#0069B1] hover:bg-[#0069B1]/90 text-white rounded-2xl shadow-xl flex items-center justify-between px-8 transition-all active:scale-[0.98]"
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
