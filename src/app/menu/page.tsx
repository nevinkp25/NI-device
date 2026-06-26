
"use client";

import { useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils, ArrowLeft, LayoutGrid, Check, X, Search } from 'lucide-react';
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
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
      <header className="flex items-center p-4">
        <Link href="/order-by-table" passHref>
          <Button variant="ghost" size="icon" className="text-slate-700 h-11 w-11">
            <ArrowLeft className="h-7 w-7" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold mx-auto flex items-center gap-2 text-slate-900 tracking-tight uppercase">
          {tableNumber ? `Table ${tableNumber}` : 'Order'}
        </h1>
        <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer active:scale-95 transition-transform">
          <Avatar className="h-11 w-11 border-2 border-primary/20 shadow-sm">
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

      {/* Sections Navigation */}
      <nav className="sticky top-[124px] z-40 bg-white/95 backdrop-blur-md py-4 px-4 border-b flex items-center gap-3 shadow-sm">
        {!isSearchOpen ? (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsCategorySheetOpen(true)}
              className="h-12 w-12 shrink-0 rounded-2xl border-slate-300 text-slate-700 bg-white shadow-sm hover:border-primary/50"
            >
              <LayoutGrid className="h-6 w-6" />
            </Button>
            
            <div className="flex space-x-3 overflow-x-auto no-scrollbar flex-grow py-1">
              {foodCategories.map((category) => {
                const hasItemsInCart = cartItems.some(item => item.category === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "relative px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 uppercase tracking-wider",
                      activeCategory === category.id
                        ? "bg-primary text-white shadow-lg ring-2 ring-primary/20"
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400"
                    )}
                  >
                    {category.name}
                    {hasItemsInCart && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-white shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSearch}
              className="h-12 w-12 shrink-0 rounded-2xl border-slate-300 text-slate-700 bg-white shadow-sm hover:border-primary/50"
            >
              <Search className="h-6 w-6" />
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
                className="h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-base font-bold text-slate-900 focus-visible:ring-primary/20"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
             </div>
             <Button variant="ghost" size="sm" onClick={toggleSearch} className="text-xs font-black uppercase text-slate-600 tracking-widest px-3 h-12">
                Cancel
             </Button>
          </div>
        )}
      </nav>

      <main className="p-4 pb-48 animate-in fade-in duration-500">
        <div className="mb-6 px-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {searchQuery ? `Search: ${searchQuery}` : activeCategoryName}
            </h2>
            <div className="h-1 w-12 bg-primary rounded-full mt-2 mb-1" />
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
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
            <div className="bg-white p-8 rounded-full shadow-md">
                <Utensils className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching items found</p>
          </div>
        )}
      </main>

      <FloatingCartButton />

      {/* Section Selection Bottom Sheet */}
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton>
          <div className="mx-auto w-16 h-2 bg-slate-300 rounded-full mt-4 mb-2" />
          <SheetHeader className="p-6 flex-row items-center justify-between bg-white border-b rounded-t-[2rem] shadow-sm">
            <div className="flex items-center gap-4 text-left">
               <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <LayoutGrid className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">MENU SECTIONS</SheetTitle>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Select to navigate</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCategorySheetOpen(false)} className="h-12 w-12 rounded-full bg-slate-100">
               <X className="h-6 w-6" />
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
                    "w-full h-16 text-base font-black rounded-2xl justify-between px-6 transition-all uppercase tracking-tight border-2",
                    activeCategory === category.id 
                      ? "bg-primary text-white border-primary shadow-lg" 
                      : "text-slate-700 bg-white border-slate-200 hover:border-slate-400"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span>{category.name}</span>
                    {hasItemsInCart && (
                      <span className="h-3 w-3 bg-red-600 rounded-full shadow-sm ring-2 ring-white" />
                    )}
                  </div>
                  {activeCategory === category.id && <Check className="h-6 w-6 stroke-[4]" />}
                </Button>
              );
            })}
          </div>
          <div className="h-10 bg-slate-50" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
