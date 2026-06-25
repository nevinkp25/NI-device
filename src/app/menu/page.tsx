
"use client";

import { useRef, useEffect, useState, Suspense } from 'react';
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
        <Link href="/table-selection" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto flex items-center gap-2">
          <Utensils className="text-primary h-5 w-5" />
          {tableNumber ? `Table ${tableNumber}` : 'Food Menu'}
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
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px', threshold: 0 }
    );

    const currentObserver = observer.current;
    const refs = categoryRefs.current;

    Object.values(refs).forEach((ref) => {
      if (ref) currentObserver.observe(ref);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref) currentObserver.unobserve(ref);
      });
    };
  }, []);

  const handleTabClick = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <MenuHeader />
      </Suspense>

      <nav className="sticky top-[112px] z-40 bg-background/90 backdrop-blur-sm py-3 px-4 border-b">
        <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
          {foodCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabClick(category.id)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all duration-300 uppercase",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground scale-105 shadow-md"
                  : "bg-[#F3F4F6] text-muted-foreground hover:bg-slate-200"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 pb-40">
        {foodCategories.map((category) => {
          const items = menuItems.filter((item) => item.category === category.id);
          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="pt-6"
            >
              <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter text-slate-800">{category.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <FloatingCartButton />
    </div>
  );
}
