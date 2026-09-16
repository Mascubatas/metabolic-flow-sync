export type FoodCategory =
  | "Whole Foods"
  | "Prepared Meals"
  | "Snacks"
  | "Cheat Foods"
  | "Sugary Beverages"
  | "Alcohol";

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  gi: number;
  offPlan?: boolean;
  sugary?: boolean;
  alcohol?: boolean;
}

export const FOODS: Food[] = [
  // Whole foods
  { id: "f1", name: "Grilled chicken breast", category: "Whole Foods", serving: "150 g", calories: 248, protein: 46, carbs: 0, fat: 6, gi: 0 },
  { id: "f2", name: "Salmon fillet", category: "Whole Foods", serving: "150 g", calories: 312, protein: 34, carbs: 0, fat: 19, gi: 0 },
  { id: "f3", name: "Whole eggs", category: "Whole Foods", serving: "2 large", calories: 156, protein: 13, carbs: 1, fat: 11, gi: 0 },
  { id: "f4", name: "Greek yogurt 2%", category: "Whole Foods", serving: "200 g", calories: 146, protein: 20, carbs: 8, fat: 4, gi: 11 },
  { id: "f5", name: "Lentils, cooked", category: "Whole Foods", serving: "1 cup", calories: 230, protein: 18, carbs: 40, fat: 1, gi: 32 },
  { id: "f6", name: "Steel-cut oats", category: "Whole Foods", serving: "50 g dry", calories: 190, protein: 7, carbs: 33, fat: 3, gi: 55 },
  { id: "f7", name: "Quinoa, cooked", category: "Whole Foods", serving: "1 cup", calories: 222, protein: 8, carbs: 39, fat: 4, gi: 53 },
  { id: "f8", name: "Broccoli, steamed", category: "Whole Foods", serving: "150 g", calories: 51, protein: 4, carbs: 10, fat: 1, gi: 15 },
  { id: "f9", name: "Avocado", category: "Whole Foods", serving: "half", calories: 160, protein: 2, carbs: 9, fat: 15, gi: 15 },
  { id: "f10", name: "Blueberries", category: "Whole Foods", serving: "150 g", calories: 86, protein: 1, carbs: 21, fat: 0, gi: 53 },
  { id: "f11", name: "Sweet potato, baked", category: "Whole Foods", serving: "200 g", calories: 180, protein: 4, carbs: 41, fat: 0, gi: 63 },
  { id: "f12", name: "Almonds", category: "Whole Foods", serving: "30 g", calories: 174, protein: 6, carbs: 6, fat: 15, gi: 15 },
  { id: "f13", name: "Tofu, firm", category: "Whole Foods", serving: "150 g", calories: 176, protein: 19, carbs: 4, fat: 11, gi: 15 },
  { id: "f14", name: "Brown rice, cooked", category: "Whole Foods", serving: "1 cup", calories: 216, protein: 5, carbs: 45, fat: 2, gi: 68 },

  // Prepared
  { id: "p1", name: "Chicken & quinoa bowl", category: "Prepared Meals", serving: "1 bowl", calories: 520, protein: 44, carbs: 45, fat: 16, gi: 45 },
  { id: "p2", name: "Salmon poke bowl", category: "Prepared Meals", serving: "1 bowl", calories: 610, protein: 36, carbs: 62, fat: 22, gi: 62 },
  { id: "p3", name: "Mediterranean chicken salad", category: "Prepared Meals", serving: "1 plate", calories: 430, protein: 38, carbs: 18, fat: 24, gi: 25 },
  { id: "p4", name: "Lentil soup + rye bread", category: "Prepared Meals", serving: "1 serving", calories: 380, protein: 19, carbs: 52, fat: 9, gi: 45 },
  { id: "p5", name: "Beef stir-fry with vegetables", category: "Prepared Meals", serving: "1 plate", calories: 480, protein: 40, carbs: 26, fat: 24, gi: 40 },
  { id: "p6", name: "Shawarma wrap", category: "Prepared Meals", serving: "1 wrap", calories: 680, protein: 32, carbs: 66, fat: 32, gi: 70, offPlan: true },

  // Snacks
  { id: "s1", name: "Cottage cheese + walnuts", category: "Snacks", serving: "150 g", calories: 220, protein: 20, carbs: 6, fat: 13, gi: 10 },
  { id: "s2", name: "Protein shake (whey)", category: "Snacks", serving: "1 scoop", calories: 130, protein: 25, carbs: 4, fat: 2, gi: 20 },
  { id: "s3", name: "Apple + peanut butter", category: "Snacks", serving: "1 + 15 g", calories: 185, protein: 4, carbs: 27, fat: 8, gi: 38 },
  { id: "s4", name: "Dark chocolate 85%", category: "Snacks", serving: "20 g", calories: 120, protein: 2, carbs: 6, fat: 10, gi: 23 },
  { id: "s5", name: "Rice cakes", category: "Snacks", serving: "2 cakes", calories: 70, protein: 1, carbs: 15, fat: 0, gi: 82 },
  { id: "s6", name: "Potato chips", category: "Snacks", serving: "50 g", calories: 270, protein: 3, carbs: 26, fat: 17, gi: 56, offPlan: true },

  // Cheat
  { id: "c1", name: "Cheese pizza slice", category: "Cheat Foods", serving: "2 slices", calories: 570, protein: 24, carbs: 66, fat: 22, gi: 72, offPlan: true },
  { id: "c2", name: "Cheeseburger & fries", category: "Cheat Foods", serving: "1 meal", calories: 980, protein: 38, carbs: 92, fat: 50, gi: 74, offPlan: true },
  { id: "c3", name: "Glazed donut", category: "Cheat Foods", serving: "1", calories: 260, protein: 3, carbs: 31, fat: 14, gi: 76, offPlan: true, sugary: true },
  { id: "c4", name: "Ice cream", category: "Cheat Foods", serving: "120 g", calories: 280, protein: 5, carbs: 34, fat: 14, gi: 62, offPlan: true, sugary: true },
  { id: "c5", name: "Chocolate cake", category: "Cheat Foods", serving: "1 slice", calories: 390, protein: 5, carbs: 52, fat: 18, gi: 68, offPlan: true, sugary: true },
  { id: "c6", name: "Biryani", category: "Cheat Foods", serving: "1 plate", calories: 720, protein: 28, carbs: 88, fat: 28, gi: 70, offPlan: true },

  // Sugary drinks
  { id: "d1", name: "Cola (regular)", category: "Sugary Beverages", serving: "330 mL", calories: 139, protein: 0, carbs: 35, fat: 0, gi: 63, offPlan: true, sugary: true },
  { id: "d2", name: "Orange juice", category: "Sugary Beverages", serving: "250 mL", calories: 112, protein: 2, carbs: 26, fat: 0, gi: 50, offPlan: true, sugary: true },
  { id: "d3", name: "Energy drink", category: "Sugary Beverages", serving: "250 mL", calories: 110, protein: 0, carbs: 27, fat: 0, gi: 70, offPlan: true, sugary: true },
  { id: "d4", name: "Sweetened iced coffee", category: "Sugary Beverages", serving: "350 mL", calories: 190, protein: 4, carbs: 32, fat: 5, gi: 60, offPlan: true, sugary: true },

  // Alcohol
  { id: "a1", name: "Beer (lager)", category: "Alcohol", serving: "330 mL", calories: 145, protein: 1, carbs: 11, fat: 0, gi: 66, offPlan: true, alcohol: true },
  { id: "a2", name: "Red wine", category: "Alcohol", serving: "150 mL", calories: 125, protein: 0, carbs: 4, fat: 0, gi: 15, offPlan: true, alcohol: true },
  { id: "a3", name: "Whiskey, neat", category: "Alcohol", serving: "45 mL", calories: 105, protein: 0, carbs: 0, fat: 0, gi: 0, offPlan: true, alcohol: true },
  { id: "a4", name: "Cocktail (mojito)", category: "Alcohol", serving: "1 glass", calories: 240, protein: 0, carbs: 26, fat: 0, gi: 70, offPlan: true, alcohol: true, sugary: true },
];

