
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
      { 
        rootMargin: '-120px 0px -60% 0px', // Adjust for sticky header height
        threshold: 0 
      }
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
    const element = categoryRefs.current[categoryId];
    if (element) {
      const offset = 220; // Height of header + stepper + nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setActiveCategory(categoryId);
  };

  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<div>Loading header...</div>}>
        <MenuHeader />
      </Suspense>

      <nav className="sticky top-[112px] z-40 bg-background/95 backdrop-blur-md py-4 px-4 border-b">
        <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2 no-scrollbar">
          {foodCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabClick(category.id)}
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

      <main className="p-4 pb-48">
        {foodCategories.map((category) => {
          const items = menuItems.filter((item) => item.category === category.id);
          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="pt-10 first:pt-4"
            >
              <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter text-slate-900 border-l-8 border-primary pl-4">
                {category.name}
              </h2>
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
