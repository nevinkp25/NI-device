
"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WaiterProfileDialog } from '@/components/waiter-profile-dialog';
import { OrderStepper } from '@/components/order-stepper';

function MenuHeader() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');
  const [isWaiterProfileOpen, setIsWaiterProfileOpen] = useState(false);

  return (
    <>
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <header className="flex items-center p-4">
        <Link href="/order-by-table" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="text-primary h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-black mx-auto flex items-center gap-2 uppercase tracking-tighter">
          <Utensils className="text-primary h-5 w-5" />
          {tableNumber ? `Table ${tableNumber}` : 'Menu'}
        </h1>
        <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-primary">
            {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Waiter" />}
            <AvatarFallback>W</AvatarFallback>
          </Avatar>
        </button>
      </header>
      <OrderStepper currentStep={2} />
    </div>
    <WaiterProfileDialog
        isOpen={isWaiterProfileOpen}
        onOpenChange={setIsWaiterProfileOpen}
    />
    </>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>(foodCategories[0].id);

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);
  const activeCategoryName = foodCategories.find(c => c.id === activeCategory)?.name || '';

  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<div>Loading header...</div>}>
        <MenuHeader />
      </Suspense>

      {/* Categories Navigation */}
      <nav className="sticky top-[112px] z-40 bg-background/95 backdrop-blur-md py-4 px-4 border-b">
        <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2 no-scrollbar">
          {foodCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-6 py-3 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 uppercase tracking-widest border-2",
                activeCategory === category.id
                  ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 pb-48 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 border-l-8 border-primary pl-4">
                {activeCategoryName}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 pl-6">
                {filteredItems.length} ITEMS AVAILABLE
            </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Utensils className="h-12 w-12 text-slate-200" />
            <p className="text-slate-500 font-bold uppercase tracking-tighter">No items found in this category.</p>
          </div>
        )}
      </main>

      <FloatingCartButton />
    </div>
  );
}
