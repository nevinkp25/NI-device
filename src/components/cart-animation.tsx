
'use client';

import { useEffect, useState } from 'react';

/**
 * CartAnimation Component
 * 
 * Manages flying particles that move from the "Add to Cart" source 
 * to the floating cart button destination.
 */
export function CartAnimation() {
  const [dots, setDots] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleAnimation = (e: any) => {
      const { x, y } = e.detail;
      const id = Date.now();
      setDots((prev) => [...prev, { id, x, y }]);
    };

    window.addEventListener('add-to-cart-animation', handleAnimation as EventListener);
    return () => window.removeEventListener('add-to-cart-animation', handleAnimation as EventListener);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {dots.map((dot) => (
        <Dot
          key={dot.id}
          dot={dot}
          onComplete={(id) => setDots((prev) => prev.filter((d) => d.id !== id))}
        />
      ))}
    </div>
  );
}

function Dot({ dot, onComplete }: { dot: { id: number; x: number; y: number }; onComplete: (id: number) => void }) {
  const [style, setStyle] = useState<React.CSSProperties>({
    left: dot.x,
    top: dot.y,
    transform: 'translate(-50%, -50%)',
    opacity: 1,
  });

  useEffect(() => {
    // Target the specific cart icon element
    const target = document.getElementById('floating-cart-target');
    if (!target) {
      onComplete(dot.id);
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    // Small delay to ensure the initial render is captured before transitioning
    const timer = setTimeout(() => {
      setStyle({
        left: targetX,
        top: targetY,
        transform: 'translate(-50%, -50%) scale(0.2)',
        opacity: 0,
        transition: 'all 0.6s cubic-bezier(0.45, 0, 0.55, 1)',
      });
    }, 50);

    const cleanup = setTimeout(() => onComplete(dot.id), 700);
    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [dot.id, onComplete]);

  return (
    <div
      className="absolute w-6 h-6 bg-primary rounded-full shadow-lg border-2 border-white"
      style={style}
    />
  );
}
