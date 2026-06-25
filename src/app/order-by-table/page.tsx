
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
  const router = useRouter();
  const { toast } = useToast();

  const suggestions = useMemo(() => {
    if (!tableNumber.trim()) return [];
    const search = tableNumber.toLowerCase();
    return ALL_TABLES.filter(t => 
      t.id.toLowerCase().includes(search)
    ).slice(0, 5);
  }, [tableNumber]);

  const handleOpenGuestSheet = (id?: string) => {
    const finalId = id || tableNumber.trim();
    if (finalId) {
      // Check if selected table is occupied
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
        description: 'Please enter a table number.',
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
          <h1 className="text-xl font-black mx-auto uppercase tracking-tighter">TABLE NUMBER</h1>
          <div className="w-10"></div>
        </div>
        <OrderStepper currentStep={1} />
      </header>

      <main className="flex-grow flex flex-col items-center justify-start pt-12 px-6 pb-20">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleOpenGuestSheet();
          }} 
          className="w-full space-y-2"
        >
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1">ENTER ID</p>
            <Input
              type="text"
              placeholder="00000"
              maxLength={5}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="text-center text-7xl h-32 font-black border-none focus-visible:ring-0 bg-transparent placeholder:text-slate-100 uppercase tabular-nums tracking-tighter"
              autoFocus
            />

            {/* Smart Suggestions - Enhanced Spacing */}
            <div className="min-h-[140px] mt-8 mb-10 flex flex-wrap justify-center gap-4">
              {suggestions.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => handleSuggestionClick(table)}
                  className={cn(
                    "px-8 py-4 rounded-2xl border-2 font-black text-lg uppercase transition-all shadow-md active:scale-90 animate-in fade-in zoom-in-95 duration-200",
                    table.isOccupied 
                      ? "bg-destructive/10 border-destructive/20 text-destructive" 
                      : "bg-white border-primary/20 text-primary hover:border-primary shadow-slate-200"
                  )}
                >
                  {table.id}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-20 text-2xl font-black bg-primary text-white rounded-[1.5rem] shadow-xl active:scale-95 transition-transform uppercase tracking-tighter"
            >
              GO TO MENU
            </Button>
          </div>
        </form>
      </main>

      {/* MINIMAL FLOATING SWITCHER - CONDENSED & AT BOTTOM */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 scale-90 sm:scale-100">
        <div className="bg-slate-900/95 text-white rounded-full p-0.5 shadow-2xl flex items-center gap-0.5 border border-white/10 backdrop-blur-md">
           <div className="h-8 px-3 rounded-full bg-primary text-white flex items-center gap-1.5 shadow-inner">
            <Hash className="h-3.5 w-3.5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Manual</span>
          </div>
          <Link href="/table-selection" passHref>
            <Button 
              variant="ghost" 
              className="h-8 px-3 rounded-full text-white/50 hover:text-white flex items-center gap-1.5"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Grid</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Guest Selection Sheet */}
      <Sheet open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-8 border-primary shadow-2xl" hideCloseButton>
          <SheetHeader className="p-4 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-3 text-left">
               <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-lg font-black uppercase tracking-tighter">Table {tableNumber.toUpperCase()}</SheetTitle>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">New Order</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsGuestSheetOpen(false)} className="h-10 w-10 rounded-full bg-muted">
               <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <div className="p-8 space-y-6">
             <div className="space-y-4 text-center">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Guest Count</p>
                <div className="flex items-center justify-center gap-8">
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-16 w-16 rounded-2xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Minus className="h-8 w-8 stroke-[4]" />
                   </Button>
                   <span className="text-6xl font-black min-w-[100px] text-primary tabular-nums tracking-tighter">{guestCount}</span>
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="h-16 w-16 rounded-2xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Plus className="h-8 w-8 stroke-[4]" />
                   </Button>
                </div>
             </div>
          </div>

          <SheetFooter className="p-4 bg-background border-t">
             <Button 
                onClick={handleFinalConfirm}
                className="w-full h-16 text-2xl font-black bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-transform uppercase tracking-tighter"
             >
                GO TO MENU
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
