
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Hash, LayoutGrid, Users, Minus, Plus, X, Search } from 'lucide-react';
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
    return ALL_TABLES.filter(t => 
      t.id.toLowerCase().includes(search)
    ).slice(0, 8); // Keep list manageable for a dropdown
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
        "flex-grow flex flex-col items-center justify-start px-6 transition-all duration-300 pt-12"
      )}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenGuestSheet();
          }} 
          className="w-full relative"
        >
          <div className="text-center w-full max-w-sm mx-auto relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 mb-1">Enter Table ID</p>
            <div className="relative">
              <Input
                type="text"
                placeholder="0000"
                maxLength={5}
                value={tableNumber}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                onChange={(e) => setTableNumber(e.target.value)}
                className={cn(
                  "text-center font-bold border-none focus-visible:ring-0 bg-transparent placeholder:text-slate-100 uppercase tabular-nums tracking-tighter transition-all duration-300 h-32 text-7xl"
                )}
                autoFocus
              />
              
              {/* Dropdown Popup for Suggestions */}
              {suggestions.length > 0 && tableNumber.length > 0 && (
                <div className="absolute top-[80%] left-0 right-0 z-50 mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-2 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest p-3 text-left">Quick Matches</p>
                    {suggestions.map((table) => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => handleSuggestionClick(table)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-slate-50 active:scale-[0.98] text-left border border-transparent",
                          table.isOccupied ? "bg-red-50/30" : "bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-3 w-3 rounded-full shadow-sm",
                            table.isOccupied ? "bg-red-500" : "bg-green-500"
                          )} />
                          <span className="font-black text-lg text-slate-900 uppercase tracking-tighter">Table {table.id}</span>
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                          table.isOccupied 
                            ? "bg-red-50 text-red-600 border-red-100" 
                            : "bg-green-50 text-green-600 border-green-100"
                        )}>
                          {table.isOccupied ? 'Occupied' : 'Available'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
