"use client";

import { useRef, useEffect, useState } from 'react';
import { foodCategories, menuItems } from '@/lib/data';
import { FoodCard } from '@/components/food-card';
import { FloatingCartButton } from '@/components/floating-cart-button';
import { Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <header className="p-4 pt-6 text-center">
        <h1 className="text-3xl font-headline font-bold flex items-center justify-center gap-2">
          <Utensils className="text-primary" />
          Food Menu
        </h1>
      </header>

      <nav className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm py-2 px-4 border-b">
        <div className="flex space-x-2 overflow-x-auto pb-2 -mb-2">
          {foodCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabClick(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-300",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground/80 hover:bg-muted/90"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 pb-24">
        {foodCategories.map((category) => {
          const items = menuItems.filter((item) => item.category === category.id);
          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="pt-4"
            >
              <h2 className="text-2xl font-headline font-bold mb-4">{category.name}</h2>
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
