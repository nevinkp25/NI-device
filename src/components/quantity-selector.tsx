
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
};

export function QuantitySelector({ quantity, onIncrease, onDecrease, className }: QuantitySelectorProps) {
  return (
    <div className={cn("flex items-center justify-between w-full bg-slate-50 p-1.5 rounded-2xl gap-4", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
            "h-11 w-11 rounded-xl bg-white shadow-sm border border-slate-200 transition-all active:scale-90",
            quantity === 1 
              ? "text-red-500 border-red-100 bg-red-50/50 hover:bg-red-50" 
              : "text-slate-500 hover:bg-slate-50"
        )} 
        onClick={(e) => { e.stopPropagation(); onDecrease(); }}
      >
        {quantity === 1 ? <Trash2 className="h-5 w-5 stroke-[2.5]" /> : <Minus className="h-5 w-5 stroke-[2.5]" />}
      </Button>
      
      <span className="text-2xl font-black min-w-[2rem] text-center text-slate-900 tabular-nums tracking-tighter">
        {quantity}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-11 w-11 rounded-xl bg-white shadow-sm border border-primary/20 text-primary hover:bg-primary/5 active:scale-90" 
        onClick={(e) => { e.stopPropagation(); onIncrease(); }}
      >
        <Plus className="h-5 w-5 stroke-[2.5]" />
      </Button>
    </div>
  );
}
