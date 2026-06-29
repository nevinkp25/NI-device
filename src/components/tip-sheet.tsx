
"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { CreditCard, X, Pen, Landmark, MoreHorizontal, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

    const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');

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
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-auto flex flex-col rounded-t-[2.5rem] border-t-0 p-0 shadow-2xl z-[110]" hideCloseButton>
                <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-4 shrink-0" />
                
                <SheetHeader className="p-6 flex-row items-center justify-between border-b bg-white">
                    <div className="flex items-center gap-4 text-left">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-xl font-bold uppercase">Payment Audit</SheetTitle>
                            <p className="text-xs font-bold text-slate-400 uppercase leading-none">Final Settlement Review</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-10 w-10 rounded-full bg-slate-50">
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </SheetHeader>

                <div className="flex-grow p-6 space-y-8 pb-12 overflow-y-auto no-scrollbar">
                    {/* Waiter Info Section */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={waiterImage?.imageUrl} alt="Waiter" />
                            <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Service Staff</p>
                            <p className="text-base font-bold text-slate-900 leading-tight">David R.</p>
                            <p className="text-[10px] font-bold text-primary uppercase leading-none">Staff ID: #{staffId}</p>
                        </div>
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">Settlement Amount</p>
                        <p className="text-6xl font-bold text-slate-900 tabular-nums tracking-tighter">
                            <span className="text-2xl mr-1 opacity-40">AED</span>{billAmount.toFixed(2)}
                        </p>
                    </div>

                    {/* Tip Selection Grid */}
                    <div className="space-y-4">
                        <p className="text-center text-xs font-bold text-slate-400 uppercase">Add Gratuity</p>
                        <div className="grid grid-cols-4 gap-3">
                            {tipOptions.map(opt => (
                                <Button 
                                    key={opt.value}
                                    variant="ghost"
                                    onClick={() => handleTipSelection(opt.value)}
                                    className={cn(
                                        "h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all",
                                        selectedTip === opt.value && !showCustomTip
                                            ? "bg-primary text-white border-primary shadow-lg scale-[1.02]"
                                            : "bg-white border-slate-100 text-slate-900 hover:border-primary/20"
                                    )}
                                >
                                    <span className="text-[10px] font-bold uppercase opacity-60">AED</span>
                                    <span className="text-lg font-bold">{opt.label}</span>
                                </Button>
                            ))}
                            <Button 
                                variant="ghost"
                                onClick={handleCustomTipClick}
                                className={cn(
                                    "h-16 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all",
                                    showCustomTip
                                        ? "bg-primary text-white border-primary shadow-lg scale-[1.02]"
                                        : "bg-white border-slate-100 text-slate-900 hover:border-primary/20"
                                )}
                            >
                                <Pen className={cn("h-5 w-5", showCustomTip ? "text-white" : "text-slate-400")} />
                                <span className="text-[8px] font-bold uppercase">Custom</span>
                            </Button>
                        </div>
                    </div>

                    {showCustomTip && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <Input 
                                type="number"
                                placeholder="Enter custom AED amount"
                                value={customTip}
                                onChange={(e) => setCustomTip(e.target.value)}
                                className="h-16 text-center text-2xl font-bold border-2 border-primary/20 rounded-2xl bg-primary/5 focus-visible:ring-primary/20"
                                autoFocus
                            />
                        </div>
                    )}
                    
                    {/* Summary Card */}
                    <Card className="p-5 space-y-4 bg-slate-900 text-white rounded-[2rem] shadow-xl border-none">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="opacity-40 uppercase">Bill Amount</span>
                            <span className="tabular-nums">AED {billAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="opacity-40 uppercase">Gratuity</span>
                            <span className={cn("tabular-nums", tipAmount > 0 ? "text-green-400" : "opacity-40")}>
                                + AED {tipAmount.toFixed(2)}
                            </span>
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold opacity-40 uppercase leading-none mb-1">Total Authorized</span>
                            <span className="text-3xl font-bold tabular-nums text-white">AED {totalAmount.toFixed(2)}</span>
                        </div>
                    </Card>
                </div>

                <SheetFooter className="p-6 pt-2 border-t bg-white flex flex-col gap-3 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            onClick={() => handlePayment('card')} 
                            className="h-16 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 uppercase"
                        >
                            <CreditCard className="h-5 w-5" />
                            Pay by Card
                        </Button>
                        <Button 
                            onClick={() => handlePayment('cash')} 
                            className="h-16 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 uppercase"
                        >
                            <Landmark className="h-5 w-5" />
                            Pay by Cash
                        </Button>
                    </div>
                    <Button 
                        variant="ghost"
                        className="w-full h-12 text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        Other Options
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
