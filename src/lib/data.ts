
import { PlaceHolderImages } from './placeholder-images';

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number; // e.g., 0 for default, 3 for +$3.00
}

export interface ItemVariation {
  id: string;
  name: string; // e.g., "Size", "Extras"
  type: 'required' | 'optional' | 'multiple' | 'incremental';
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
// Incremental values are stored as "id:qty" within the selection string.
export type CartItemVariationSelection = Record<string, string>; 

export interface CartItem extends MenuItem {
  cartItemId: string; 
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
  { id: 'starters', name: 'STARTERS' },
  { id: 'salads', name: 'SALADS' },
  { id: 'pizza', name: 'PIZZA' },
  { id: 'pasta', name: 'PASTA' },
  { id: 'burgers', name: 'BURGERS' },
  { id: 'grill', name: 'GRILL' },
  { id: 'desserts', name: 'DESSERTS' },
  { id: 'drinks', name: 'BEVERAGES' },
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
  // --- STARTERS ---
  {
    id: 'starter-1',
    name: 'Bruschetta Classica',
    price: 8.50,
    category: 'starters',
    image: PlaceHolderImages.find(p => p.id === 'sushi')!,
    description: 'Toasted ciabatta topped with vine-ripened tomatoes, fresh basil, and extra virgin olive oil.',
    nutrition: { kcal: 320, protein: 6, carbs: 42, fat: 14 },
    allergens: ['Gluten'],
  },
  {
    id: 'starter-2',
    name: 'Crispy Calamari',
    price: 12.00,
    category: 'starters',
    image: PlaceHolderImages.find(p => p.id === 'sushi')!,
    description: 'Lightly battered baby squid served with a zesty lemon aioli and fresh parsley.',
    nutrition: { kcal: 450, protein: 18, carbs: 24, fat: 32 },
    allergens: ['Molluscs', 'Gluten', 'Egg'],
  },

  // --- SALADS ---
  {
    id: 'salad-1',
    name: 'Classic Caesar',
    price: 11.50,
    category: 'salads',
    image: PlaceHolderImages.find(p => p.id === 'salad')!,
    description: 'Crisp romaine, sourdough croutons, Parmigiano-Reggiano, and house-made creamy dressing.',
    nutrition: { kcal: 420, protein: 14, carbs: 18, fat: 34 },
    allergens: ['Dairy', 'Gluten', 'Egg', 'Fish'],
    variations: [
      {
        id: 'protein',
        name: 'Add Protein',
        type: 'optional',
        options: [
          { id: 'chicken', name: 'Grilled Chicken', priceModifier: 5.00 },
          { id: 'shrimp', name: 'Garlic Shrimp', priceModifier: 7.00 },
          { id: 'salmon', name: 'Seared Salmon', priceModifier: 9.00 },
        ],
      }
    ]
  },

  // --- PIZZA ---
  { 
    id: 'pizza-1', 
    name: 'Buffalo Margherita', 
    price: 16.50, 
    category: 'pizza', 
    image: PlaceHolderImages.find(p => p.id === 'pizza')!,
    description: 'DOP Buffalo Mozzarella, San Marzano tomatoes, and fresh basil leaves.',
    nutrition: { kcal: 920, protein: 32, carbs: 110, fat: 38 },
    allergens: ['Gluten', 'Dairy'],
    variations: [
      {
        id: 'pizza-size',
        name: 'Size',
        type: 'required',
        options: [
          { id: 'reg', name: 'Regular 12"', priceModifier: 0 },
          { id: 'large', name: 'Large 16"', priceModifier: 5.50 },
        ],
      }
    ]
  },

  // --- BURGERS ---
  { 
    id: 'burger-1', 
    name: 'The Wagyu Signature', 
    price: 22.00, 
    category: 'burgers', 
    image: PlaceHolderImages.find(p => p.id === 'burger')!,
    description: '200g Wagyu patty, aged cheddar, truffle mayo, and balsamic glazed onions.',
    nutrition: { kcal: 980, protein: 48, carbs: 52, fat: 64 },
    allergens: ['Gluten', 'Dairy', 'Egg'],
    variations: [
      {
        id: 'doneness',
        name: 'Cooking Level',
        type: 'required',
        options: [
          { id: 'rare', name: 'Rare', priceModifier: 0 },
          { id: 'med-rare', name: 'Medium Rare', priceModifier: 0 },
          { id: 'medium', name: 'Medium', priceModifier: 0 },
          { id: 'well', name: 'Well Done', priceModifier: 0 },
        ],
      },
      {
        id: 'condiments',
        name: 'Add-ons & Condiments',
        type: 'incremental',
        options: [
          { id: 'bacon', name: 'Crispy Bacon', priceModifier: 3.50 },
          { id: 'avocado', name: 'Avocado Slice', priceModifier: 2.50 },
          { id: 'cheese', name: 'Extra Cheddar', priceModifier: 1.50 },
          { id: 'sauce-bbq', name: 'Side BBQ Sauce', priceModifier: 0.75 },
          { id: 'sauce-truffle', name: 'Side Truffle Mayo', priceModifier: 1.25 },
        ],
      }
    ]
  },

  // --- GRILL ---
  { 
    id: 'grill-1', 
    name: 'Ribeye Steak 300g', 
    price: 34.00, 
    category: 'grill', 
    image: PlaceHolderImages.find(p => p.id === 'steak')!,
    description: 'USDA Prime 35-day dry-aged ribeye, seasoned with sea salt and cracked pepper.',
    nutrition: { kcal: 850, protein: 72, carbs: 0, fat: 62 },
    allergens: [],
    variations: [
      {
        id: 'steak-temp',
        name: 'Doneness',
        type: 'required',
        options: [
          { id: 'rare', name: 'Rare', priceModifier: 0 },
          { id: 'mr', name: 'Med Rare', priceModifier: 0 },
          { id: 'm', name: 'Medium', priceModifier: 0 },
          { id: 'mw', name: 'Med Well', priceModifier: 0 },
          { id: 'w', name: 'Well Done', priceModifier: 0 },
        ],
      }
    ]
  },

  // --- DESSERTS ---
  { 
    id: 'dessert-1', 
    name: 'Vanilla Bean Panna Cotta', 
    price: 9.00, 
    category: 'desserts', 
    image: PlaceHolderImages.find(p => p.id === 'cake')!,
    description: 'Silky smooth panna cotta with Madagascan vanilla and a mixed berry coulis.',
    nutrition: { kcal: 380, protein: 4, carbs: 32, fat: 26 },
    allergens: ['Dairy'],
  },

  // --- BEVERAGES ---
  { 
    id: 'drink-1', 
    name: 'Double Espresso', 
    price: 4.50, 
    category: 'drinks', 
    image: PlaceHolderImages.find(p => p.id === 'coffee')!,
    description: 'Arabica house-blend espresso. Strong and aromatic.',
    nutrition: { kcal: 10, protein: 0, carbs: 1, fat: 0 },
  },
];

// Sample Order Data
export const sampleOrder: Order = {
  id: '2536',
  tableNumber: '3',
  date: '2025-12-04T02:16:00Z',
  items: [
    { ...menuItems.find(i => i.id === 'pizza-1')!, cartItemId: 'pizza-1', quantity: 1, selectedVariations: { 'pizza-size': 'reg' } },
  ]
}
