
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

export interface NutritionInfo {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: (typeof PlaceHolderImages)[0];
  description?: string;
  nutrition?: NutritionInfo;
  allergens?: string[];
  variations?: ItemVariation[];
}

// A unique ID for a cart item is its base ID plus its selected variations.
export type CartItemVariationSelection = Record<string, string>; // e.g., { size: 'medium' }

export interface CartItem extends MenuItem {
  cartItemId: string; // A unique identifier for this specific item configuration in the cart
  quantity: number;
  selectedVariations: CartItemVariationSelection;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  date: string;
  items: CartItem[];
  orderInstructions?: string;
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
    image: PlaceHolderImages.find(p => p.id === 'burger')!,
    description: 'Juicy 100% Wagyu beef patty with caramelized onions, swiss cheese, and our secret sauce on a toasted brioche bun.',
    nutrition: { kcal: 850, protein: 42, carbs: 54, fat: 38 },
    allergens: ['Gluten', 'Dairy', 'Sesame'],
  },
  { 
    id: 'item-2', 
    name: 'Pepperoni Pizza', 
    price: 18.50, 
    category: 'mains', 
    image: PlaceHolderImages.find(p => p.id === 'pizza')!,
    description: 'Crispy hand-stretched dough topped with spicy pepperoni, premium mozzarella, and our signature herb-infused tomato sauce.',
    nutrition: { kcal: 1120, protein: 48, carbs: 124, fat: 42 },
    allergens: ['Gluten', 'Dairy'],
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
  { 
    id: 'item-3', 
    name: 'Grilled Steak', 
    price: 25.00, 
    category: 'mains', 
    image: PlaceHolderImages.find(p => p.id === 'steak')!,
    description: 'Prime 250g ribeye steak grilled to your preference, served with rosemary-garlic butter and roasted vegetables.',
    nutrition: { kcal: 680, protein: 62, carbs: 12, fat: 45 },
    allergens: ['Dairy'],
  },
  { 
    id: 'item-4', 
    name: 'Spaghetti Bolognese', 
    price: 16.00, 
    category: 'mains', 
    image: PlaceHolderImages.find(p => p.id === 'pasta')!,
    description: 'Slow-cooked beef ragu with fresh basil, oregano, and San Marzano tomatoes over artisanal egg spaghetti.',
    nutrition: { kcal: 720, protein: 34, carbs: 88, fat: 24 },
    allergens: ['Gluten', 'Egg'],
  },
  { 
    id: 'item-5', 
    name: 'Caesar Salad', 
    price: 9.50, 
    category: 'starters', 
    image: PlaceHolderImages.find(p => p.id === 'salad')!,
    description: 'Fresh romaine hearts, parmesan shavings, and house-made sourdough croutons with traditional caesar dressing.',
    nutrition: { kcal: 320, protein: 12, carbs: 24, fat: 22 },
    allergens: ['Dairy', 'Gluten', 'Egg', 'Fish'],
  },
  { 
    id: 'item-6', 
    name: 'Sushi Platter', 
    price: 12.00, 
    category: 'starters', 
    image: PlaceHolderImages.find(p => p.id === 'sushi')!,
    description: 'Selection of fresh nigiri and maki rolls featuring premium Atlantic salmon and bluefin tuna.',
    nutrition: { kcal: 450, protein: 28, carbs: 62, fat: 8 },
    allergens: ['Fish', 'Soy', 'Sesame'],
  },
  { 
    id: 'item-8', 
    name: 'Chocolate Lava Cake', 
    price: 8.00, 
    category: 'desserts', 
    image: PlaceHolderImages.find(p => p.id === 'cake')!,
    description: 'Warm, gooey dark chocolate center cake served with a scoop of Madagascan vanilla bean ice cream.',
    nutrition: { kcal: 540, protein: 8, carbs: 64, fat: 32 },
    allergens: ['Dairy', 'Gluten', 'Egg'],
  },
  { 
    id: 'item-9', 
    name: 'Espresso', 
    price: 3.50, 
    category: 'drinks', 
    image: PlaceHolderImages.find(p => p.id === 'coffee')!,
    description: 'Rich, full-bodied double shot of our specialty house-blend Arabica beans.',
    nutrition: { kcal: 5, protein: 0, carbs: 1, fat: 0 },
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
  { 
    id: 'item-10', 
    name: 'Fresh Orange Juice', 
    price: 5.00, 
    category: 'drinks', 
    image: PlaceHolderImages.find(p => p.id === 'juice')!,
    description: '100% pure Valencia oranges, cold-pressed daily. No added sugar.',
    nutrition: { kcal: 110, protein: 2, carbs: 26, fat: 0 },
  },
];

// Sample Order Data
export const sampleOrder: Order = {
  id: '2536',
  tableNumber: '3',
  date: '2025-12-04T02:16:00Z',
  items: [
    { ...menuItems.find(i => i.id === 'item-2')!, cartItemId: 'item-2', quantity: 1, selectedVariations: { size: 'medium', crust: 'classic' } },
  ]
}
