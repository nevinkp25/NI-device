
"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CreditCard, X, Pen, Landmark, MoreHorizontal, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TipSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    billAmount: number;
    onPaymentConfirmed: (finalAmount: number, method: 'card' | 'cash') => void;
}

export function TipSheet({ isOpen, onOpenChange, billAmount, onPaymentConfirmed }: TipSheetProps) {
    const [selectedTip, setSelectedTip] = useState<number | null>(0);
    const [customTip, setCustomTip] = useState('');
    const [showCustomTip, setShowCustomTip] = useState(false);
    const [staffId, setStaffId] = useState('123456');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const id = localStorage.getItem('staffId');
            if (id) setStaffId(id);
        }
    }, []);

    const tipAmount = useMemo(() => {
        if (showCustomTip) {
            return parseFloat(customTip) || 0;
        }
        return selectedTip || 0;
    }, [selectedTip, customTip, showCustomTip]);
    
    const totalAmount = billAmount + tipAmount;

    const tipOptions = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '20', value: 20 },
    ];
    
    const handleTipSelection = (value: number) => {
        if (selectedTip === value && !showCustomTip) {
            setSelectedTip(0);
        } else {
            setSelectedTip(value);
            setShowCustomTip(false);
            setCustomTip('');
        }
    };

    const handleCustomTipClick = () => {
        setSelectedTip(null);
        setShowCustomTip(!showCustomTip);
        if (!showCustomTip) setCustomTip('');
    };
    
    const resetTips = () => {
        setSelectedTip(0);
        setShowCustomTip(false);
        setCustomTip('');
    }

    const handlePayment = (method: 'card' | 'cash') => {
        onPaymentConfirmed(totalAmount, method);
        onOpenChange(false);
    };

    React.useEffect(() => {
        if(isOpen) {
            resetTips();
        }
    }, [isOpen]);

    return (
        <>
            {/* 
                Manual Overlay to handle nested sheet dimming.
                This ensures that when TipSheet is opened inside another Sheet (like SplitBillSheet),
                the parent interface is correctly focused and dimmed as shown in the requested design.
            */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[105] animate-in fade-in duration-300 backdrop-blur-[2px]" 
                    onClick={() => onOpenChange(false)}
                    aria-hidden="true"
                />
            )}
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="h-auto flex flex-col rounded-t-[2rem] border-t-0 p-0 shadow-2xl z-[110]" hideCloseButton>
                    <div className="mx-auto w-10 h-1 bg-slate-200 rounded-full mt-3 shrink-0" />
                    
                    <SheetHeader className="p-4 flex-row items-center justify-between border-b bg-white">
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <SheetTitle className="text-lg font-bold uppercase">Check Settlement</SheetTitle>
                                <p className="text-xs font-bold text-slate-400 uppercase leading-none">Final Review</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-9 w-9 rounded-full bg-slate-50">
                            <X className="h-4 w-4 text-slate-500" />
                        </Button>
                    </SheetHeader>

                    <div className="flex-grow p-4 space-y-5 pb-8 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-primary uppercase leading-none tracking-tight">Employee ID: #{staffId}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Session Active</p>
                                </div>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className="text-xs font-bold text-slate-400 uppercase leading-none">Check Total</p>
                                <p className="text-2xl font-bold text-slate-900 tabular-nums">AED {billAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase">Add Tips</p>
                            <div className="grid grid-cols-4 gap-2">
                                {tipOptions.map(opt => {
                                    const isActive = selectedTip === opt.value && !showCustomTip;
                                    return (
                                        <div key={opt.value} className="relative">
                                            <Button 
                                                variant="ghost"
                                                onClick={() => handleTipSelection(opt.value)}
                                                className={cn(
                                                    "w-full h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all",
                                                    isActive
                                                        ? "bg-primary/10 text-primary border-primary shadow-sm"
                                                        : "bg-white border-slate-100 text-slate-900"
                                                )}
                                            >
                                                <span className="text-[10px] font-bold uppercase opacity-60 leading-none">AED</span>
                                                <span className="text-base font-bold">{opt.label}</span>
                                            </Button>
                                            {isActive && (
                                                <button 
                                                    className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-10 active:scale-90 transition-transform"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        resetTips();
                                                    }}
                                                >
                                                    <X className="h-3 w-3 stroke-[4]" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <div className="relative">
                                    <Button 
                                        variant="ghost"
                                        onClick={handleCustomTipClick}
                                        className={cn(
                                            "w-full h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all",
                                            showCustomTip
                                                ? "bg-primary/10 text-primary border-primary shadow-sm"
                                                : "bg-white border-slate-100 text-slate-900"
                                        )}
                                    >
                                        <Pen className={cn("h-4 w-4", showCustomTip ? "text-primary" : "text-slate-400")} />
                                        <span className="text-[9px] font-bold uppercase leading-none">Custom</span>
                                    </Button>
                                    {showCustomTip && (
                                        <button 
                                            className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm z-10 active:scale-90 transition-transform"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resetTips();
                                            }}
                                        >
                                            <X className="h-3 w-3 stroke-[4]" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showCustomTip && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                <Input 
                                    type="number"
                                    placeholder="Enter AED Amount"
                                    value={customTip}
                                    onChange={(e) => setCustomTip(e.target.value)}
                                    className="h-12 text-center text-xl font-bold border-2 border-primary/20 rounded-xl bg-primary/5 focus-visible:ring-primary/20"
                                    autoFocus
                                />
                            </div>
                        )}
                        
                        <Card className="p-5 space-y-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold uppercase leading-none">Bill Amount</span>
                                <span className="text-slate-900 font-bold tabular-nums">AED {billAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold uppercase leading-none">Tips</span>
                                <span className={cn("font-bold tabular-nums", tipAmount > 0 ? "text-green-600" : "text-slate-400")}>
                                    + AED {tipAmount.toFixed(2)}
                                </span>
                            </div>
                            <Separator className="bg-slate-50" />
                            <div className="flex justify-between items-end pt-1">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-400 uppercase leading-none">Grand Total</span>
                                </div>
                                <span className="text-3xl font-black text-primary tabular-nums">AED {totalAmount.toFixed(2)}</span>
                            </div>
                        </Card>
                    </div>

                    <SheetFooter className="p-4 pt-2 border-t bg-white flex flex-col gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                        <div className="grid grid-cols-2 gap-2">
                            <Button 
                                onClick={() => handlePayment('card')} 
                                className="h-14 text-sm font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md flex items-center justify-center gap-2 uppercase"
                            >
                                <CreditCard className="h-4 w-4" />
                                Pay by Card
                            </Button>
                            <Button 
                                onClick={() => handlePayment('cash')} 
                                className="h-14 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center justify-center gap-2 uppercase"
                            >
                                <Landmark className="h-4 w-4" />
                                Pay by Cash
                            </Button>
                        </div>
                        <Button 
                            variant="ghost"
                            className="w-full h-10 text-slate-400 font-bold text-[10px] uppercase hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5"
                        >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                            Other Options
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
