
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
    <div className={cn("flex items-center justify-between w-full bg-slate-100 p-1.5 rounded-2xl gap-2", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
            "h-11 w-11 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600 active:scale-90 transition-transform",
            quantity === 1 && "text-destructive border-destructive/20 bg-destructive/5"
        )} 
        onClick={(e) => { e.stopPropagation(); onDecrease(); }}
      >
        {quantity === 1 ? <Trash2 className="h-5 w-5" /> : <Minus className="h-5 w-5 stroke-[3]" />}
      </Button>
      
      <span className="text-2xl font-black min-w-[2.5rem] text-center text-slate-900 tabular-nums">
        {quantity}
      </span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-11 w-11 rounded-xl bg-white shadow-sm border border-slate-200 text-primary active:scale-90 transition-transform" 
        onClick={(e) => { e.stopPropagation(); onIncrease(); }}
      >
        <Plus className="h-5 w-5 stroke-[3]" />
      </Button>
    </div>
  );
}
