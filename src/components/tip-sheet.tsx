
"use client";

import * as React from "react";
import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CreditCard, X, Pen } from 'lucide-react';
import { Card } from '@/components/ui/card';


const TipIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" fillOpacity="0.1"/>
        <path d="M8 12H16M8 12C8 10.9391 8.42143 9.92172 9.17157 9.17157C9.92172 8.42143 10.9391 8 12 8C13.0609 8 14.0783 8.42143 14.8284 9.17157C15.5786 9.92172 16 10.9391 16 12M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


interface TipSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    billAmount: number;
    onPaymentConfirmed: (finalAmount: number) => void;
}

export function TipSheet({ isOpen, onOpenChange, billAmount, onPaymentConfirmed }: TipSheetProps) {
    const [tipPercentage, setTipPercentage] = useState(0);
    const [customTip, setCustomTip] = useState('');
    const [showCustomTip, setShowCustomTip] = useState(false);
    
    const tipAmount = useMemo(() => {
        if (showCustomTip) {
            return parseFloat(customTip) || 0;
        }
        return billAmount * tipPercentage;
    }, [billAmount, tipPercentage, customTip, showCustomTip]);
    
    const totalAmount = billAmount + tipAmount;

    const tipOptions = [
        { label: '5%', value: 0.05 },
        { label: '10%', value: 0.10 },
        { label: '15%', value: 0.15 },
        { label: '20%', value: 0.20 },
    ];
    
    const handleTipSelection = (value: number) => {
        if (tipPercentage === value && !showCustomTip) {
            // If the same tip button is clicked again, deselect it.
            setTipPercentage(0);
        } else {
            setTipPercentage(value);
        }
        setShowCustomTip(false);
        setCustomTip('');
    };

    const handleCustomTipClick = () => {
        // If custom tip is already active, clicking it again does nothing special yet.
        // If switching from a percentage tip, reset it.
        if (!showCustomTip) {
            setTipPercentage(0);
            setShowCustomTip(true);
        }
    };
    
    const resetTips = () => {
        setTipPercentage(0);
        setShowCustomTip(false);
        setCustomTip('');
    }

    const handlePayNow = () => {
        onPaymentConfirmed(totalAmount);
        onOpenChange(false);
    };

    React.useEffect(() => {
        if(isOpen) {
            resetTips();
        }
    }, [isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-auto flex flex-col rounded-t-lg p-0" hideCloseButton={true}>
                <SheetHeader className="p-4 border-b flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TipIcon />
                        <SheetTitle className="text-lg font-semibold">Add a tip for your waiter</SheetTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
                        <X className="h-5 w-5" />
                    </Button>
                </SheetHeader>
                <div className="flex-grow p-4">
                    <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">Your share</p>
                        <p className="text-4xl font-bold">AED {billAmount.toFixed(2)}</p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {tipOptions.map(opt => (
                            <Button 
                                key={opt.value}
                                variant={tipPercentage === opt.value && !showCustomTip ? 'default' : 'outline'}
                                onClick={() => handleTipSelection(opt.value)}
                                className="h-12 text-base"
                            >
                               {opt.label}
                            </Button>
                        ))}
                         <Button 
                            variant={showCustomTip ? 'default' : 'outline'}
                            onClick={handleCustomTipClick}
                            className="h-12 text-base"
                            size="icon"
                        >
                           <Pen className="h-6 w-6"/>
                        </Button>
                    </div>

                    {showCustomTip && (
                        <div className="animate-in fade-in-0 duration-300 mb-4">
                            <Input 
                                type="number"
                                placeholder="Enter custom tip amount in AED"
                                value={customTip}
                                onChange={(e) => setCustomTip(e.target.value)}
                                className="h-12 text-center text-lg"
                            />
                        </div>
                    )}
                    
                    <Card className="p-4 space-y-3 bg-muted/50">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Bill Amount</span>
                            <span className="font-semibold text-primary">AED {billAmount.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tip</span>
                            <span className="font-semibold text-primary">AED {tipAmount.toFixed(2)}</span>
                        </div>
                         <Separator />
                        <div className="flex justify-between items-center font-bold text-base">
                            <span >Your Total</span>
                            <span className="text-primary">AED {totalAmount.toFixed(2)}</span>
                        </div>
                    </Card>

                </div>
                <SheetFooter className="p-4 border-t bg-background space-y-3">
                    <Button onClick={handlePayNow} className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                        <CreditCard className="mr-2"/>
                        Pay Now (AED {totalAmount.toFixed(2)})
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
