
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
      {/* 100% STICKY HEADER BLOCK */}
      <div className="sticky top-0 z-40 bg-background shadow-md">
        <header className="flex items-center p-3 border-b">
          <Link href="/navigation" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <h1 className="text-lg font-black mx-auto uppercase tracking-tighter">SELECT TABLE</h1>
          <div className="w-10"></div>
        </header>
        
        <OrderStepper currentStep={1} />
        
        {/* Condensed Sub-Nav */}
        <div className="bg-background/95 backdrop-blur-md px-3 py-2 border-b flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {FLOORS.map((floor) => (
              <Button
                key={floor.id}
                onClick={() => {
                    setSelectedFloor(floor.id);
                    setSearchQuery('');
                }}
                variant={selectedFloor === floor.id ? 'default' : 'secondary'}
                className={cn(
                  "h-9 px-4 text-xs font-black rounded-full transition-all shrink-0",
                  selectedFloor === floor.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground bg-muted"
                )}
              >
                {floor.name}
              </Button>
            ))}
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="SEARCH TABLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9 text-sm font-bold border-muted bg-muted/50 rounded-lg placeholder:text-muted-foreground/50 uppercase"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <main className="p-3 flex-grow pb-24">
        <section className="grid grid-cols-2 gap-3">
          {filteredTables.map((table) => (
            <Button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={cn(
                "h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1",
                table.isOccupied 
                  ? "bg-slate-50 text-slate-300 border-slate-100"
                  : "bg-white text-primary border-primary/20 shadow-sm active:bg-primary active:text-white"
              )}
            >
              <span className="text-xl font-black uppercase">{table.id}</span>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                table.isOccupied
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-green-50 text-green-600 border-green-200"
              )}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </Button>
          ))}
          {filteredTables.length === 0 && (
            <div className="col-span-2 py-12 text-center text-muted-foreground font-bold uppercase text-xs">
              No results found
            </div>
          )}
        </section>
      </main>

      {/* Guest Selection Sheet */}
      <Sheet open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-4 border-primary shadow-2xl" hideCloseButton>
          <SheetHeader className="p-4 border-b flex-row items-center justify-between">
            <div className="flex items-center gap-3 text-left">
               <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-xl font-black uppercase tracking-tighter">Table {tempSelectedTable?.id}</SheetTitle>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">New Order</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsGuestSheetOpen(false)} className="h-10 w-10 rounded-full bg-muted">
               <X className="h-6 w-6" />
            </Button>
          </SheetHeader>

          <div className="p-8 space-y-6">
             <div className="space-y-4 text-center">
                <p className="text-lg font-black text-slate-500 uppercase tracking-widest">Guest Count</p>
                <div className="flex items-center justify-center gap-8">
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-16 w-16 rounded-2xl border-2 border-primary text-primary hover:bg-primary/5"
                   >
                      <Minus className="h-8 w-8 stroke-[3]" />
                   </Button>
                   <span className="text-6xl font-black min-w-[90px] text-primary tabular-nums">{guestCount}</span>
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
                onClick={handleGoToMenu}
                className="w-full h-16 text-2xl font-black bg-primary text-white rounded-xl shadow-lg active:scale-95 transition-transform uppercase"
             >
                GO TO MENU
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
