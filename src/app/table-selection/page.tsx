
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Users, Plus, Minus, X, LayoutGrid, Check, Hash } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OrderStepper } from '@/components/order-stepper';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { TABLES_BY_FLOOR, ALL_TABLES, type TableData } from '@/lib/data';

const FLOORS = [
  { id: 'f1', name: 'MAIN FLOOR' },
  { id: 'f2', name: 'TERRACE' },
  { id: 'vip', name: 'VIP LOUNGE' },
];

export default function TableSelectionPage() {
  const router = useRouter();
  const [selectedFloor, setSelectedFloor] = useState('f1');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [tempSelectedTable, setTempSelectedTable] = useState<TableData | null>(null);
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);
  const [isFloorSheetOpen, setIsFloorSheetOpen] = useState(false);

  const tables = TABLES_BY_FLOOR[selectedFloor] || [];
  
  const filteredTables = searchQuery 
    ? ALL_TABLES.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : tables;

  const handleTableClick = (table: TableData) => {
    if (table.isOccupied) {
      router.push(`/order-status?table=${table.id}`);
    } else {
      setTempSelectedTable(table);
      setGuestCount(1);
      setIsGuestSheetOpen(true);
    }
  };

  const handleGoToMenu = () => {
    if (tempSelectedTable) {
      router.push(`/menu?table=${tempSelectedTable.id}&guests=${guestCount}`);
    }
  };

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* CONSOLIDATED STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-background shadow-sm border-b">
        <header className="flex items-center px-4 pt-4 pb-2">
          <Link href="/navigation" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <h1 className="text-xl font-black mx-auto uppercase tracking-tighter">GRID VIEW</h1>
          <div className="w-10"></div>
        </header>
        
        <OrderStepper currentStep={1} />
        
        {/* Floor Selection & Search Pills */}
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsFloorSheetOpen(true)}
                className="h-10 w-10 shrink-0 rounded-full border-2 border-primary text-primary"
            >
                <LayoutGrid className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-grow">
              {FLOORS.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => {
                      setSelectedFloor(floor.id);
                      setSearchQuery('');
                  }}
                  className={cn(
                    "h-10 px-6 text-[11px] font-black rounded-full transition-all shrink-0 uppercase tracking-tight",
                    selectedFloor === floor.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-[#F3F4F6] text-[#4B5563] hover:bg-slate-200"
                  )}
                >
                  {floor.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="SEARCH TABLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-10 pr-4 text-xs font-black border-none bg-[#F9FAFB] rounded-full placeholder:text-[#9CA3AF] uppercase shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          </div>
        </div>
      </div>

      <main className="p-4 flex-grow pb-32">
        <section className="grid grid-cols-2 gap-3">
          {filteredTables.map((table) => (
            <Button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={cn(
                "h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 shadow-sm",
                table.isOccupied 
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-white text-primary border-primary/5 active:bg-primary active:text-white"
              )}
            >
              <span className="text-xl font-black uppercase">{table.id}</span>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                table.isOccupied
                  ? "bg-destructive/20 text-destructive border-destructive/30"
                  : "bg-green-50 text-green-600 border-green-200"
              )}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </Button>
          ))}
        </section>
      </main>

      {/* MINIMAL FLOATING SWITCHER - CONDENSED & AT BOTTOM */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 scale-90 sm:scale-100">
        <div className="bg-slate-900/95 text-white rounded-full p-0.5 shadow-2xl flex items-center gap-0.5 border border-white/10 backdrop-blur-md">
          <Link href="/order-by-table" passHref>
            <Button 
              variant="ghost" 
              className="h-8 px-3 rounded-full text-white/50 hover:text-white flex items-center gap-1.5"
            >
              <Hash className="h-3.5 w-3.5" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Manual</span>
            </Button>
          </Link>
          <div className="h-8 px-3 rounded-full bg-primary text-white flex items-center gap-1.5 shadow-inner">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Grid</span>
          </div>
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
                  <SheetTitle className="text-lg font-black uppercase tracking-tighter">Table {tempSelectedTable?.id}</SheetTitle>
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
                onClick={handleGoToMenu}
                className="w-full h-16 text-2xl font-black bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-transform uppercase tracking-tighter"
             >
                GO TO MENU
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Floor Selection Sheet */}
      <Sheet open={isFloorSheetOpen} onOpenChange={setIsFloorSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-8 border-primary shadow-2xl" hideCloseButton>
            <SheetHeader className="p-4 border-b flex-row items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <LayoutGrid className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <SheetTitle className="text-lg font-black uppercase tracking-tighter">SELECT FLOOR</SheetTitle>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsFloorSheetOpen(false)} className="h-10 w-10 rounded-full bg-muted">
                    <X className="h-5 w-5" />
                </Button>
            </SheetHeader>
            <div className="p-3 space-y-2">
                {FLOORS.map((floor) => (
                    <Button
                        key={floor.id}
                        variant={selectedFloor === floor.id ? "default" : "outline"}
                        onClick={() => {
                            setSelectedFloor(floor.id);
                            setSearchQuery('');
                            setIsFloorSheetOpen(false);
                        }}
                        className={cn(
                            "w-full h-16 text-lg font-black rounded-2xl justify-between px-6 transition-all uppercase tracking-tight",
                            selectedFloor === floor.id ? "bg-primary text-white" : "border-2 border-slate-100"
                        )}
                    >
                        <span>{floor.name}</span>
                        {selectedFloor === floor.id && <Check className="h-5 w-5 stroke-[4]" />}
                    </Button>
                ))}
            </div>
            <div className="h-6" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
