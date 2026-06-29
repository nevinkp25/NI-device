
import { PlaceHolderImages } from './placeholder-images';

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ItemVariation {
  id: string;
  name: string;
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

const createMenuItems = (): MenuItem[] => {
  const items: MenuItem[] = [];

  // Helper to generate items for a category
  const addItems = (categoryId: string, names: string[], basePrice: number, imageId: string, variations?: ItemVariation[]) => {
    const image = PlaceHolderImages.find(p => p.id === imageId) || PlaceHolderImages[0];
    names.forEach((name, index) => {
      items.push({
        id: `${categoryId}-${index + 1}`,
        name,
        price: basePrice + (index * 0.5),
        category: categoryId,
        image,
        description: `Experience the authentic taste of our house-special ${name.toLowerCase()}, prepared fresh daily.`,
        nutrition: { kcal: 300 + (index * 20), protein: 10 + index, carbs: 30 + index, fat: 12 + index },
        allergens: index % 3 === 0 ? ['Gluten', 'Dairy'] : [],
        variations: variations
      });
    });
  };

  const pizzaVariations: ItemVariation[] = [
    {
      id: 'p-size',
      name: 'Select Size',
      type: 'required',
      options: [
        { id: 'reg', name: 'Regular 12"', priceModifier: 0 },
        { id: 'lrg', name: 'Large 16"', priceModifier: 4.50 },
      ]
    },
    {
      id: 'p-crust',
      name: 'Crust Type',
      type: 'required',
      options: [
        { id: 'thin', name: 'Thin & Crispy', priceModifier: 0 },
        { id: 'deep', name: 'Deep Dish', priceModifier: 2.00 },
        { id: 'gf', name: 'Gluten Free', priceModifier: 3.50 },
      ]
    },
    {
      id: 'p-addons',
      name: 'Extra Toppings',
      type: 'multiple',
      options: [
        { id: 'cheese', name: 'Extra Mozzarella', priceModifier: 1.50 },
        { id: 'pepperoni', name: 'Pepperoni', priceModifier: 2.00 },
        { id: 'mushrooms', name: 'Truffle Mushrooms', priceModifier: 2.50 },
      ]
    }
  ];

  const burgerVariations: ItemVariation[] = [
    {
      id: 'b-temp',
      name: 'Cooking Temperature',
      type: 'required',
      options: [
        { id: 'rare', name: 'Rare', priceModifier: 0 },
        { id: 'med-rare', name: 'Medium Rare', priceModifier: 0 },
        { id: 'med', name: 'Medium', priceModifier: 0 },
        { id: 'well', name: 'Well Done', priceModifier: 0 },
      ]
    },
    {
      id: 'b-cheese',
      name: 'Add Cheese',
      type: 'optional',
      options: [
        { id: 'cheddar', name: 'Cheddar', priceModifier: 1.00 },
        { id: 'swiss', name: 'Swiss', priceModifier: 1.00 },
        { id: 'blue', name: 'Gorgonzola Blue', priceModifier: 2.00 },
      ]
    },
    {
      id: 'b-addons',
      name: 'Addons',
      type: 'incremental',
      options: [
        { id: 'patty', name: 'Extra Wagyu Patty', priceModifier: 6.00 },
        { id: 'bacon', name: 'Crispy Bacon', priceModifier: 1.50 },
        { id: 'egg', name: 'Fried Egg', priceModifier: 1.00 },
      ]
    }
  ];

  const grillVariations: ItemVariation[] = [
    {
      id: 'g-side',
      name: 'Choice of Side',
      type: 'required',
      options: [
        { id: 'fries', name: 'French Fries', priceModifier: 0 },
        { id: 'potato', name: 'Roasted Potato', priceModifier: 0 },
        { id: 'veg', name: 'Grilled Vegetables', priceModifier: 0 },
      ]
    },
    {
      id: 'g-sauce',
      name: 'Select Sauce',
      type: 'required',
      options: [
        { id: 'pep', name: 'Peppercorn', priceModifier: 0 },
        { id: 'mush', name: 'Mushroom', priceModifier: 0 },
        { id: 'herb', name: 'Garlic Herb Butter', priceModifier: 0 },
      ]
    }
  ];

  addItems('starters', [
    'Bruschetta Classica', 'Crispy Calamari', 'Garlic Bread', 'Stuffed Mushrooms', 
    'Arancini Balls', 'Caprese Skewers', 'Shrimp Cocktail', 'Onion Rings', 
    'Buffalo Wings', 'Mozzarella Sticks', 'Spinach Dip', 'Potato Skins', 
    'Chicken Tenders', 'Quesadilla', 'Spring Rolls'
  ], 8.00, 'sushi');

  addItems('salads', [
    'Classic Caesar', 'Greek Salad', 'Garden Salad', 'Cobb Salad', 
    'Quinoa Salad', 'Waldorf Salad', 'Wedge Salad', 'Caprese Salad', 
    'Nicoise Salad', 'Spinach Salad', 'Fruit Salad', 'Coleslaw', 
    'Potato Salad', 'Pasta Salad', 'Asian Noodle Salad'
  ], 10.00, 'salad');

  addItems('pizza', [
    'Buffalo Margherita', 'Pepperoni Feast', 'BBQ Chicken', 'Veggie Supreme', 
    'Hawaiian Classic', 'Meat Lovers', 'Four Cheese', 'Truffle Mushroom', 
    'Pesto Chicken', 'Spicy Salami', 'Seafood Special', 'White Pizza', 
    'Anchovy Salt', 'Mediterranean', 'Breakfast Pizza'
  ], 15.00, 'pizza', pizzaVariations);

  addItems('pasta', [
    'Truffle Tagliatelle', 'Carbonara Classic', 'Lasagna Tradizionale', 'Penne Arrabbiata', 
    'Fettuccine Alfredo', 'Spaghetti Bolognese', 'Seafood Linguine', 'Ravioli Ricotta', 
    'Gnocchi Pesto', 'Mac & Cheese', 'Tortellini Broth', 'Pasta Primavera', 
    'Fusilli Pink Sauce', 'Rigatoni Ragu', 'Angel Hair Garlic'
  ], 14.00, 'pasta');

  addItems('burgers', [
    'The Wagyu Signature', 'Classic Cheeseburger', 'Bacon King', 'Mushroom Swiss', 
    'Veggie Garden', 'Crispy Chicken', 'Zesty Fish', 'BBQ Western', 
    'Spicy Jalapeno', 'Turkey Lean', 'Breakfast Burger', 'Double Stack', 
    'Slider Trio', 'Blue Cheese', 'Hawaiian Burger'
  ], 18.00, 'burger', burgerVariations);

  addItems('grill', [
    'Ribeye Steak 300g', 'Filet Mignon', 'Grilled Salmon', 'BBQ Pork Ribs', 
    'Lamb Chops', 'Grilled Chicken Breast', 'T-Bone Steak', 'Mixed Grill', 
    'Grilled Sea Bass', 'Pork Chops', 'Garlic Shrimp', 'Grilled Veggies', 
    'Turkey Steak', 'Duck Confit', 'Venison Steak'
  ], 25.00, 'steak', grillVariations);

  addItems('desserts', [
    'Vanilla Panna Cotta', 'Lava Cake', 'Tiramisu', 'NY Cheesecake', 
    'Warm Apple Pie', 'Brownie Sundae', 'Gelato Selection', 'Fruit Tart', 
    'Creme Brulee', 'Sicilian Cannoli', 'French Macarons', 'Berry Sorbet', 
    'Churros Con Chocolate', 'Red Velvet', 'Bread Pudding'
  ], 7.00, 'cake');

  addItems('drinks', [
    'Double Espresso', 'Cappuccino', 'Caffe Latte', 'Iced Coffee', 
    'English Breakfast Tea', 'Peach Iced Tea', 'Orange Juice', 'Lemonade', 
    'Classic Cola', 'Diet Soda', 'Mineral Water', 'Sparkling Water', 
    'Chocolate Milkshake', 'Mango Smoothie', 'Berry Mocktail'
  ], 4.00, 'coffee');

  return items;
};

export const menuItems: MenuItem[] = createMenuItems();

export const sampleOrder: Order = {
  id: '2536',
  tableNumber: '3',
  date: new Date().toISOString(),
  items: [
    { 
      ...menuItems.find(i => i.id === 'pizza-1')!, 
      cartItemId: 'pizza-1-custom', 
      quantity: 1, 
      selectedVariations: { 'p-size': 'reg', 'p-crust': 'gf', 'p-addons': 'cheese' } 
    },
    { 
      ...menuItems.find(i => i.id === 'starters-1')!, 
      cartItemId: 'starters-1', 
      quantity: 2, 
      selectedVariations: {} 
    },
    { 
      ...menuItems.find(i => i.id === 'burgers-1')!, 
      cartItemId: 'burgers-1-custom', 
      quantity: 1, 
      selectedVariations: { 'b-temp': 'med-rare', 'b-cheese': 'blue' } 
    },
    { 
      ...menuItems.find(i => i.id === 'drinks-1')!, 
      cartItemId: 'drinks-1', 
      quantity: 4, 
      selectedVariations: {} 
    },
  ]
}
