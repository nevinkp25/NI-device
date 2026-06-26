
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
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <header className="flex items-center p-4">
        <Link href="/order-by-table" passHref>
          <Button variant="ghost" size="icon" className="text-slate-600">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold mx-auto flex items-center gap-2 text-slate-900 tracking-tight uppercase">
          {tableNumber ? `Table ${tableNumber}` : 'Order'}
        </h1>
        <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
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
      
      // If searching, we show matches from all categories or prioritize current?
      // Usually, in POS, global search is better.
      if (searchQuery) return matchesSearch;
      return matchesCategory;
    });
  }, [activeCategory, searchQuery]);

  const activeCategoryName = foodCategories.find(c => c.id === activeCategory)?.name || '';

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsCategorySheetOpen(false);
    setSearchQuery(''); // Clear search when switching sections
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery('');
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <Suspense fallback={<div>Loading header...</div>}>
        <MenuHeader />
      </Suspense>

      {/* Sections Navigation */}
      <nav className="sticky top-[112px] z-40 bg-white/60 backdrop-blur-md py-4 px-4 border-b flex items-center gap-2">
        {!isSearchOpen ? (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsCategorySheetOpen(true)}
              className="h-10 w-10 shrink-0 rounded-full border-slate-200 text-slate-600 bg-white shadow-sm"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            
            <div className="flex space-x-2.5 overflow-x-auto no-scrollbar flex-grow py-1">
              {foodCategories.map((category) => {
                const hasItemsInCart = cartItems.some(item => item.category === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "relative px-5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all duration-200 uppercase tracking-widest",
                      activeCategory === category.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {category.name}
                    {hasItemsInCart && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full border border-white animate-in zoom-in-50 duration-300" />
                    )}
                  </button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSearch}
              className="h-10 w-10 shrink-0 rounded-full border-slate-200 text-slate-600 bg-white shadow-sm"
            >
              <Search className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <div className="flex items-center w-full gap-2 animate-in slide-in-from-right-4 duration-300">
             <div className="relative flex-grow">
               <Input 
                autoFocus
                placeholder="Search Item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-full bg-white border-slate-200 text-sm font-medium focus-visible:ring-primary/20 uppercase tracking-tight"
               />
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             </div>
             <Button variant="ghost" size="sm" onClick={toggleSearch} className="text-[10px] font-bold uppercase text-slate-500 tracking-widest px-2">
                Cancel
             </Button>
          </div>
        )}
      </nav>

      <main className="p-4 pb-48 animate-in fade-in duration-500">
        <div className="mb-6 px-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                {searchQuery ? `Search: ${searchQuery}` : activeCategoryName}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
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
            <div className="bg-white p-6 rounded-full shadow-sm">
                <Utensils className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">No matching items found</p>
          </div>
        )}
      </main>

      <FloatingCartButton />

      {/* Section Selection Bottom Sheet */}
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2.5rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton>
          <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 mb-1" />
          <SheetHeader className="p-5 flex-row items-center justify-between bg-white border-b rounded-t-[2rem]">
            <div className="flex items-center gap-4 text-left">
               <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-slate-600" />
               </div>
               <div>
                  <SheetTitle className="text-lg font-bold text-slate-900 uppercase tracking-tight">Sections</SheetTitle>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Jump to a section</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCategorySheetOpen(false)} className="h-10 w-10 rounded-full bg-slate-100">
               <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {foodCategories.map((category) => {
              const hasItemsInCart = cartItems.some(item => item.category === category.id);
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "w-full h-14 text-sm font-bold rounded-xl justify-between px-5 transition-all uppercase tracking-tight",
                    activeCategory === category.id 
                      ? "bg-primary/5 text-primary border-none" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span>{category.name}</span>
                    {hasItemsInCart && (
                      <span className="h-2 w-2 bg-red-500 rounded-full shadow-sm" />
                    )}
                  </div>
                  {activeCategory === category.id && <Check className="h-5 w-5 stroke-[2.5]" />}
                </Button>
              );
            })}
          </div>
          <div className="h-8 bg-slate-50" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
