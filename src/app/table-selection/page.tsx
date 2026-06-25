
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
      <header className="sticky top-0 z-20 bg-background">
        <div className="flex items-center p-4 border-b-2 border-slate-50">
          <Link href="/navigation" passHref>
            <Button variant="outline" className="h-14 w-14 rounded-full border-2 border-primary">
              <ArrowLeft className="h-8 w-8" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black mx-auto uppercase tracking-tighter">SELECT TABLE</h1>
          <div className="w-14"></div>
        </div>
        <OrderStepper currentStep={1} />
      </header>

      <main className="p-4 space-y-6 flex-grow pb-10">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground font-black px-1">
            <MapPin className="h-5 w-5" />
            <span className="text-sm tracking-widest">WHERE ARE YOU?</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {FLOORS.map((floor) => (
              <Button
                key={floor.id}
                onClick={() => {
                    setSelectedFloor(floor.id);
                    setSearchQuery('');
                }}
                variant={selectedFloor === floor.id ? 'default' : 'outline'}
                className={cn(
                  "h-16 px-8 text-xl font-black rounded-2xl border-4 transition-all shrink-0",
                  selectedFloor === floor.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg" 
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
            className="h-20 pl-14 text-2xl font-black border-4 border-primary rounded-2xl placeholder:text-muted-foreground/30 shadow-sm uppercase"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
        </section>

        <section className="grid grid-cols-2 gap-4">
          {filteredTables.map((table) => (
            <Button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={cn(
                "h-32 rounded-2xl border-4 transition-all flex flex-col items-center justify-center gap-1",
                table.isOccupied 
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-white text-primary border-primary/40 shadow-sm active:bg-primary active:text-white"
              )}
            >
              <span className="text-3xl font-black uppercase">{table.id}</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                table.isOccupied
                  ? "bg-slate-200 text-slate-500 border-slate-300"
                  : "bg-green-100 text-green-700 border-green-200"
              )}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </Button>
          ))}
          {filteredTables.length === 0 && (
            <div className="col-span-2 py-12 text-center text-muted-foreground font-bold uppercase">
              No tables found
            </div>
          )}
        </section>
      </main>

      <Sheet open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-4 border-primary shadow-2xl" hideCloseButton>
          <SheetHeader className="p-6 border-b-2 flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-3xl font-black uppercase tracking-tighter">Table {tempSelectedTable?.id}</SheetTitle>
                  <p className="text-muted-foreground font-bold">New Order Configuration</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsGuestSheetOpen(false)} className="h-14 w-14 rounded-full bg-slate-100">
               <X className="h-8 w-8" />
            </Button>
          </SheetHeader>

          <div className="p-8 space-y-10">
             <div className="space-y-4 text-center">
                <p className="text-2xl font-black text-slate-500 uppercase tracking-widest">How many guests?</p>
                <div className="flex items-center justify-center gap-8">
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="h-24 w-24 rounded-3xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Minus className="h-12 w-12 stroke-[4]" />
                   </Button>
                   <span className="text-8xl font-black min-w-[120px] text-[#0051B5] tabular-nums">{guestCount}</span>
                   <Button 
                      variant="outline" 
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="h-24 w-24 rounded-3xl border-4 border-primary text-primary hover:bg-primary/5"
                   >
                      <Plus className="h-12 w-12 stroke-[4]" />
                   </Button>
                </div>
             </div>
          </div>

          <SheetFooter className="p-6 border-t-4 border-slate-50 bg-white">
             <Button 
                onClick={handleGoToMenu}
                className="w-full h-24 text-4xl font-black bg-primary text-white rounded-3xl shadow-2xl active:scale-95 transition-transform uppercase"
             >
                GO TO MENU
             </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
