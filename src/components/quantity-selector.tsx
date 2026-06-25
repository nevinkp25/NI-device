import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-between w-full bg-muted p-2 rounded-2xl gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
            "h-14 w-14 rounded-xl border-2 border-primary text-primary bg-background",
            quantity === 1 && "border-destructive text-destructive"
        )} 
        onClick={(e) => { e.stopPropagation(); onDecrease(); }}
      >
        {quantity === 1 ? <Trash2 className="h-8 w-8" /> : <Minus className="h-8 w-8" />}
      </Button>
      <span className="text-3xl font-black min-w-[3rem] text-center">{quantity}</span>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-14 w-14 rounded-xl border-2 border-primary text-primary bg-background" 
        onClick={(e) => { e.stopPropagation(); onIncrease(); }}
      >
        <Plus className="h-8 w-8" />
      </Button>
    </div>
  );
}