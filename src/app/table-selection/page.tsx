
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OrderStepper } from '@/components/order-stepper';

const FLOORS = [
  { id: 'f1', name: 'MAIN FLOOR' },
  { id: 'f2', name: 'TERRACE' },
  { id: 'vip', name: 'VIP LOUNGE' },
];

const TABLES_BY_FLOOR: Record<string, string[]> = {
  f1: ['T101', 'T102', 'T103', 'T104', 'T105', 'T106', 'T107', 'T108', 'T109', 'T110', 'T111', 'T112'],
  f2: ['T201', 'T202', 'T203', 'T204', 'T205', 'T501', 'T502'],
  vip: ['V1001', 'V1002', 'V1003'],
};

export default function TableSelectionPage() {
  const router = useRouter();
  const [selectedFloor, setSelectedFloor] = useState('f1');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tables = TABLES_BY_FLOOR[selectedFloor] || [];
  const filteredTables = searchQuery 
    ? Object.values(TABLES_BY_FLOOR).flat().filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    : tables;

  const handleContinue = () => {
    if (selectedTable) {
      router.push(`/menu?table=${selectedTable}`);
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

        {/* Table Grid: Massive Buttons */}
        <section className="grid grid-cols-2 gap-4">
          {filteredTables.map((table) => (
            <Button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={cn(
                "h-24 text-3xl font-black rounded-2xl border-4 transition-all",
                selectedTable === table
                  ? "bg-primary text-white border-primary scale-105 shadow-2xl"
                  : "bg-white text-primary border-primary/40 shadow-sm"
              )}
            >
              {table}
            </Button>
          ))}
          {filteredTables.length === 0 && (
            <div className="col-span-2 py-12 text-center text-muted-foreground font-bold">
              NO TABLES FOUND
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
          {selectedTable ? 'GO TO MENU' : 'SELECT A TABLE'}
        </Button>
      </footer>
    </div>
  );
}
