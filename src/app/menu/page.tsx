"use client";

import { useState, Suspense, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils, ArrowLeft, LayoutGrid, Check, X, Search, Home, Command, SearchCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderStepper } from '@/components/order-stepper';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/cart-context';

function MenuHeader({ isScrolled, scrollDirection }: { isScrolled: boolean, scrollDirection: 'up' | 'down' }) {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');
  const isVisible = scrollDirection === 'up';

  return (
    <div className="bg-white">
      <header className="flex items-center p-3 h-16">
        <Link href="/order-by-table" passHref>
          <Button variant="ghost" size="icon" className="text-slate-900 h-10 w-10 hover:bg-slate-100">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex flex-col items-center mx-auto">
            <h1 className="text-sm font-black flex items-center gap-2 text-slate-900 tracking-tight uppercase">
            {tableNumber ? `Table ${tableNumber}` : 'Current Order'}
            </h1>
        </div>
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100 text-slate-900 border-2 border-primary/20 hover:bg-slate-200 shadow-sm">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <div className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden",
        isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
      )}>
        <OrderStepper currentStep={2} />
      </div>

      <div className={cn(
        "transition-all duration-500 ease-in-out overflow-hidden",
        (isScrolled && isVisible) ? "max-h-20 opacity-100 py-1 translate-y-0" : "max-h-0 opacity-0 py-0 -translate-y-2"
      )}>
          <OrderStepper currentStep={2} compact />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>(foodCategories[0].id);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const { cartItems } = useCart();
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll listener to manage sticky behavior and scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      
      // Increased threshold to prevent layout feedback-loop shaking
      setIsScrolled(scrollPos > 80);

      // Determine direction with a buffer to avoid jitter
      if (Math.abs(scrollPos - lastScrollY.current) > 8) {
        const direction = scrollPos > lastScrollY.current ? 'down' : 'up';
        setScrollDirection(direction);
      }
      
      lastScrollY.current = scrollPos > 0 ? scrollPos : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll the active category into view
  useEffect(() => {
    if (!isSearchOpen && activeCategory) {
      const element = document.getElementById(`nav-item-${activeCategory}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [activeCategory, isSearchOpen]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      return item.category === activeCategory;
    });
  }, [activeCategory]);

  const searchResults = useMemo(() => {
    if (!searchQuery) {
        return [];
    }
    const q = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.description?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeCategoryName = foodCategories.find(c => c.id === activeCategory)?.name || '';

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsCategorySheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const displayItems = isSearchOpen && searchQuery ? searchResults : filteredItems;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
        <Suspense fallback={<div className="h-16 bg-white" />}>
          <MenuHeader isScrolled={isScrolled} scrollDirection={scrollDirection} />
        </Suspense>

        {/* INTEGRATED NAVIGATION BAR */}
        <nav className="bg-white/95 backdrop-blur-md py-2 px-4 border-b flex items-center gap-2 shadow-sm min-h-[56px]">
          {!isSearchOpen ? (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsCategorySheetOpen(true)}
                className="h-10 w-10 shrink-0 rounded-xl border-slate-200 text-slate-900 bg-white shadow-sm hover:border-primary active:scale-95"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              
              <div 
                ref={navRef}
                className="flex space-x-2 overflow-x-auto no-scrollbar flex-grow py-1 scroll-smooth"
              >
                {foodCategories.map((category) => {
                  const hasItemsInCart = cartItems.some(item => item.category === category.id);
                  return (
                    <button
                      key={category.id}
                      id={`nav-item-${category.id}`}
                      onClick={() => handleCategorySelect(category.id)}
                      className={cn(
                        "relative px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap transition-all duration-300 tracking-[0.1em] uppercase",
                        activeCategory === category.id
                          ? "bg-primary text-white shadow-md ring-2 ring-primary/10"
                          : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {category.name}
                      {hasItemsInCart && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-600 rounded-full border border-white shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 shrink-0 rounded-xl border-slate-200 text-slate-900 bg-white shadow-sm hover:border-primary active:scale-95"
              >
                <Search className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        autoFocus
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 pl-10 pr-4 bg-slate-100/50 border-none rounded-xl focus-visible:ring-primary/20 text-sm font-bold placeholder:text-slate-400"
                    />
                </div>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                    }}
                    className="h-10 px-3 text-xs font-bold text-primary uppercase hover:bg-primary/5 active:scale-95 transition-all"
                >
                    Cancel
                </Button>
            </div>
          )}
        </nav>
      </div>

      <main className="p-4 pb-48 animate-in fade-in duration-500 min-h-screen">
        <div className="mb-4 px-1">
            {isSearchOpen && searchQuery ? (
              <>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    Search Results
                </h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Found {searchResults.length} matches for "{searchQuery}"
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    {activeCategoryName}
                </h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {filteredItems.length} items in this section
                </p>
              </>
            )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))
          ) : (
            isSearchOpen && searchQuery && (
              <div className="col-span-2 py-20 text-center space-y-6">
                 <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl border-2 border-slate-100/50">
                    <SearchCode className="h-10 w-10 text-slate-300" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Results Found</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-[200px] mx-auto">
                        Try searching for ingredients like "Wagyu", "Pizza", or "Spicy".
                    </p>
                 </div>
              </div>
            )
          )}
        </div>
      </main>

      <FloatingCartButton />

      {/* Section Selection Bottom Sheet */}
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2rem] border-t-0 bg-slate-50 z-[100]" hideCloseButton>
          <div className="mx-auto w-10 h-1 bg-slate-200 rounded-full mt-3 mb-1" />
          <SheetHeader className="p-4 flex-row items-center justify-between bg-white border-b rounded-t-[1.5rem] shadow-sm">
            <div className="flex items-center gap-3 text-left">
               <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-primary" />
               </div>
               <div>
                  <SheetTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">MENU SECTIONS</SheetTitle>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Quick Navigation</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCategorySheetOpen(false)} className="h-10 w-10 rounded-full bg-slate-100">
               <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
            {foodCategories.map((category) => {
              const hasItemsInCart = cartItems.some(item => item.category === category.id);
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "w-full h-14 text-sm font-black rounded-xl justify-between px-6 transition-all uppercase tracking-tight border",
                    activeCategory === category.id 
                      ? "bg-primary text-white border-primary shadow-md" 
                      : "text-slate-900 bg-white border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span>{category.name}</span>
                    {hasItemsInCart && (
                      <span className="h-2 w-2 bg-red-600 rounded-full shadow-sm ring-2 ring-white" />
                    )}
                  </div>
                  {activeCategory === category.id && <Check className="h-5 w-5 stroke-[4]" />}
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
