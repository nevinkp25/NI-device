
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Hash, LayoutGrid, Users, Minus, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { OrderStepper } from '@/components/order-stepper';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ALL_TABLES, type TableData } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function OrderByTablePage() {
  const [tableNumber, setTableNumber] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const suggestions = useMemo(() => {
    if (!tableNumber.trim()) return [];
    const search = tableNumber.toLowerCase();
    // Increased limit to 20 to support larger table counts as requested
    return ALL_TABLES.filter(t => 
      t.id.toLowerCase().includes(search)
    ).slice(0, 20);
  }, [tableNumber]);

  const handleOpenGuestSheet = (id?: string) => {
    const finalId = id || tableNumber.trim();
    if (finalId) {
      const tableObj = ALL_TABLES.find(t => t.id.toUpperCase() === finalId.toUpperCase());
      if (tableObj?.isOccupied) {
        router.push(`/order-status?table=${tableObj.id}`);
        return;
      }
      setIsGuestSheetOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Empty Table ID',
        description: 'Please enter a valid table ID to proceed.',
      });
    }
  };

  const handleFinalConfirm = () => {
    router.push(`/menu?table=${tableNumber.toUpperCase() || 'MANUAL'}&guests=${guestCount}`);
  };

  const handleSuggestionClick = (table: TableData) => {
    setTableNumber(table.id);
    handleOpenGuestSheet(table.id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background shadow-sm border-b">
        <div className="flex items-center px-4 pt-4 pb-2">
          <Link href="/navigation" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold mx-auto uppercase tracking-tight text-slate-900">Identify Table</h1>
          <div className="w-10"></div>
        </div>
        <OrderStepper currentStep={1} />
      </header>

      <main className={cn(
        "flex-grow flex flex-col items-center justify-start px-6 pb-40 transition-all duration-300",
        isInputFocused ? "pt-4" : "pt-12"
      )}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenGuestSheet();
          }} 
          className="w-full space-y-2"
        >
          <div className="text-center w-full max-w-sm mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 mb-1">Enter Table ID</p>
            <Input
              type="text"
              placeholder="0000"
              maxLength={5}
              value={tableNumber}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onChange={(e) => setTableNumber(e.target.value)}
              className={cn(
                "text-center font-bold border-none focus-visible:ring-0 bg-transparent placeholder:text-slate-100 uppercase tabular-nums tracking-tighter transition-all duration-300",
                isInputFocused ? "text-5xl h-20" : "text-7xl h-32"
              )}
              autoFocus
            />

            {/* Professional Grid Layout for handling many tables (10-20+) */}
            <div className={cn(
              "grid gap-3 transition-all duration-300 w-full",
              isInputFocused ? "grid-cols-3 mt-4 mb-6" : "grid-cols-2 mt-8 mb-10 min-h-[160px]"
            )}>
              {suggestions.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => handleSuggestionClick(table)}
                  className={cn(
                    "rounded-2xl border-2 font-bold uppercase transition-all shadow-sm active:scale-95 animate-in fade-in zoom-in-95 duration-200 flex items-center justify-center",
                    isInputFocused ? "h-14 text-sm" : "h-20 text-lg",
                    table.isOccupied 
                      ? "bg-destructive/5 border-destructive/10 text-destructive shadow-destructive/5" 
                      : "bg-white border-primary/10 text-primary hover:border-primary shadow-slate-100"
                  )}
                >
                  {table.id}
                </button>
              ))}
            </div>
          </div>
        </form>
      </main>

      {/* Keyboard-Aware Floating Switcher */}
      <div className={cn(
        "fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-in-out",
        isInputFocused ? "bottom-32 sm:bottom-40 opacity-80" : "bottom-6"
      )}>
        <div className="bg-slate-900/95 text-white rounded-full p-0.5 shadow-2xl flex items-center gap-0.5 border border-white/10 backdrop-blur-md">
           <div className="h-9 px-4 rounded-full bg-primary text-white flex items-center gap-2 shadow-inner">
            <Hash className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Manual</span>
          </div>
          <Link href="/table-selection" passHref>
            <Button 
              variant="ghost" 
              className="h-9 px-4 rounded-full text-white/50 hover:text-white flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Grid</span>
            </Button>
          </Link>
        </div>
      </div>

      <Sheet open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-8 border-primary shadow-2xl" hideCloseButton>
          <SheetHeader className="p-4 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-3 text-left">
               <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-lg font-bold uppercase tracking-tight">Table {tableNumber.toUpperCase()}</SheetTitle>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Initialization</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsGuestSheetOpen(false)} className="h-10 w-10 rounded-full bg-muted">
               <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <div className="p-8 space-y-6">
             <div className="space-y-4 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cover Count</p>
                <div className="flex items-center justify-center gap-8">
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-16 w-16 rounded-2xl border-2 border-primary text-primary hover:bg-primary/5"
                   >
                      <Minus className="h-8 w-8 stroke-[3]" />
                   </Button>
                   <span className="text-6xl font-bold min-w-[100px] text-primary tabular-nums tracking-tighter">{guestCount}</span>
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="h-16 w-16 rounded-2xl border-2 border-primary text-primary hover:bg-primary/5"
                   >
                      <Plus className="h-8 w-8 stroke-[3]" />
                   </Button>
                </div>
             </div>
          </div>

          <SheetFooter className="p-4 bg-background border-t">
             <Button 
                onClick={handleFinalConfirm}
                className="w-full h-16 text-2xl font-bold bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-transform uppercase tracking-tighter"
             >
                Confirm Covers
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
