
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin, Circle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OrderStepper } from '@/components/order-stepper';

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
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tables = TABLES_BY_FLOOR[selectedFloor] || [];
  
  const allTables = Object.values(TABLES_BY_FLOOR).flat();
  
  const filteredTables = searchQuery 
    ? allTables.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : tables;

  const handleContinue = () => {
    if (selectedTable) {
      if (selectedTable.isOccupied) {
        // If occupied, go to status/payment
        router.push(`/order-status?table=${selectedTable.id}`);
      } else {
        // If free, start new order
        router.push(`/menu?table=${selectedTable.id}`);
      }
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

      <main className="p-4 space-y-6 flex-grow pb-40">
        {/* Floor Selection: Horizontal Scroll */}
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
                    setSelectedTable(null);
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

        {/* Search Bar: Large Targets */}
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

        {/* Legend */}
        <section className="flex items-center justify-around bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
           <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 fill-green-500 text-green-500" />
              <span className="text-sm font-black text-slate-600 uppercase">Available</span>
           </div>
           <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 fill-slate-300 text-slate-300" />
              <span className="text-sm font-black text-slate-600 uppercase">Occupied</span>
           </div>
        </section>

        {/* Table Grid: Massive Buttons */}
        <section className="grid grid-cols-2 gap-4">
          {filteredTables.map((table) => (
            <Button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={cn(
                "h-32 rounded-2xl border-4 transition-all flex flex-col items-center justify-center gap-1",
                selectedTable?.id === table.id
                  ? "bg-primary text-white border-primary scale-105 shadow-2xl"
                  : table.isOccupied 
                    ? "bg-slate-100 text-slate-400 border-slate-200"
                    : "bg-white text-primary border-primary/40 shadow-sm"
              )}
            >
              <span className="text-3xl font-black uppercase">{table.id}</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                selectedTable?.id === table.id 
                  ? "bg-white text-primary border-white"
                  : table.isOccupied
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

      {/* Persistent Action Footer */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-4 bg-background border-t-4 border-primary shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-30">
        <Button
          onClick={handleContinue}
          disabled={!selectedTable}
          className="w-full h-24 text-3xl font-black bg-primary text-primary-foreground rounded-2xl shadow-2xl disabled:opacity-20 active:scale-95 transition-transform uppercase"
        >
          {selectedTable 
            ? selectedTable.isOccupied ? 'CHECK ORDER' : 'GO TO MENU'
            : 'SELECT A TABLE'
          }
        </Button>
      </footer>
    </div>
  );
}
