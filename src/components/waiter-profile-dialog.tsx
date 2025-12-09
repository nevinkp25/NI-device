
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';

interface WaiterProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function WaiterProfileDialog({ isOpen, onOpenChange }: WaiterProfileDialogProps) {
  const waiterImage = PlaceHolderImages.find(p => p.id === 'waiter');
  const [staffId, setStaffId] = useState('');

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setStaffId(localStorage.getItem('staffId') || '');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
                {waiterImage && <AvatarImage src={waiterImage.imageUrl} alt="Waiter" />}
                <AvatarFallback>W</AvatarFallback>
            </Avatar>
          <DialogTitle className="text-2xl">David R.</DialogTitle>
          {staffId && <p className="text-muted-foreground">Employee ID: {staffId}</p>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="flex justify-center items-center gap-2">
                <Badge variant="secondary">5 years of experience</Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 4.8 Rating
                </Badge>
            </div>
            <p className="text-center text-muted-foreground px-4">
                "I'm here to make your dining experience exceptional. Feel free to ask me for recommendations!"
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
