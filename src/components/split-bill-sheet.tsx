
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface Split {
    id: number;
    amount: number;
    isPaid: boolean;
}

interface SplitBillSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    totalAmount: number;
    onSplitsConfirmed: (splits: Split[]) => void;
}

export function SplitBillSheet({ isOpen, onOpenChange, totalAmount, onSplitsConfirmed }: SplitBillSheetProps) {
    const [splits, setSplits] = useState<Split[]>([{ id: 1, amount: totalAmount, isPaid: false }]);

    useEffect(() => {
        if (isOpen) {
           const initialSplitCount = 2;
           distributeEqually(initialSplitCount);
        }
    }, [isOpen, totalAmount]);

    const distributeEqually = (count: number) => {
        if (count < 1) return;
        const equalAmount = totalAmount / count;
        const newSplits = Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i, // Use a more unique ID
            amount: equalAmount,
            isPaid: false
        }));
        setSplits(newSplits);
    }
    
    const handleSplitCountChange = (newCount: number) => {
        if (newCount < 1) return;
        distributeEqually(newCount);
    };

    const handleRemoveSplit = (idToRemove: number) => {
        if (splits.length <= 1) return;
        const newSplits = splits.filter(s => s.id !== idToRemove);
        const remainingTotal = newSplits.reduce((sum, s) => sum + s.amount, 0);
        const deficit = totalAmount - remainingTotal;

        // Distribute the deficit among remaining splits
        if (newSplits.length > 0) {
            const deficitPerSplit = deficit / newSplits.length;
            setSplits(newSplits.map(s => ({...s, amount: s.amount + deficitPerSplit})));
        }
    };

    const handleAmountChange = (id: number, newAmountStr: string) => {
        const newAmount = parseFloat(newAmountStr) || 0;
        setSplits(prevSplits => 
            prevSplits.map(split => 
                split.id === id ? { ...split, amount: newAmount } : split
            )
        );
    };

    const totalAllocated = useMemo(() => splits.reduce((sum, s) => sum + s.amount, 0), [splits]);
    const remainingToPay = totalAmount - totalAllocated;
    const isFullyAllocated = Math.abs(remainingToPay) < 0.01;

    const handleConfirm = () => {
        onSplitsConfirmed(splits);
    }
    
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>Split Bill</SheetTitle>
                </SheetHeader>
                <div className="flex-grow flex flex-col items-center p-4 overflow-y-auto">
                    <div className='max-w-sm w-full space-y-4'>
                        <div className="text-center">
                            <p className="text-muted-foreground">Total Amount</p>
                            <h2 className="text-5xl font-bold text-primary">${totalAmount.toFixed(2)}</h2>
                        </div>
                        <Card className="flex items-center justify-between p-2">
                            <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => handleSplitCountChange(splits.length - 1)}>
                                <Minus className="h-6 w-6" />
                            </Button>
                            <div className="text-center">
                                <p className="font-bold text-4xl">{splits.length}</p>
                                <p className="text-sm text-muted-foreground">
                                    Ways
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => handleSplitCountChange(splits.length + 1)}>
                                <Plus className="h-6 w-6" />
                            </Button>
                        </Card>
                        
                        <div className='space-y-2'>
                            {splits.map((split, index) => (
                                <div key={split.id} className="flex items-center gap-2">
                                    <span className="font-semibold text-muted-foreground w-20">Pay {index + 1}</span>
                                    <div className='relative flex-grow'>
                                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>$</span>
                                      <Input
                                          type="number"
                                          value={split.amount > 0 ? split.amount.toFixed(2) : ''}
                                          onChange={(e) => handleAmountChange(split.id, e.target.value)}
                                          className="text-right font-mono text-lg h-12 pr-4 pl-8"
                                      />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSplit(split.id)} disabled={splits.length <= 1}>
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                         <Card className="p-3 text-center bg-muted">
                            <p className="text-muted-foreground text-base">Remaining to pay</p>
                            <p className={`font-bold text-3xl ${!isFullyAllocated ? 'text-destructive' : 'text-green-600'}`}>
                                ${remainingToPay.toFixed(2)}
                            </p>
                        </Card>
                    </div>
                </div>
                <SheetFooter className="p-4">
                    <Button onClick={handleConfirm} disabled={!isFullyAllocated} className="w-full h-14 text-lg">
                        Confirm Split
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
