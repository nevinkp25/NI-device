
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
        description: `Experience the authentic taste of our house-special ${name.toLowerCase()}, prepared fresh daily using premium ingredients.`,
        nutrition: { kcal: 300 + (index * 20), protein: 10 + index, carbs: 30 + index, fat: 12 + index },
        allergens: index % 3 === 0 ? ['Gluten', 'Dairy'] : [],
        variations: variations
      });
    });
  };

  const starterVariations: ItemVariation[] = [
    {
      id: 's-dip',
      name: 'Choice of Dip',
      type: 'required',
      options: [
        { id: 'garlic', name: 'Garlic Aioli', priceModifier: 0 },
        { id: 'spicy', name: 'Spicy Mayo', priceModifier: 0.50 },
        { id: 'truffle', name: 'Truffle Dip', priceModifier: 2.00 },
      ]
    }
  ];

  const saladVariations: ItemVariation[] = [
    {
      id: 'sl-dressing',
      name: 'Select Dressing',
      type: 'required',
      options: [
        { id: 'caesar', name: 'Classic Caesar', priceModifier: 0 },
        { id: 'vinaigrette', name: 'Balsamic Vinaigrette', priceModifier: 0 },
        { id: 'lemon', name: 'Lemon Tahini', priceModifier: 0 },
      ]
    },
    {
      id: 'sl-protein',
      name: 'Add Protein',
      type: 'optional',
      options: [
        { id: 'chicken', name: 'Grilled Chicken', priceModifier: 4.00 },
        { id: 'salmon', name: 'Seared Salmon', priceModifier: 6.50 },
        { id: 'tofu', name: 'Crispy Tofu', priceModifier: 3.00 },
      ]
    }
  ];

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

  const pastaVariations: ItemVariation[] = [
    {
      id: 'ps-type',
      name: 'Pasta Shape',
      type: 'required',
      options: [
        { id: 'penne', name: 'Penne', priceModifier: 0 },
        { id: 'fett', name: 'Fettuccine', priceModifier: 0 },
        { id: 'spag', name: 'Spaghetti', priceModifier: 0 },
      ]
    },
    {
      id: 'ps-extra',
      name: 'Add-ons',
      type: 'multiple',
      options: [
        { id: 'chilli', name: 'Chilli Flakes', priceModifier: 0 },
        { id: 'parm', name: 'Extra Parmesan', priceModifier: 1.00 },
        { id: 'bread', name: 'Extra Garlic Bread', priceModifier: 2.50 },
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

  const dessertVariations: ItemVariation[] = [
    {
      id: 'd-extra',
      name: 'Toppings',
      type: 'multiple',
      options: [
        { id: 'scoop', name: 'Vanilla Scoop', priceModifier: 2.00 },
        { id: 'cream', name: 'Extra Cream', priceModifier: 1.00 },
        { id: 'choc', name: 'Chocolate Sauce', priceModifier: 0.50 },
      ]
    }
  ];

  const drinkVariations: ItemVariation[] = [
    {
      id: 'dr-ice',
      name: 'Ice Level',
      type: 'required',
      options: [
        { id: 'normal', name: 'Regular Ice', priceModifier: 0 },
        { id: 'less', name: 'Less Ice', priceModifier: 0 },
        { id: 'no', name: 'No Ice', priceModifier: 0 },
      ]
    },
    {
      id: 'dr-sugar',
      name: 'Sugar Level',
      type: 'required',
      options: [
        { id: '100', name: 'Full Sugar', priceModifier: 0 },
        { id: '50', name: 'Half Sugar', priceModifier: 0 },
        { id: '0', name: 'No Sugar', priceModifier: 0 },
      ]
    }
  ];

  addItems('starters', [
    'Bruschetta Classica', 'Crispy Calamari', 'Garlic Bread', 'Stuffed Mushrooms', 
    'Arancini Balls', 'Caprese Skewers', 'Shrimp Cocktail', 'Onion Rings', 
    'Buffalo Wings', 'Mozzarella Sticks'
  ], 8.00, 'sushi', starterVariations);

  addItems('salads', [
    'Classic Caesar', 'Greek Salad', 'Garden Salad', 'Cobb Salad', 
    'Quinoa Salad', 'Waldorf Salad', 'Wedge Salad', 'Caprese Salad'
  ], 10.00, 'salad', saladVariations);

  addItems('pizza', [
    'Buffalo Margherita', 'Pepperoni Feast', 'BBQ Chicken', 'Veggie Supreme', 
    'Hawaiian Classic', 'Meat Lovers', 'Four Cheese', 'Truffle Mushroom'
  ], 15.00, 'pizza', pizzaVariations);

  addItems('pasta', [
    'Truffle Tagliatelle', 'Carbonara Classic', 'Lasagna Tradizionale', 'Penne Arrabbiata', 
    'Fettuccine Alfredo', 'Spaghetti Bolognese', 'Seafood Linguine'
  ], 14.00, 'pasta', pastaVariations);

  addItems('burgers', [
    'The Wagyu Signature', 'Classic Cheeseburger', 'Bacon King', 'Mushroom Swiss', 
    'Veggie Garden', 'Crispy Chicken', 'Zesty Fish', 'BBQ Western'
  ], 18.00, 'burger', burgerVariations);

  addItems('grill', [
    'Ribeye Steak 300g', 'Filet Mignon', 'Grilled Salmon', 'BBQ Pork Ribs', 
    'Lamb Chops', 'Grilled Chicken Breast', 'T-Bone Steak'
  ], 25.00, 'steak', grillVariations);

  addItems('desserts', [
    'Vanilla Panna Cotta', 'Lava Cake', 'Tiramisu', 'NY Cheesecake', 
    'Warm Apple Pie', 'Brownie Sundae'
  ], 7.00, 'cake', dessertVariations);

  addItems('drinks', [
    'Iced Coffee', 'Peach Iced Tea', 'Orange Juice', 'Lemonade', 
    'Classic Cola', 'Mango Smoothie', 'Berry Mocktail'
  ], 4.00, 'coffee', drinkVariations);

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
      selectedVariations: { 's-dip': 'garlic' } 
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
      selectedVariations: { 'dr-ice': 'normal', 'dr-sugar': '100' } 
    },
  ]
}
