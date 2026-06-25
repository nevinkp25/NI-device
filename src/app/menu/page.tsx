
"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils, ArrowLeft, LayoutGrid, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
          {tableNumber ? `Table ${tableNumber}` : 'Menu'}
        </h1>
        <button onClick={() => setIsWaiterProfileOpen(true)} className="cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
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
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const { cartItems } = useCart();

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);
  const activeCategoryName = foodCategories.find(c => c.id === activeCategory)?.name || '';

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsCategorySheetOpen(false);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <Suspense fallback={<div>Loading header...</div>}>
        <MenuHeader />
      </Suspense>

      {/* Categories Navigation */}
      <nav className="sticky top-[112px] z-40 bg-white/60 backdrop-blur-md py-4 px-4 border-b flex items-center gap-3">
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
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 uppercase tracking-wide",
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-md ring-2 ring-primary/20"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                {category.name}
                {hasItemsInCart && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-in zoom-in-50 duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="p-4 pb-48 animate-in fade-in duration-500">
        <div className="mb-6 px-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeCategoryName}
            </h2>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
                {filteredItems.length} options available
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
            <p className="text-slate-400 font-medium">No items in this category yet.</p>
          </div>
        )}
      </main>

      <FloatingCartButton />

      {/* Category Selection Bottom Sheet */}
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="bottom" className="h-auto p-0 rounded-t-[2rem] border-t-0 bg-slate-50" hideCloseButton>
          <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-3 mb-1" />
          <SheetHeader className="p-5 flex-row items-center justify-between bg-white border-b rounded-t-[2rem]">
            <div className="flex items-center gap-4 text-left">
               <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5 text-slate-600" />
               </div>
               <div>
                  <SheetTitle className="text-lg font-bold text-slate-900">Categories</SheetTitle>
                  <p className="text-xs text-slate-500">Jump to a section</p>
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
                    "w-full h-14 text-base font-semibold rounded-xl justify-between px-5 transition-all",
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
