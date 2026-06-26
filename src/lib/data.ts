
import { PlaceHolderImages } from './placeholder-images';

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number; // e.g., 0 for default, 3 for +$3.00
}

export interface ItemVariation {
  id: string;
  name: string; // e.g., "Size", "Extras"
  type: 'required' | 'optional' | 'multiple';
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
export type CartItemVariationSelection = Record<string, string>; // e.g., { size: 'medium', extras: 'extra-cheese,olives' }

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
  {
    id: 'starter-3',
    name: 'Truffle Arancini',
    price: 10.50,
    category: 'starters',
    image: PlaceHolderImages.find(p => p.id === 'sushi')!,
    description: 'Sicilian risotto balls filled with mozzarella and black truffle, served with marinara.',
    nutrition: { kcal: 580, protein: 12, carbs: 54, fat: 36 },
    allergens: ['Gluten', 'Dairy'],
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
  {
    id: 'salad-2',
    name: 'Greek Garden',
    price: 10.00,
    category: 'salads',
    image: PlaceHolderImages.find(p => p.id === 'salad')!,
    description: 'Vine tomatoes, cucumbers, Kalamata olives, and block feta with dried oregano.',
    nutrition: { kcal: 310, protein: 8, carbs: 12, fat: 26 },
    allergens: ['Dairy'],
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
  {
    id: 'pizza-2',
    name: 'Spicy Diavola',
    price: 18.00,
    category: 'pizza',
    image: PlaceHolderImages.find(p => p.id === 'pizza')!,
    description: 'Spicy Calabrese salami, nduja, mozzarella, and chili-infused honey.',
    nutrition: { kcal: 1150, protein: 44, carbs: 115, fat: 54 },
    allergens: ['Gluten', 'Dairy'],
  },

  // --- PASTA ---
  {
    id: 'pasta-1',
    name: 'Pappardelle Ragu',
    price: 19.50,
    category: 'pasta',
    image: PlaceHolderImages.find(p => p.id === 'pasta')!,
    description: 'Wide egg pasta tossed in a 6-hour slow-cooked beef and veal ragu.',
    nutrition: { kcal: 780, protein: 42, carbs: 85, fat: 28 },
    allergens: ['Gluten', 'Egg', 'Dairy'],
    variations: [
      {
        id: 'pasta-type',
        name: 'Pasta Choice',
        type: 'required',
        options: [
          { id: 'classic', name: 'Hand-cut Pappardelle', priceModifier: 0 },
          { id: 'gluten-free', name: 'Gluten-Free Penne', priceModifier: 2.00 },
        ],
      }
    ]
  },
  {
    id: 'pasta-2',
    name: 'Lobster Ravioli',
    price: 24.00,
    category: 'pasta',
    image: PlaceHolderImages.find(p => p.id === 'pasta')!,
    description: 'Handmade ravioli filled with Maine lobster, served in a light saffron cream sauce.',
    nutrition: { kcal: 640, protein: 34, carbs: 58, fat: 32 },
    allergens: ['Crustaceans', 'Gluten', 'Dairy', 'Egg'],
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
      }
    ]
  },
  {
    id: 'burger-2',
    name: 'Crispy Pollo',
    price: 16.50,
    category: 'burgers',
    image: PlaceHolderImages.find(p => p.id === 'burger')!,
    description: 'Buttermilk fried chicken breast, chipotle slaw, and house pickles on brioche.',
    nutrition: { kcal: 740, protein: 36, carbs: 58, fat: 38 },
    allergens: ['Gluten', 'Dairy', 'Egg'],
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
      },
      {
        id: 'steak-sauce',
        name: 'House Sauce',
        type: 'required',
        options: [
          { id: 'pepper', name: 'Green Peppercorn', priceModifier: 0 },
          { id: 'chimichurri', name: 'Chimichurri', priceModifier: 0 },
          { id: 'blue', name: 'Gorgonzola Butter', priceModifier: 2.50 },
        ],
      }
    ]
  },
  {
    id: 'grill-2',
    name: 'Grilled Sea Bass',
    price: 26.50,
    category: 'grill',
    image: PlaceHolderImages.find(p => p.id === 'steak')!,
    description: 'Whole deboned sea bass grilled with lemon, thyme, and Mediterranean caper butter.',
    nutrition: { kcal: 480, protein: 54, carbs: 4, fat: 28 },
    allergens: ['Fish', 'Dairy'],
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
  {
    id: 'dessert-2',
    name: 'Molten Chocolate Cake',
    price: 11.00,
    category: 'desserts',
    image: PlaceHolderImages.find(p => p.id === 'cake')!,
    description: 'Warm dark chocolate cake with a melting center, served with salted caramel ice cream.',
    nutrition: { kcal: 620, protein: 8, carbs: 58, fat: 42 },
    allergens: ['Gluten', 'Dairy', 'Egg'],
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
    variations: [
      {
        id: 'milk-type',
        name: 'Milk Preference',
        type: 'optional',
        options: [
          { id: 'soy', name: 'Soy Milk', priceModifier: 0.50 },
          { id: 'oat', name: 'Oat Milk', priceModifier: 1.00 },
          { id: 'cream', name: 'Heavy Cream', priceModifier: 0.75 },
        ],
      }
    ]
  },
  {
    id: 'drink-2',
    name: 'Hibiscus Iced Tea',
    price: 5.50,
    category: 'drinks',
    image: PlaceHolderImages.find(p => p.id === 'juice')!,
    description: 'Refreshing cold-brewed hibiscus flowers with honey and fresh mint.',
    nutrition: { kcal: 85, protein: 0, carbs: 22, fat: 0 },
  },
  {
    id: 'drink-3',
    name: 'Chardonnay 175ml',
    price: 9.50,
    category: 'drinks',
    image: PlaceHolderImages.find(p => p.id['juice'])!,
    description: 'Crisp white wine with notes of green apple and citrus.',
    nutrition: { kcal: 125, protein: 0, carbs: 4, fat: 0 },
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
