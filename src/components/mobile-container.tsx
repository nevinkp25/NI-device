import type { ReactNode } from 'react';

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="relative w-full max-w-[420px] min-h-screen bg-background shadow-2xl overflow-y-auto">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
