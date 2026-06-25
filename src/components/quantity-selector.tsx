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
    <div className={cn("flex items-center justify-between w-full bg-slate-50 p-1 rounded-xl gap-2", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
            "h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-90",
            quantity === 1 && "text-destructive border-destructive/20 bg-destructive/[0.02]"
        )} 
        onClick={(e) => { e.stopPropagation(); onDecrease(); }}
      >
        {quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </Button>
      
      <span className="text-base font-bold min-w-[1.5rem] text-center text-slate-800 tabular-nums">
        {quantity}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-200 text-primary hover:bg-slate-50 active:scale-90" 
        onClick={(e) => { e.stopPropagation(); onIncrease(); }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}