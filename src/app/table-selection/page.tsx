
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Users, Plus, Minus, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OrderStepper } from '@/components/order-stepper';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';

interface TableData {
  id: string;
  isOccupied: boolean;
}

const FLOORS = [
  { id: 'f1', name: 'MAIN FLOOR' },
  { id: 'f2', name: 'TERRACE' },
  { id: 'vip', name: 'VIP LOUNGE' },
];

const TABLES_BY_FLOOR: Record<string, TableData[]> = {
  f1: [
    { id: 'T101', isOccupied: false },
    { id: 'T102', isOccupied: true },
    { id: 'T103', isOccupied: false },
    { id: 'T104', isOccupied: false },
    { id: 'T105', isOccupied: true },
    { id: 'T106', isOccupied: false },
    { id: 'T107', isOccupied: false },
    { id: 'T108', isOccupied: false },
    { id: 'T109', isOccupied: true },
    { id: 'T110', isOccupied: false },
    { id: 'T111', isOccupied: false },
    { id: 'T112', isOccupied: false },
  ],
  f2: [
    { id: 'T201', isOccupied: true },
    { id: 'T202', isOccupied: false },
    { id: 'T203', isOccupied: false },
    { id: 'T204', isOccupied: true },
    { id: 'T205', isOccupied: false },
    { id: 'T501', isOccupied: false },
    { id: 'T502', isOccupied: true },
  ],
  vip: [
    { id: 'V1001', isOccupied: false },
    { id: 'V1002', isOccupied: true },
    { id: 'V1003', isOccupied: false },
  ],
};

export default function TableSelectionPage() {
  const router = useRouter();
  const [selectedFloor, setSelectedFloor] = useState('f1');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [tempSelectedTable, setTempSelectedTable] = useState<TableData | null>(null);
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);

  const tables = TABLES_BY_FLOOR[selectedFloor] || [];
  const allTables = Object.values(TABLES_BY_FLOOR).flat();
  
  const filteredTables = searchQuery 
    ? allTables.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()))
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
      {/* CONSOLIDATED STICKY HEADER MATCHING IMAGE */}
      <div className="sticky top-0 z-50 bg-background shadow-sm border-b">
        <header className="flex items-center px-4 pt-4 pb-2">
          <Link href="/navigation" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <h1 className="text-xl font-black mx-auto uppercase tracking-tighter">SELECT TABLE</h1>
          <div className="w-10"></div>
        </header>
        
        <OrderStepper currentStep={1} />
        
        {/* Floor Selection & Search Pills */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {FLOORS.map((floor) => (
              <button
                key={floor.id}
                onClick={() => {
                    setSelectedFloor(floor.id);
                    setSearchQuery('');
                }}
                className={cn(
                  "h-12 px-8 text-sm font-black rounded-full transition-all shrink-0 uppercase tracking-tight",
                  selectedFloor === floor.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-[#F3F4F6] text-[#4B5563] hover:bg-slate-200"
                )}
              >
                {floor.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="SEARCH TABLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-6 text-base font-bold border-none bg-[#F9FAFB] rounded-full placeholder:text-[#9CA3AF] uppercase shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
          </div>
        </div>
      </div>

      <main className="p-4 flex-grow pb-24">
        <section className="grid grid-cols-2 gap-4">
          {filteredTables.map((table) => (
            <Button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={cn(
                "h-28 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 shadow-sm",
                table.isOccupied 
                  ? "bg-slate-50 text-slate-300 border-slate-100"
                  : "bg-white text-primary border-primary/5 active:bg-primary active:text-white"
              )}
            >
              <span className="text-2xl font-black uppercase">{table.id}</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                table.isOccupied
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-green-50 text-green-600 border-green-200"
              )}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </Button>
          ))}
          {filteredTables.length === 0 && (
            <div className="col-span-2 py-20 text-center text-muted-foreground font-bold uppercase text-sm">
              No tables found
            </div>
          )}
        </section>
      </main>

      {/* Guest Selection Sheet */}
      <Sheet open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[3rem] border-t-8 border-primary shadow-2xl" hideCloseButton>
          <SheetHeader className="p-6 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-4 text-left">
               <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-2xl font-black uppercase tracking-tighter">Table {tempSelectedTable?.id}</SheetTitle>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Setup New Order</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsGuestSheetOpen(false)} className="h-12 w-12 rounded-full bg-muted">
               <X className="h-6 w-6" />
            </Button>
          </SheetHeader>

          <div className="p-10 space-y-10">
             <div className="space-y-6 text-center">
                <p className="text-xl font-black text-slate-400 uppercase tracking-[0.2em]">Guest Count</p>
                <div className="flex items-center justify-center gap-10">
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-20 w-20 rounded-3xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Minus className="h-10 w-10 stroke-[4]" />
                   </Button>
                   <span className="text-8xl font-black min-w-[120px] text-primary tabular-nums tracking-tighter">{guestCount}</span>
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="h-20 w-20 rounded-3xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Plus className="h-10 w-10 stroke-[4]" />
                   </Button>
                </div>
             </div>
          </div>

          <SheetFooter className="p-6 bg-background border-t">
             <Button 
                onClick={handleGoToMenu}
                className="w-full h-20 text-3xl font-black bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-transform uppercase tracking-tighter"
             >
                GO TO MENU
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
