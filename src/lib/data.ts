import { PlaceHolderImages } from './placeholder-images';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: (typeof PlaceHolderImages)[0];
}

export interface FoodCategory {
  id: string;
  name: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export const foodCategories: FoodCategory[] = [
  { id: 'mains', name: 'Mains' },
  { id: 'starters', name: 'Starters' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

export const menuItems: MenuItem[] = [
  { id: 'item-1', name: 'Gourmet Burger', price: 15.99, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'burger')! },
  { id: 'item-2', name: 'Pepperoni Pizza', price: 18.50, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'pizza')! },
  { id: 'item-3', name: 'Grilled Steak', price: 25.00, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'steak')! },
  { id: 'item-4', name: 'Spaghetti Bolognese', price: 16.00, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'pasta')! },
  
  { id: 'item-5', name: 'Caesar Salad', price: 9.50, category: 'starters', image: PlaceHolderImages.find(p => p.id === 'salad')! },
  { id: 'item-6', name: 'Sushi Platter', price: 12.00, category: 'starters', image: PlaceHolderImages.find(p => p.id === 'sushi')! },

  { id: 'item-7', name: 'Chocolate Lava Cake', price: 8.00, category: 'desserts', image: PlaceHolderImages.find(p => p.id === 'cake')! },
  { id: 'item-8', name: 'Artisan Ice Cream', price: 6.50, category: 'desserts', image: PlaceHolderImages.find(p => p.id === 'ice-cream')! },
  
  { id: 'item-9', name: 'Espresso', price: 3.50, category: 'drinks', image: PlaceHolderImages.find(p => p.id === 'coffee')! },
  { id: 'item-10', name: 'Fresh Orange Juice', price: 5.00, category: 'drinks', image: PlaceHolderImages.find(p => p.id === 'juice')! },
];
