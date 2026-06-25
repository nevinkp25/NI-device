
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
  f1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  f2: ['20', '21', '22', '23', '24', '25'],
  vip: ['V1', 'V2', 'V3'],
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
        <div className="flex items-center p-6 border-b-2 border-slate-50">
          <Link href="/navigation" passHref>
            <Button variant="outline" className="h-14 w-14 rounded-full border-2 border-primary">
              <ArrowLeft className="h-8 w-8" />
            </Button>
          </Link>
          <h1 className="text-3xl font-black mx-auto uppercase tracking-tighter">SELECT TABLE</h1>
          <div className="w-14"></div>
        </div>
        <OrderStepper currentStep={1} />
      </header>

      <main className="p-6 space-y-8 flex-grow pb-40">
        {/* Floor Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground font-black">
            <MapPin className="h-6 w-6" />
            <span className="text-xl">WHERE ARE YOU?</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {FLOORS.map((floor) => (
              <Button
                key={floor.id}
                onClick={() => {
                    setSelectedFloor(floor.id);
                    setSearchQuery('');
                }}
                variant={selectedFloor === floor.id ? 'default' : 'outline'}
                className={cn(
                  "h-20 text-2xl font-black rounded-2xl border-4 transition-all",
                  selectedFloor === floor.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-primary/20 text-primary"
                )}
              >
                {floor.name}
              </Button>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section className="relative">
          <Input
            type="text"
            placeholder="SEARCH TABLE #"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-20 pl-16 text-3xl font-black border-4 border-primary rounded-2xl placeholder:text-muted-foreground/30"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
        </section>

        {/* Table Grid */}
        <section className="grid grid-cols-3 gap-4">
          {filteredTables.map((table) => (
            <Button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={cn(
                "h-24 text-4xl font-black rounded-2xl border-4 transition-all",
                selectedTable === table
                  ? "bg-accent text-accent-foreground border-accent scale-105 shadow-xl"
                  : "bg-white text-primary border-primary shadow-sm"
              )}
            >
              {table}
            </Button>
          ))}
        </section>
      </main>

      {/* Action Footer */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] p-6 bg-background border-t-4 border-primary">
        <Button
          onClick={handleContinue}
          disabled={!selectedTable}
          className="w-full h-24 text-4xl font-black bg-primary text-primary-foreground rounded-2xl shadow-2xl disabled:opacity-20"
        >
          {selectedTable ? `START TABLE ${selectedTable}` : 'SELECT A TABLE'}
        </Button>
      </footer>
    </div>
  );
}
