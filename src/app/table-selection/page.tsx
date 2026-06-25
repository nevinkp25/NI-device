
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin, Users, Plus, Minus, X } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background border-b-2">
        <div className="flex items-center p-3 border-b-2 border-slate-50">
          <Link href="/navigation" passHref>
            <Button variant="outline" className="h-10 w-10 rounded-full border-2 border-primary">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-black mx-auto uppercase tracking-tighter">SELECT TABLE</h1>
          <div className="w-10"></div>
        </div>
        <OrderStepper currentStep={1} />
        
        {/* Sticky Secondary Navigation */}
        <div className="bg-background/95 backdrop-blur-md p-3 space-y-3 shadow-sm">
          <section className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground font-black px-1">
              <MapPin className="h-3 w-3" />
              <span className="text-[9px] tracking-widest uppercase">Select Floor</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {FLOORS.map((floor) => (
                <Button
                  key={floor.id}
                  onClick={() => {
                      setSelectedFloor(floor.id);
                      setSearchQuery('');
                  }}
                  variant={selectedFloor === floor.id ? 'default' : 'outline'}
                  className={cn(
                    "h-10 px-5 text-sm font-black rounded-xl border-2 transition-all shrink-0",
                    selectedFloor === floor.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                      : "border-primary/20 text-primary bg-white"
                  )}
                >
                  {floor.name}
                </Button>
              ))}
            </div>
          </section>

          <section className="relative">
            <Input
              type="text"
              placeholder="FIND TABLE (e.g. T1001)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-10 text-base font-black border-2 border-primary rounded-xl placeholder:text-muted-foreground/30 shadow-sm uppercase"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          </section>
        </div>
      </header>

      <main className="p-3 flex-grow pb-10">
        <section className="grid grid-cols-2 gap-3">
          {filteredTables.map((table) => (
            <Button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={cn(
                "h-28 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1",
                table.isOccupied 
                  ? "bg-slate-50 text-slate-300 border-slate-100"
                  : "bg-white text-primary border-primary/30 shadow-sm active:bg-primary active:text-white"
              )}
            >
              <span className="text-2xl font-black uppercase">{table.id}</span>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                table.isOccupied
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-green-50 text-green-600 border-green-100"
              )}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </Button>
          ))}
          {filteredTables.length === 0 && (
            <div className="col-span-2 py-8 text-center text-muted-foreground font-bold uppercase text-xs">
              No tables found
            </div>
          )}
        </section>
      </main>

      <Sheet open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2rem] border-t-4 border-primary shadow-2xl" hideCloseButton>
          <SheetHeader className="p-4 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-xl font-black uppercase tracking-tighter">Table {tempSelectedTable?.id}</SheetTitle>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">New Order</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsGuestSheetOpen(false)} className="h-10 w-10 rounded-full bg-slate-100">
               <X className="h-6 w-6" />
            </Button>
          </SheetHeader>

          <div className="p-6 space-y-6">
             <div className="space-y-4 text-center">
                <p className="text-lg font-black text-slate-500 uppercase tracking-widest">How many guests?</p>
                <div className="flex items-center justify-center gap-6">
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-20 w-20 rounded-2xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Minus className="h-10 w-10 stroke-[4]" />
                   </Button>
                   <span className="text-6xl font-black min-w-[90px] text-[#0051B5] tabular-nums">{guestCount}</span>
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="h-20 w-20 rounded-2xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Plus className="h-10 w-10 stroke-[4]" />
                   </Button>
                </div>
             </div>
          </div>

          <SheetFooter className="p-4 border-t border-slate-50 bg-white">
             <Button 
                onClick={handleGoToMenu}
                className="w-full h-20 text-3xl font-black bg-primary text-white rounded-2xl shadow-xl active:scale-95 transition-transform uppercase"
             >
                GO TO MENU
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
