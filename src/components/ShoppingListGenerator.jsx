import { useMemo, useState } from 'react';
import { X, Copy, Check, ShoppingCart } from 'lucide-react';
import { MEALS, SHOPPING_LIST_CATEGORIES } from '../data/meals';

// Ingredient category mapping for common ingredients
const INGREDIENT_CATEGORIES = {
  // Proteins
  chicken: 'proteins',
  turkey: 'proteins',
  beef: 'proteins',
  steak: 'proteins',
  salmon: 'proteins',
  tilapia: 'proteins',
  egg: 'proteins',
  sausage: 'proteins',
  jerky: 'proteins',
  yogurt: 'proteins',

  // Carbs
  rice: 'carbs',
  oat: 'carbs',
  potato: 'carbs',
  bread: 'carbs',
  sourdough: 'carbs',
  tortilla: 'carbs',
  pasta: 'carbs',
  spaghetti: 'carbs',
  'rice cake': 'carbs',

  // Vegetables
  'bell pepper': 'vegetables',
  onion: 'vegetables',
  asparagus: 'vegetables',
  'green bean': 'vegetables',
  'brussels': 'vegetables',
  zucchini: 'vegetables',
  carrot: 'vegetables',
  cucumber: 'vegetables',
  tomato: 'vegetables',
  lettuce: 'vegetables',
  romaine: 'vegetables',
  garlic: 'vegetables',

  // Fruits
  banana: 'fruits',
  apple: 'fruits',
  strawberr: 'fruits',
  blueberr: 'fruits',
  berr: 'fruits',
  avocado: 'fruits',
  lemon: 'fruits',
  lime: 'fruits',
  mango: 'fruits',

  // Pantry
  'olive oil': 'pantry',
  'almond butter': 'pantry',
  honey: 'pantry',
  'soy sauce': 'pantry',
  teriyaki: 'pantry',
  marinara: 'pantry',
  salsa: 'pantry',
  hummus: 'pantry',
  granola: 'pantry',
  nut: 'pantry',
  chocolate: 'pantry',
  chia: 'pantry',
  sesame: 'pantry',

  // Spices
  salt: 'spicesAndSeasonings',
  'black pepper': 'spicesAndSeasonings',
  'garlic powder': 'spicesAndSeasonings',
  cumin: 'spicesAndSeasonings',
  'chili powder': 'spicesAndSeasonings',
  paprika: 'spicesAndSeasonings',
  italian: 'spicesAndSeasonings',
  oregano: 'spicesAndSeasonings',
  cinnamon: 'spicesAndSeasonings',
  'everything bagel': 'spicesAndSeasonings',
  'red pepper flake': 'spicesAndSeasonings',

  // Dairy
  'almond milk': 'dairy',
  butter: 'dairy',
  cheese: 'dairy',

  // Condiments
  'hot sauce': 'condiments',
  mustard: 'condiments',
  ketchup: 'condiments',
  caesar: 'condiments',

  // Supplements
  protein: 'supplements',
  creatine: 'supplements',
  electrolyte: 'supplements',
};

function categorizeIngredient(ingredient) {
  const lowerIngredient = ingredient.toLowerCase();

  for (const [keyword, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (lowerIngredient.includes(keyword)) {
      return category;
    }
  }

  return 'pantry'; // Default category
}

const CATEGORY_LABELS = {
  proteins: 'Proteins',
  carbs: 'Carbs',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  pantry: 'Pantry',
  spicesAndSeasonings: 'Spices & Seasonings',
  dairy: 'Dairy',
  condiments: 'Condiments',
  supplements: 'Supplements',
};

export default function ShoppingListGenerator({ selectedMealIds, onClose }) {
  const [copied, setCopied] = useState(false);

  // Get all selected meals across categories
  const selectedMeals = useMemo(() => {
    const meals = [];
    Object.entries(MEALS).forEach(([category, categoryMeals]) => {
      categoryMeals.forEach((meal) => {
        const key = `${category}-${meal.id}`;
        if (selectedMealIds.includes(key)) {
          meals.push({ ...meal, category });
        }
      });
    });
    return meals;
  }, [selectedMealIds]);

  // Aggregate and categorize ingredients
  const categorizedIngredients = useMemo(() => {
    const ingredientMap = new Map();

    selectedMeals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        // Simple deduplication - just use ingredient text as key
        const key = ingredient.toLowerCase().trim();
        if (!ingredientMap.has(key)) {
          ingredientMap.set(key, {
            text: ingredient,
            category: categorizeIngredient(ingredient),
          });
        }
      });
    });

    // Group by category
    const grouped = {};
    ingredientMap.forEach(({ text, category }) => {
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(text);
    });

    // Sort ingredients within each category
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort();
    });

    return grouped;
  }, [selectedMeals]);

  // Generate plain text list for copying
  const plainTextList = useMemo(() => {
    let text = '🛒 SHOPPING LIST\n';
    text += `${selectedMeals.length} meals selected\n\n`;

    Object.entries(categorizedIngredients).forEach(([category, ingredients]) => {
      text += `--- ${CATEGORY_LABELS[category] || category} ---\n`;
      ingredients.forEach((ing) => {
        text += `☐ ${ing}\n`;
      });
      text += '\n';
    });

    return text;
  }, [categorizedIngredients, selectedMeals]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainTextList);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (selectedMeals.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping List
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-gray-400 text-center py-8">
            No meals selected. Check the boxes on meal cards to add them to your shopping list.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping List
            <span className="text-sm font-normal text-gray-400">
              ({selectedMeals.length} meals)
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy List
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Selected Meals Summary */}
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <p className="text-xs text-gray-400 mb-2">MEALS INCLUDED:</p>
          <div className="flex flex-wrap gap-2">
            {selectedMeals.map((meal) => (
              <span
                key={`${meal.category}-${meal.id}`}
                className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
              >
                {meal.name}
              </span>
            ))}
          </div>
        </div>

        {/* Ingredient List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(categorizedIngredients).map(([category, ingredients]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                {CATEGORY_LABELS[category] || category}
              </h3>
              <div className="space-y-1">
                {ingredients.map((ingredient, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-300 py-1"
                  >
                    <span className="w-4 h-4 border border-gray-600 rounded flex-shrink-0" />
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