export const FOOD_CATEGORIES: FoodCategory[] = [
  "Whole Foods",
  "Prepared Meals",
  "Snacks",
  "Cheat Foods",
  "Sugary Beverages",
  "Alcohol",
];

export interface Recipe {
  id: string;
  name: string;
  tag: string;
  gi: "Low" | "Medium";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  minutes: number;
  ingredients: string[];
  steps: string[];
}

export const RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Herb salmon with lemon greens",
    tag: "Dinner",
    gi: "Low",
    calories: 520,
    protein: 40,
    carbs: 14,
    fat: 32,
    minutes: 25,
    ingredients: [
      "150 g salmon fillet",
      "200 g green beans",
      "1 tbsp olive oil",
      "Lemon, garlic, dill",
      "Handful rocket leaves",
    ],
    steps: [
      "Pat salmon dry, season with salt, pepper and dill.",
      "Sear skin-side down 4 min, flip and finish 3 min.",
      "Blanch green beans 3 min, toss with olive oil, garlic and lemon.",
      "Plate over rocket and finish with lemon zest.",
    ],
  },
  {
    id: "r2",
    name: "High-protein overnight oats",
    tag: "Breakfast",
    gi: "Medium",
    calories: 410,
    protein: 32,
    carbs: 42,
    fat: 11,
    minutes: 5,
    ingredients: [
      "40 g steel-cut oats",
      "200 g Greek yogurt",
      "1 scoop whey protein",
      "80 g blueberries",
      "1 tsp chia seeds",
    ],
    steps: [
      "Mix oats, yogurt, protein and chia in a jar.",
      "Refrigerate overnight.",
      "Top with blueberries before eating.",
    ],
  },
  {
    id: "r3",
    name: "Lentil & roasted vegetable bowl",
    tag: "Lunch",
    gi: "Low",
    calories: 470,
    protein: 24,
    carbs: 55,
    fat: 14,
    minutes: 35,
    ingredients: [
      "1 cup cooked lentils",
      "Zucchini, peppers, red onion",
      "1 tbsp olive oil",
      "Tahini + lemon dressing",
      "Fresh parsley",
    ],
    steps: [
      "Roast vegetables at 200 °C for 25 min.",
      "Warm lentils with cumin and paprika.",
      "Combine, dress with tahini-lemon and top with parsley.",
    ],
  },
  {
    id: "r4",
    name: "Chicken shawarma salad plate",
    tag: "Lunch",
    gi: "Low",
    calories: 450,
    protein: 45,
    carbs: 16,
    fat: 22,
    minutes: 20,
    ingredients: [
      "150 g chicken thigh, shawarma spice",
      "Cucumber, tomato, parsley",
      "2 tbsp garlic yogurt sauce",
      "Pickles and sumac onions",
    ],
    steps: [
      "Marinate chicken 10 min in spice and yogurt.",
      "Grill until charred, rest and slice.",
      "Build salad, add chicken and drizzle garlic yogurt.",
    ],
  },
  {
    id: "r5",
    name: "Tofu stir-fry with cauliflower rice",
    tag: "Dinner",
    gi: "Low",
    calories: 400,
    protein: 26,
    carbs: 22,
    fat: 21,
    minutes: 20,
    ingredients: [
      "150 g firm tofu",
      "300 g cauliflower rice",
      "Broccoli, snap peas, ginger, garlic",
      "1 tbsp soy sauce, 1 tsp sesame oil",
    ],
    steps: [
      "Press and cube tofu, sear until golden.",
      "Stir-fry vegetables with ginger and garlic.",
      "Add tofu, soy and sesame; serve on cauliflower rice.",
    ],
  },
  {
    id: "r6",
    name: "Egg & avocado protein toast",
    tag: "Breakfast",
    gi: "Medium",
    calories: 380,
    protein: 22,
    carbs: 28,
    fat: 20,
    minutes: 10,
    ingredients: [
      "1 slice dense rye bread",
      "2 eggs",
      "Half avocado",
      "Chilli flakes, lemon",
    ],
    steps: [
      "Poach or scramble eggs softly.",
      "Smash avocado with lemon and salt onto toasted rye.",
      "Top with eggs and chilli flakes.",
    ],
  },
];
