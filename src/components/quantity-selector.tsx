
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
    <div className="flex items-center justify-center gap-1">
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
            "h-8 w-8 rounded-full border-brand text-brand",
            quantity === 1 && "border-destructive text-destructive"
        )} 
        onClick={onDecrease}
      >
        {quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </Button>
      <span className="w-8 text-center font-bold text-lg">{quantity}</span>
      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-brand text-brand" onClick={onIncrease}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
