

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Users, Equal, Box, X, User } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    onSplitByItem: () => void;
    baseReturnUrl: string; // e.g., /checkout or /order-status
}

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, onSplitByItem, baseReturnUrl }: SplitBillSheetProps) {
    const [step, setStep] = useState<'initial' | 'byAmount'>('initial');
    const [splitCount, setSplitCount] = useState(2);
    const [paidGuests, setPaidGuests] = useState<number[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    useEffect(() => {
        if (isOpen) {
            const paidGuestIndex = searchParams.get('paidGuest');
            if (paidGuestIndex) {
                setStep('byAmount');
                const index = parseInt(paidGuestIndex, 10);
                if (!paidGuests.includes(index)) {
                    setPaidGuests(prev => [...prev, index]);
                }
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('paidGuest');
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [isOpen, searchParams, paidGuests]);

    const handleSplitByItemClick = () => {
        onOpenChange(false);
        onSplitByItem();
    }
    
    const handleSplitByAmount = () => {
        setStep('byAmount');
    }
    
    const allGuestsPaid = paidGuests.length > 0 && paidGuests.length === splitCount;

    useEffect(() => {
        if (allGuestsPaid && isOpen) {
            clearCart();
            router.push('/navigation');
            resetState();
            onOpenChange(false);
        }
    }, [allGuestsPaid, isOpen, router, onOpenChange, clearCart]);

    const perPersonAmount = totalAmount / splitCount;

    const handlePayForSplit = (guestIndex: number) => {
        const returnUrl = `${baseReturnUrl}?paidGuest=${guestIndex}`;
        const amountToPay = totalAmount - (paidGuests.length * perPersonAmount);
        const currentSplitAmount = Math.min(perPersonAmount, amountToPay);
        router.push(`/payment-method?amount=${currentSplitAmount}&returnUrl=${encodeURIComponent(returnUrl)}`);
        onOpenChange(false); 
    }

    const resetState = () => {
        setStep('initial');
        setSplitCount(2);
        setPaidGuests([]);
    }

    const handleSheetChange = (open: boolean) => {
        if (!open) {
            const isPaying = window.location.search.includes('amount=');
            if (!isPaying) {
                resetState();
            }
        }
        onOpenChange(open);
    }
    
    useEffect(() => {
        setPaidGuests([]);
    }, [splitCount]);


    return (
        <Sheet open={isOpen} onOpenChange={handleSheetChange}>
            <SheetContent side="bottom" className="h-auto flex flex-col rounded-t-lg p-0" hideCloseButton>
                <SheetHeader className="p-4 border-b flex-row items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <Users className="h-6 w-6 text-primary"/>
                        <SheetTitle>Split the Bill</SheetTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}><X className="h-5 w-5"/></Button>
                </SheetHeader>
                
                <div className="p-4">
                    <div className="text-center mb-6">
                        <p className="text-muted-foreground">Total Amount</p>
                        <h2 className="text-5xl font-bold text-primary">${totalAmount.toFixed(2)}</h2>
                    </div>

                    {step === 'initial' && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in-0 duration-300">
                            <Button variant="outline" className="h-24 flex-col text-lg" onClick={handleSplitByItemClick}>
                                <Box className="h-8 w-8 mb-1"/>
                                Split by Item
                            </Button>
                            <Button variant="outline" className="h-24 flex-col text-lg" onClick={handleSplitByAmount}>
                                <Equal className="h-8 w-8 mb-1"/>
                                Split Equally
                            </Button>
                        </div>
                    )}

                    {step === 'byAmount' && (
                        <div className="space-y-4 animate-in fade-in-0 duration-300">
                             <p className="text-center text-muted-foreground font-semibold">Split between how many people?</p>
                            <Card className="flex items-center justify-between p-2">
                                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => setSplitCount(Math.max(2, splitCount - 1))} disabled={splitCount <= 2}>
                                    <Minus className="h-6 w-6" />
                                </Button>
                                <div className="text-center">
                                    <p className="font-bold text-4xl">{splitCount}</p>
                                    <p className="text-sm text-muted-foreground">people</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => setSplitCount(splitCount + 1)}>
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
                    )}
                </div>

                <SheetFooter className="p-4 border-t">
                    {step === 'byAmount' && (
                        <Button variant="outline" onClick={() => setStep('initial')} className="w-full">
                           Back
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
