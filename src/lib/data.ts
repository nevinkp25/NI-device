
import { PlaceHolderImages } from './placeholder-images';

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number; // e.g., 0 for default, 3 for +$3.00
}

export interface ItemVariation {
  id: string;
  name: string; // e.g., "Size", "Extras"
  type: 'required' | 'optional';
  options: VariationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: (typeof PlaceHolderImages)[0];
  variations?: ItemVariation[];
}

// A unique ID for a cart item is its base ID plus its selected variations.
export type CartItemVariationSelection = Record<string, string>; // e.g., { size: 'medium' }

export interface CartItem extends MenuItem {
  cartItemId: string; // A unique identifier for this specific item configuration in the cart
  quantity: number;
  selectedVariations: CartItemVariationSelection;
}

export interface Order {
  id: string;
  tableNumber: string;
  date: string;
  items: CartItem[];
}

export interface FoodCategory {
  id: string;
  name: string;
}

export interface TableData {
  id: string;
  isOccupied: boolean;
}

export const foodCategories: FoodCategory[] = [
  { id: 'mains', name: 'Mains' },
  { id: 'starters', name: 'Starters' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

export const TABLES_BY_FLOOR: Record<string, TableData[]> = {
  f1: [
    { id: 'T101', isOccupied: false },
    { id: 'T102', isOccupied: true },
    { id: 'T103', isOccupied: false },
    { id: 'T104', isOccupied: false },
    { id: 'T105', isOccupied: true },
    { id: 'T106', isOccupied: false },
    { id: 'T107', isOccupied: false },
    { id: 'T108', isOccupied: false },
    { id: 'T109', isOccupied: true },
    { id: 'T110', isOccupied: false },
    { id: 'T111', isOccupied: false },
    { id: 'T112', isOccupied: false },
  ],
  f2: [
    { id: 'T201', isOccupied: true },
    { id: 'T202', isOccupied: false },
    { id: 'T203', isOccupied: false },
    { id: 'T204', isOccupied: true },
    { id: 'T205', isOccupied: false },
    { id: 'T501', isOccupied: false },
    { id: 'T502', isOccupied: true },
  ],
  vip: [
    { id: 'V1001', isOccupied: false },
    { id: 'V1002', isOccupied: true },
    { id: 'V1003', isOccupied: false },
  ],
};

export const ALL_TABLES = Object.values(TABLES_BY_FLOOR).flat();

export const menuItems: MenuItem[] = [
  { 
    id: 'item-1', 
    name: 'Gourmet Burger', 
    price: 15.99, 
    category: 'mains', 
    image: PlaceHolderImages.find(p => p.id === 'burger')! 
  },
  { 
    id: 'item-2', 
    name: 'Pepperoni Pizza', 
    price: 18.50, 
    category: 'mains', 
    image: PlaceHolderImages.find(p => p.id === 'pizza')!,
    variations: [
      {
        id: 'size',
        name: 'Size',
        type: 'required',
        options: [
          { id: 'small', name: 'Small', priceModifier: -2 },
          { id: 'medium', name: 'Medium', priceModifier: 0 },
          { id: 'large', name: 'Large', priceModifier: 3 },
        ],
      },
      {
        id: 'crust',
        name: 'Crust',
        type: 'required',
        options: [
          { id: 'classic', name: 'Classic', priceModifier: 0 },
          { id: 'thin', name: 'Thin', priceModifier: 0 },
          { id: 'stuffed', name: 'Stuffed', priceModifier: 2.5 },
        ],
      },
      {
        id: 'extras',
        name: 'Extras',
        type: 'optional',
        options: [
          { id: 'extra-cheese', name: 'Extra Cheese', priceModifier: 1.5 },
          { id: 'olives', name: 'Olives', priceModifier: 1.0 },
        ],
      },
    ],
  },
  { id: 'item-3', name: 'Grilled Steak', price: 25.00, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'steak')! },
  { id: 'item-4', name: 'Spaghetti Bolognese', price: 16.00, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'pasta')! },
  
  { id: 'item-5', name: 'Caesar Salad', price: 9.50, category: 'starters', image: PlaceHolderImages.find(p => p.id === 'salad')! },
  { id: 'item-6', name: 'Sushi Platter', price: 12.00, category: 'starters', image: PlaceHolderImages.find(p => p.id === 'sushi')! },
  { id: 'item-7', name: 'Crispy Calamaris', price: 29.28, category: 'starters', image: PlaceHolderImages.find(p => p.id === 'sushi')! },
  { id: 'item-11', name: 'Roasted Tomato', price: 19.00, category: 'starters', image: PlaceHolderImages.find(p => p.id === 'salad')! },


  { id: 'item-12', name: 'Grilled Salmon', price: 32.00, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'steak')! },
  { id: 'item-13', name: 'Chicken Alfredo', price: 26.56, category: 'mains', image: PlaceHolderImages.find(p => p.id === 'pasta')! },

  { id: 'item-8', name: 'Chocolate Lava Cake', price: 8.00, category: 'desserts', image: PlaceHolderImages.find(p => p.id === 'cake')! },
  
  { 
    id: 'item-9', 
    name: 'Espresso', 
    price: 3.50, 
    category: 'drinks', 
    image: PlaceHolderImages.find(p => p.id === 'coffee')!,
    variations: [
        {
            id: 'milk',
            name: 'Milk',
            type: 'optional',
            options: [
                {id: 'splash-milk', name: 'Splash of Milk', priceModifier: 0.50},
                {id: 'oat-milk', name: 'Oat Milk', priceModifier: 1.00}
            ]
        }
    ]
  },
  { id: 'item-10', name: 'Fresh Orange Juice', price: 5.00, category: 'drinks', image: PlaceHolderImages.find(p => p.id === 'juice')! },
];

// Sample Order Data
export const sampleOrder: Order = {
  id: '2536',
  tableNumber: '3',
  date: '2025-12-04T02:16:00Z',
  items: [
    { ...menuItems.find(i => i.id === 'item-11')!, cartItemId: 'item-11', quantity: 1, selectedVariations: {} },
    { ...menuItems.find(i => i.id === 'item-7')!, cartItemId: 'item-7', quantity: 1, selectedVariations: {} },
    { ...menuItems.find(i => i.id === 'item-12')!, cartItemId: 'item-12', quantity: 1, selectedVariations: {} },
    { ...menuItems.find(i => i.id === 'item-13')!, cartItemId: 'item-13', quantity: 1, selectedVariations: {} },
  ]
}
