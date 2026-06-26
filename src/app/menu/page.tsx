
"use client";

import { useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils, Home, LayoutGrid, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { WaiterProfileDialog } from '@/components/waiter-profile-dialog';
import { OrderStepper } from '@/components/order-stepper';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/cart-context';

function MenuHeader() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');
  const [isWaiterProfileOpen, setIsWaiterProfileOpen] = useState(false);

  return (
    <>
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <header className="flex items-center p-4">
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="text-slate-900 h-12 w-12 hover:bg-slate-100">
            <Home className="h-7 w-7" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold mx-auto flex items-center gap-2 text-slate-900 tracking-tight uppercase">
          {tableNumber ? `Table ${tableNumber}` : 'Current Order'}
        </h1>
        <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer active:scale-95 transition-transform">
          <Avatar className="h-12 w-12 border-2 border-primary shadow-sm">
            {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Staff" />}
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
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItems } = useCart();

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchQuery) return matchesSearch;
      return matchesCategory;
    });
  }, [activeCategory, searchQuery]);

  const activeCategoryName = foodCategories.find(c => c.id === activeCategory)?.name || '';

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsCategorySheetOpen(false);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery('');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Suspense fallback={<div>Loading header...</div>}>
        <MenuHeader />
      </Suspense>

      {/* Section Navigation - Optimized for Visibility */}
      <nav className="sticky top-[128px] z-40 bg-white py-4 px-4 border-b flex items-center gap-3 shadow-md">
        {!isSearchOpen ? (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsCategorySheetOpen(true)}
              className="h-14 w-14 shrink-0 rounded-2xl border-slate-400 text-slate-900 bg-white shadow-sm hover:border-primary active:scale-95"
            >
              <LayoutGrid className="h-7 w-7" />
            </Button>
            
            <div className="flex space-x-3 overflow-x-auto no-scrollbar flex-grow py-1">
              {foodCategories.map((category) => {
                const hasItemsInCart = cartItems.some(item => item.category === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "relative px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 tracking-wide",
                      activeCategory === category.id
                        ? "bg-primary text-white shadow-xl ring-2 ring-primary/20 scale-105"
                        : "bg-white border-2 border-slate-300 text-slate-900 hover:border-slate-500"
                    )}
                  >
                    {category.name}
                    {hasItemsInCart && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full border-2 border-white shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSearch}
              className="h-14 w-14 shrink-0 rounded-2xl border-slate-400 text-slate-900 bg-white shadow-sm hover:border-primary active:scale-95"
            >
              <Search className="h-7 w-7" />
            </Button>
          </>
        ) : (
          <div className="flex items-center w-full gap-3 animate-in slide-in-from-right-4 duration-300">
             <div className="relative flex-grow">
               <Input 
                autoFocus
                placeholder="Find item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-400 text-lg font-bold text-slate-900 focus-visible:ring-primary/20"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-900" />
             </div>
             <Button variant="ghost" size="sm" onClick={toggleSearch} className="text-sm font-bold uppercase text-slate-900 tracking-widest px-4 h-14">
                Cancel
             </Button>
          </div>
        )}
      </nav>

      <main className="p-4 pb-48 animate-in fade-in duration-500">
        <div className="mb-6 px-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">
                {searchQuery ? `Search: ${searchQuery}` : activeCategoryName}
            </h2>
            <div className="h-1.5 w-16 bg-primary rounded-full mt-2 mb-1" />
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
            </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="bg-white p-10 rounded-full shadow-md">
                <Utensils className="h-16 w-16 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold uppercase text-sm tracking-widest">No matching items found</p>
          </div>
        )}
      </main>

      <FloatingCartButton />

      {/* Section Selection Bottom Sheet - High Visibility */}
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-0 bg-slate-50 z-[110]" hideCloseButton>
          <div className="mx-auto w-16 h-2 bg-slate-300 rounded-full mt-4 mb-2" />
          <SheetHeader className="p-6 flex-row items-center justify-between bg-white border-b rounded-t-[2rem] shadow-sm">
            <div className="flex items-center gap-4 text-left">
               <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <LayoutGrid className="h-7 w-7 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-2xl font-bold text-slate-900 uppercase tracking-tight">MENU SECTIONS</SheetTitle>
                  <p className="text-sm text-slate-600 font-bold uppercase tracking-widest">Select to navigate</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCategorySheetOpen(false)} className="h-12 w-12 rounded-full bg-slate-100">
               <X className="h-7 w-7" />
            </Button>
          </SheetHeader>

          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
            {foodCategories.map((category) => {
              const hasItemsInCart = cartItems.some(item => item.category === category.id);
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "w-full h-20 text-lg font-bold rounded-2xl justify-between px-8 transition-all uppercase tracking-tight border-2",
                    activeCategory === category.id 
                      ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" 
                      : "text-slate-900 bg-white border-slate-300 hover:border-slate-500"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span>{category.name}</span>
                    {hasItemsInCart && (
                      <span className="h-4 w-4 bg-red-600 rounded-full shadow-md ring-2 ring-white" />
                    )}
                  </div>
                  {activeCategory === category.id && <Check className="h-7 w-7 stroke-[4]" />}
                </Button>
              );
            })}
          </div>
          <div className="h-12 bg-slate-50" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
