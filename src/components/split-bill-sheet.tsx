"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Equal, Box, X, User, Check, Hash, ArrowRight, ArrowLeft, Info, AlertCircle, Receipt, Landmark, CreditCard } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { TipSheet } from './tip-sheet';
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
type ByItemSubStep = 'guests-count' | 'assigning' | 'summary' | 'payment';

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, orderId, baseReturnUrl }: SplitBillSheetProps) {
    const [step, setStep] = useState<SplitStep>('choice');
    const [byItemStep, setByItemStep] = useState<ByItemSubStep>('guests-count');
    const [splitCount, setSplitCount] = useState(2);
    const [paidGuests, setPaidGuests] = useState<number[]>([]);
    const [tipDetails, setTipDetails] = useState<{isOpen: boolean, amount: number, guestIndex: number | null}>({isOpen: false, amount: 0, guestIndex: null});
    const [isScrolled, setIsScrolled] = useState(false);
    
    // By-Item specific state: GuestIndex -> { cartItemId: quantity }
    const [itemAssignments, setItemAssignments] = useState<Record<number, Record<string, number>>>({}); 
    const [tempSelections, setTempSelections] = useState<Record<string, number>>({});
    const [currentAssigningGuestIndex, setCurrentAssigningGuestIndex] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, getDisplayPrice, clearCart } = useCart();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Calculations for Equal Split
    const perPersonAmount = totalAmount > 0 && splitCount > 0 ? totalAmount / splitCount : 0;

    /**
     * Calculate guest total matching main logic:
     * (Subtotal + 10% Service) * 1.05 VAT
     */
    const getGuestTotal = (guestIndex: number, selectionsToUse?: Record<string, number>) => {
        const selections = selectionsToUse || itemAssignments[guestIndex] || {};
        const subtotal = Object.entries(selections).reduce((acc, [itemId, qty]) => {
            const item = cartItems.find(ci => ci.cartItemId === itemId);
            return item ? acc + getDisplayPrice(item) * qty : acc;
        }, 0);
        
        if (subtotal === 0) return 0;
        
        const extraCharges = subtotal * 0.10;
        const vatAmount = (subtotal + extraCharges) * 0.05;
        return subtotal + extraCharges + vatAmount;
    };

    const currentGuestPreviewTotal = useMemo(() => {
        return getGuestTotal(currentAssigningGuestIndex, tempSelections);
    }, [currentAssigningGuestIndex, tempSelections, cartItems, getDisplayPrice]);

    // Total units of a specific item assigned across ALL guests except current assignments
    const getAssignedQuantity = (cartItemId: string) => {
        return Object.entries(itemAssignments).reduce((acc, [gIdx, selections]) => {
            return acc + (selections[cartItemId] || 0);
        }, 0);
    };

    const totalBillAssigned = useMemo(() => {
        return Array.from({ length: splitCount }).reduce((acc, _, i) => acc + getGuestTotal(i), 0);
    }, [itemAssignments, splitCount, cartItems, getDisplayPrice]);

    const handleBack = () => {
        if (step === 'equally') {
            if (paidGuests.length === 0) setStep('choice');
            return;
        }

        if (step === 'by-item') {
            if (byItemStep === 'guests-count') {
                setStep('choice');
            } else if (byItemStep === 'assigning') {
                if (currentAssigningGuestIndex === 0) {
                    setByItemStep('guests-count');
                } else {
                    const prevIndex = currentAssigningGuestIndex - 1;
                    const prevSelections = itemAssignments[prevIndex] || {};
                    setTempSelections(prevSelections);
                    
                    const nextAssignments = { ...itemAssignments };
                    delete nextAssignments[prevIndex];
                    setItemAssignments(nextAssignments);
                    setCurrentAssigningGuestIndex(prevIndex);
                }
            } else if (byItemStep === 'summary') {
                const lastIndex = splitCount - 1;
                const lastSelections = itemAssignments[lastIndex] || {};
                setTempSelections(lastSelections);
                
                const nextAssignments = { ...itemAssignments };
                delete nextAssignments[lastIndex];
                setItemAssignments(nextAssignments);
                setCurrentAssigningGuestIndex(lastIndex);
                setByItemStep('assigning');
            } else if (byItemStep === 'payment') {
                if (paidGuests.length === 0) {
                    setByItemStep('summary');
                }
            }
        }
    };

    const handlePaymentConfirmed = (finalAmount: number, method: 'card' | 'cash', guestIndex: number | null) => {
        if (guestIndex === null) return;
        
        const nextPaidGuests = [...paidGuests, guestIndex];
        const isLastGuest = nextPaidGuests.length === splitCount;

        let returnUrlStr = "";
        if (isLastGuest) {
            clearCart();
            returnUrlStr = "/navigation"; 
        } else {
            const url = new URL(baseReturnUrl, window.location.origin);
            url.searchParams.set('activeSplit', step);
            url.searchParams.set('splitCount', splitCount.toString());
            url.searchParams.set('paidGuests', nextPaidGuests.join(','));
            url.searchParams.set('justPaid', 'true');
            
            if (step === 'by-item') {
                url.searchParams.set('assignments', JSON.stringify(itemAssignments));
            }
            
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
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setIsScrolled(scrollTop > 20);
    };

    useEffect(() => {
        if (isOpen) {
            const activeSplit = searchParams.get('activeSplit') as SplitStep;
            const urlSplitCount = searchParams.get('splitCount');
            const urlPaidGuests = searchParams.get('paidGuests');
            const urlAssignments = searchParams.get('assignments');

            if (activeSplit === 'equally' || activeSplit === 'by-item') {
                setStep(activeSplit);
                if (urlSplitCount) setSplitCount(parseInt(urlSplitCount, 10));
                if (urlPaidGuests) {
                    const indices = urlPaidGuests.split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n));
                    setPaidGuests(indices);
                }
                if (activeSplit === 'by-item') {
                    setByItemStep('payment');
                    if (urlAssignments) setItemAssignments(JSON.parse(urlAssignments));
                }
            }
        } else {
            const timer = setTimeout(() => {
                setStep('choice');
                setByItemStep('guests-count');
                setSplitCount(2);
                setPaidGuests([]);
                setItemAssignments({});
                setTempSelections({});
                setCurrentAssigningGuestIndex(0);
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
                    <div className="flex items-center gap-3">
                        {(step !== 'choice' && paidGuests.length === 0) && (
                            <Button variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10 rounded-full bg-slate-50 mr-1 hover:bg-slate-100">
                                <ArrowLeft className="h-5 w-5 text-slate-500" />
                            </Button>
                        )}
                        <div className="flex flex-col text-left">
                            <SheetTitle className="text-xl font-black uppercase text-slate-900 leading-none">
                                {step === 'equally' ? 'Split Equally' : step === 'by-item' ? 'Split by Item' : 'Split Bill'}
                            </SheetTitle>
                            {step === 'by-item' && (
                                <p className="text-[10px] font-bold text-[#0069B1] uppercase mt-1 tracking-widest">
                                    {byItemStep === 'guests-count' ? 'Guest Setup' : 
                                    byItemStep === 'assigning' ? `Assigning Guest ${currentAssigningGuestIndex + 1}` : 
                                    byItemStep === 'summary' ? 'Review Splits' : 'Settlement Queue'}
                                </p>
                            )}
                        </div>
                    </div>
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
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total Due</p>
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
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Divide total among guests</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#0069B1] group-hover:translate-x-1 transition-all" />
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
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Select specific items per guest</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-[#0069B1] group-hover:translate-x-1 transition-all" />
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
                                            <span className="text-xl font-black text-slate-900 tabular-nums">${totalAmount.toFixed(2)}</span>
                                            <span className="text-[9px] font-black text-[#0069B1]">{Math.round(progressValue)}%</span>
                                        </div>
                                        <div className="px-2">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div 
                                                    className="h-full bg-[#0069B1] transition-all duration-1000 ease-out"
                                                    style={{ width: `${progressValue}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="space-y-6 pt-2">
                                <div className={cn(
                                    "transition-all duration-500 transform origin-top",
                                    isScrolled ? "opacity-0 scale-95 pointer-events-none h-0 overflow-hidden" : "opacity-100 scale-100"
                                )}>
                                    <div className="p-[1.5px] bg-gradient-to-br from-[#0069B1] via-sky-400 to-orange-300 rounded-[20px]">
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
                                                    <span className="text-5xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">${totalAmount.toFixed(2)}</span>
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
                                                        className="h-full bg-gradient-to-r from-orange-400 to-[#0069B1] transition-all duration-1000 ease-out"
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
                                        <span className="text-4xl font-black tabular-nums leading-none tracking-tight">${perPersonAmount.toFixed(2)}</span>
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
                                                            <p className="text-[11px] font-black text-slate-700 uppercase leading-none">${perPersonAmount.toFixed(2)}</p>
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
                        <div className="pt-4 space-y-6">
                            {byItemStep === 'guests-count' && (
                                <div className="space-y-8 py-8 text-center animate-in fade-in duration-500">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase">How many guests?</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select total splitting parties</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-10">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                                            className="h-20 w-20 rounded-3xl border-2 border-slate-100 text-slate-900 hover:bg-[#0069B1]/5 hover:border-[#0069B1]/30 active:scale-90"
                                        >
                                            <Minus className="h-8 w-8 stroke-[3]" />
                                        </Button>
                                        <span className="text-8xl font-black text-[#0069B1] tabular-nums tracking-tighter">{splitCount}</span>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setSplitCount(splitCount + 1)}
                                            className="h-20 w-20 rounded-3xl border-2 border-[#0069B1] bg-[#0069B1] text-white hover:bg-[#0069B1]/90 shadow-xl active:scale-90"
                                        >
                                            <Plus className="h-8 w-8 stroke-[3]" />
                                        </Button>
                                    </div>
                                    <Button 
                                        onClick={() => setByItemStep('assigning')}
                                        className="w-full h-16 bg-[#0069B1] hover:bg-[#0069B1]/90 text-white text-lg font-black rounded-2xl shadow-xl uppercase"
                                    >
                                        Next: Assign Items
                                    </Button>
                                </div>
                            )}

                            {byItemStep === 'assigning' && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="flex gap-1.5 px-1">
                                        {Array.from({ length: splitCount }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "h-1.5 flex-1 rounded-full transition-all duration-500",
                                                    i < currentAssigningGuestIndex ? "bg-green-600" :
                                                    i === currentAssigningGuestIndex ? "bg-[#0069B1] shadow-[0_0_8px_rgba(0,105,177,0.4)]" :
                                                    "bg-slate-100"
                                                )} 
                                            />
                                        ))}
                                    </div>

                                    {/* Sticky Guest Status Card */}
                                    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm -mx-1 px-1 py-2">
                                        <div className="bg-slate-50/80 p-4 rounded-[1.5rem] border border-slate-200 shadow-sm space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-[#0051B5] text-white rounded-2xl flex items-center justify-center font-black text-lg">
                                                        {currentAssigningGuestIndex + 1}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h3 className="font-black text-base text-slate-900 uppercase leading-none">Guest {currentAssigningGuestIndex + 1} Selection</h3>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">Allocate individual quantities</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-[#0069B1] uppercase tracking-tight">Current Total</p>
                                                    <p className="text-xl font-black text-slate-900 tabular-nums tracking-tighter leading-none mt-1">
                                                        ${currentGuestPreviewTotal.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#0051B5] transition-all duration-500" 
                                                    style={{ width: `${(totalBillAssigned / totalAmount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {cartItems.map(item => {
                                            const totalInCart = item.quantity;
                                            const assignedElsewhere = getAssignedQuantity(item.cartItemId);
                                            const remainingToAssign = totalInCart - assignedElsewhere;
                                            const currentTempQty = tempSelections[item.cartItemId] || 0;
                                            
                                            return (
                                                <div 
                                                    key={item.cartItemId}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                                                        remainingToAssign <= 0 && currentTempQty === 0 ? "bg-slate-50 border-slate-100 opacity-40 pointer-events-none" :
                                                        currentTempQty > 0 ? "bg-white border-[#0069B1] shadow-md" :
                                                        "bg-white border-slate-100"
                                                    )}
                                                >
                                                    <div className="flex flex-col text-left">
                                                        <p className="font-black text-sm text-slate-800 uppercase leading-none">{item.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-1.5">
                                                            <div className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black text-slate-500 uppercase">
                                                                {remainingToAssign} of {totalInCart} Available
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400">${getDisplayPrice(item).toFixed(2)}/ea</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-200">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 rounded-lg text-slate-400"
                                                            onClick={() => setTempSelections(prev => {
                                                                const val = Math.max(0, currentTempQty - 1);
                                                                if (val === 0) {
                                                                    const next = { ...prev };
                                                                    delete next[item.cartItemId];
                                                                    return next;
                                                                }
                                                                return { ...prev, [item.cartItemId]: val };
                                                            })}
                                                            disabled={currentTempQty === 0}
                                                        >
                                                            <Minus className="h-4 w-4 stroke-[3]" />
                                                        </Button>
                                                        <span className="w-4 text-center font-black text-sm tabular-nums">{currentTempQty}</span>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 rounded-lg text-[#0069B1]"
                                                            onClick={() => setTempSelections(prev => ({
                                                                ...prev,
                                                                [item.cartItemId]: Math.min(remainingToAssign, currentTempQty + 1)
                                                            }))}
                                                            disabled={currentTempQty >= remainingToAssign}
                                                        >
                                                            <Plus className="h-4 w-4 stroke-[3]" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button 
                                        onClick={() => {
                                            const nextAssignments = { ...itemAssignments, [currentAssigningGuestIndex]: tempSelections };
                                            setItemAssignments(nextAssignments);
                                            setTempSelections({});
                                            
                                            if (currentAssigningGuestIndex < splitCount - 1) {
                                                setCurrentAssigningGuestIndex(prev => prev + 1);
                                            } else {
                                                setByItemStep('summary');
                                            }
                                        }}
                                        className="w-full h-16 bg-[#0069B1] hover:bg-[#0069B1]/90 text-white font-black text-lg rounded-2xl shadow-xl uppercase tracking-tight flex items-center justify-center gap-2"
                                    >
                                        <span>{currentAssigningGuestIndex === splitCount - 1 ? 'Finish Audit' : 'Confirm & Next Guest'}</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}

                            {byItemStep === 'summary' && (
                                <div className="animate-in fade-in duration-500 pt-4">
                                    <div className="text-center space-y-1 mb-6">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase">Review Splits</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit table # {orderId} assignments</p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {Array.from({ length: splitCount }).map((_, i) => (
                                            <Card key={i} className="rounded-[2rem] border-none bg-white shadow-xl shadow-slate-100 overflow-hidden relative group transition-all duration-300">
                                                <div className="bg-[#0069B1]/5 p-5 flex justify-between items-center border-b border-[#0069B1]/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-[#0069B1] text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-[#0069B1]/20">
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-base text-slate-900 uppercase tracking-tight">Guest {i + 1}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Bill Portion</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xl font-black text-[#0069B1] tabular-nums tracking-tighter">${getGuestTotal(i).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                <div className="p-5 space-y-3">
                                                    {Object.entries(itemAssignments[i] || {}).map(([itemId, qty]) => {
                                                        const item = cartItems.find(ci => ci.cartItemId === itemId);
                                                        return item && qty > 0 && (
                                                            <div key={itemId} className="flex justify-between items-center">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-slate-100 h-6 w-8 rounded-md flex items-center justify-center text-[10px] font-black text-slate-600">
                                                                        {qty}x
                                                                    </div>
                                                                    <span className="text-[11px] font-bold text-slate-700 uppercase">{item.name}</span>
                                                                </div>
                                                                <span className="text-[11px] font-bold text-slate-400 tabular-nums">${(getDisplayPrice(item) * qty).toFixed(2)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {(!itemAssignments[i] || Object.keys(itemAssignments[i]).length === 0) && (
                                                        <div className="flex items-center gap-2 py-4 justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                                            <Receipt className="h-4 w-4 text-slate-300" />
                                                            <p className="text-[10px] font-bold text-slate-400 italic uppercase">No items assigned to this guest</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-5 px-5 py-2">
                                        <Button 
                                            onClick={() => setByItemStep('payment')}
                                            className="w-full h-18 bg-[#0069B1] hover:bg-[#0069B1]/90 text-white font-black text-lg rounded-[1.5rem] shadow-2xl shadow-[#0069B1]/30 uppercase tracking-tight flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                                        >
                                            <span>Confirm & Create Payments</span>
                                            <ArrowRight className="h-6 w-6" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                                setByItemStep('assigning');
                                                setCurrentAssigningGuestIndex(0);
                                                setItemAssignments({});
                                                setTempSelections({});
                                            }}
                                            className="w-full h-10 mt-1 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-[#E54360]"
                                        >
                                            Reset All Assignments
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {byItemStep === 'payment' && (
                                <div className="space-y-6 pt-2 animate-in fade-in duration-500">
                                    <div className="p-[1.5px] bg-gradient-to-br from-[#0069B1] via-sky-400 to-orange-300 rounded-[2rem] shadow-xl">
                                        <Card className="relative overflow-hidden rounded-[2rem] p-6 border-none bg-white space-y-4 shadow-none">
                                            <div className="text-center space-y-1">
                                                <div className="bg-[#0069B1]/10 w-fit mx-auto px-4 py-1.5 rounded-full flex items-center gap-2 mb-2 border border-[#0069B1]/10">
                                                    <Landmark className="h-3 w-3 text-[#0069B1]" />
                                                    <span className="text-[9px] font-black text-[#0069B1] uppercase tracking-widest">Grand Table Settlement</span>
                                                </div>
                                                <div className="flex items-baseline justify-center gap-1.5">
                                                    <span className="text-6xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">${totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[10px] font-black text-slate-700 uppercase">Settlement Progress</span>
                                                    <span className="text-[10px] font-black text-[#0069B1]">{Math.round(progressValue)}% Complete</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-[#0069B1] to-sky-400 transition-all duration-1000 ease-out"
                                                        style={{ width: `${progressValue}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <h3 className="text-[11px] font-black text-slate-900 uppercase px-2 tracking-[0.2em] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-[#0069B1] animate-pulse" />
                                            SETTLEMENT QUEUE
                                        </h3>
                                        <div className="space-y-3">
                                            {Array.from({ length: splitCount }).map((_, index) => {
                                                const isPaid = paidGuests.includes(index);
                                                const guestTotal = getGuestTotal(index);
                                                
                                                return (
                                                    <Card key={index} className={cn(
                                                        "flex items-center justify-between p-5 rounded-[2rem] border-none shadow-lg transition-all duration-300",
                                                        isPaid ? "bg-slate-50 shadow-none opacity-50 grayscale" : "bg-white shadow-slate-100 hover:shadow-xl hover:translate-y-[-2px] cursor-default"
                                                    )}>
                                                        <div className="flex items-center gap-5">
                                                            <div className={cn(
                                                                "h-14 w-14 rounded-2xl flex items-center justify-center border transition-colors",
                                                                isPaid ? "bg-slate-100 border-slate-200 text-slate-400" : "bg-[#0069B1]/5 border-[#0069B1]/10 text-[#0069B1]"
                                                            )}>
                                                                <User className="h-7 w-7" />
                                                            </div>
                                                            <div className="space-y-1 text-left">
                                                                <p className="text-base font-black text-slate-900 leading-none">Guest {index + 1}</p>
                                                                <p className={cn(
                                                                    "text-sm font-black tabular-nums leading-none mt-1",
                                                                    isPaid ? "text-slate-400" : "text-[#0069B1]"
                                                                )}>${guestTotal.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        {isPaid ? (
                                                            <div className="flex items-center gap-1.5 text-green-600 font-black uppercase text-[10px] px-5 py-2.5 bg-green-50 rounded-2xl border border-green-100">
                                                                <Check className="h-4 w-4 stroke-[4]" />
                                                                <span>SETTLED</span>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => setTipDetails({ isOpen: true, amount: guestTotal, guestIndex: index })}
                                                                className="h-14 px-8 rounded-2xl font-black uppercase text-xs bg-[#0069B1] hover:bg-[#0069B1]/90 text-white shadow-xl shadow-[#0069B1]/20 active:scale-95 transition-all flex items-center gap-2"
                                                            >
                                                                <CreditCard className="h-4 w-4" />
                                                                PAY
                                                            </button>
                                                        )}
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

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
