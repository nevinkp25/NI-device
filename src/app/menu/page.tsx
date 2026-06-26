
"use client";

import { useState, Suspense, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils, ArrowLeft, LayoutGrid, Check, X, Search, Home, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderStepper } from '@/components/order-stepper';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/cart-context';

function MenuHeader({ isScrolled }: { isScrolled: boolean }) {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');

  return (
    <div className="bg-white">
      <header className="flex items-center p-3 h-16">
        <Link href="/order-by-table" passHref>
          <Button variant="ghost" size="icon" className="text-slate-900 h-10 w-10 hover:bg-slate-100">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-sm font-black mx-auto flex items-center gap-2 text-slate-900 tracking-tight uppercase">
          {tableNumber ? `Table ${tableNumber}` : 'Current Order'}
        </h1>
        <Link href="/navigation" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-100 text-slate-900 border-2 border-primary/20 hover:bg-slate-200 shadow-sm">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
      )}>
        <OrderStepper currentStep={2} />
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
  const { cartItems } = useCart();
  const navRef = useRef<HTMLDivElement>(null);
  const searchNavRef = useRef<HTMLDivElement>(null);

  // Scroll listener to manage sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll the active category into view
  useEffect(() => {
    if (activeCategory) {
      const element = document.getElementById(`nav-item-${activeCategory}`);
      const searchElement = document.getElementById(`search-nav-item-${activeCategory}`);
      
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
      if (searchElement) {
        searchElement.scrollIntoView({
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
        // If searching but no query, show items in the active category within search overlay
        return menuItems.filter(item => item.category === activeCategory);
    }
    const q = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      (item.name.toLowerCase().includes(q) || 
      item.description?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)) &&
      (activeCategory ? item.category === activeCategory : true)
    );
  }, [searchQuery, activeCategory]);

  const globalSearchResults = useMemo(() => {
    if (!searchQuery) return [];
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
    // Smooth scroll to top when category changes
    if (!isSearchOpen) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* UNIFIED STICKY HEADER BLOCK */}
      <div className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
        <Suspense fallback={<div className="h-16 bg-white" />}>
          <MenuHeader isScrolled={isScrolled} />
        </Suspense>

        {/* Category Navigation */}
        <nav className="bg-white/95 backdrop-blur-md py-2 px-4 border-b flex items-center gap-2 shadow-sm">
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
            onClick={toggleSearch}
            className="h-10 w-10 shrink-0 rounded-xl border-slate-200 text-slate-900 bg-white shadow-sm hover:border-primary active:scale-95"
          >
            <Search className="h-5 w-5" />
          </Button>
        </nav>
      </div>

      {/* FULL SCREEN SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="bg-[#0051B5] text-white p-4 shadow-xl shrink-0">
            <div className="flex items-center gap-3 mb-4">
               <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="text-white hover:bg-white/10 rounded-full">
                  <ArrowLeft className="h-6 w-6" />
               </Button>
               <div>
                  <h2 className="text-lg font-bold tracking-tight uppercase">Smart Search</h2>
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Global Menu Discovery</p>
               </div>
            </div>
            <div className="relative mb-2">
              <Input 
                autoFocus
                placeholder="Dishes, ingredients or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl focus-visible:ring-white/30 text-base font-bold"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>

            {/* Integrated Category Nav in Search */}
            <div 
                ref={searchNavRef}
                className="flex space-x-2 overflow-x-auto no-scrollbar py-2 scroll-smooth"
            >
                {foodCategories.map((category) => {
                    const hasItemsInCart = cartItems.some(item => item.category === category.id);
                    return (
                        <button
                            key={category.id}
                            id={`search-nav-item-${category.id}`}
                            onClick={() => handleCategorySelect(category.id)}
                            className={cn(
                                "relative px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap transition-all duration-300 tracking-[0.1em] uppercase border",
                                activeCategory === category.id
                                    ? "bg-white text-[#0051B5] border-white shadow-md"
                                    : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
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
          </header>

          <main className="flex-grow overflow-y-auto p-4 pb-32 no-scrollbar">
            {searchQuery ? (
              searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Command className="h-3 w-3 text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Found {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} in {activeCategoryName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {searchResults.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Search className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No matching results for "{searchQuery}" in {activeCategoryName}</p>
                  <Button variant="link" onClick={() => setSearchQuery('')} className="text-primary font-bold uppercase text-xs">Clear Search</Button>
                </div>
              )
            ) : (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 px-1">
                    <LayoutGrid className="h-3 w-3 text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Browsing {activeCategoryName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredItems.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
              </div>
            )}
          </main>
          
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none">
             <div className="max-w-[420px] mx-auto pointer-events-auto">
                <Button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="w-full h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold uppercase tracking-tight shadow-lg"
                >
                  Return to Menu
                </Button>
             </div>
          </div>
        </div>
      )}

      <main className="p-4 pb-48 animate-in fade-in duration-500 min-h-screen">
        <div className="mb-4 px-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {activeCategoryName}
            </h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {filteredItems.length} items in this section
            </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
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
