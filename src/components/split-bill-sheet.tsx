
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Users, Equal, Box, X, User } from 'lucide-react';

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    onSplitByItem: () => void;
}

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, onSplitByItem }: SplitBillSheetProps) {
    const [step, setStep] = useState<'initial' | 'byAmount'>('initial');
    const [splitCount, setSplitCount] = useState(2);
    const router = useRouter();

    const handleSplitByItemClick = () => {
        onOpenChange(false);
        onSplitByItem();
    }
    
    const handleSplitByAmount = () => {
        setStep('byAmount');
    }

    const handlePayForSplit = (amount: number) => {
        const returnUrl = '/checkout'; // Return to checkout to settle the rest
        router.push(`/payment-method?amount=${amount}&returnUrl=${encodeURIComponent(returnUrl)}`);
        onOpenChange(false);
    }

    const resetState = () => {
        setStep('initial');
        setSplitCount(2);
    }

    const handleSheetChange = (open: boolean) => {
        if (!open) {
            resetState();
        }
        onOpenChange(open);
    }

    const perPersonAmount = totalAmount / splitCount;

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
                                {Array.from({ length: splitCount }).map((_, index) => (
                                    <Card key={index} className="flex items-center justify-between p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-muted p-2 rounded-full"><User className="h-5 w-5 text-muted-foreground"/></div>
                                            <div>
                                                <p className="font-semibold">Guest {index + 1}</p>
                                                <p className="text-sm text-muted-foreground">${perPersonAmount.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => handlePayForSplit(perPersonAmount)}>Pay</Button>
                                    </Card>
                                ))}
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
