import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { MEALS, CATEGORY_ICONS } from '../data/meals';
import {
  getNutritionPrefs,
  addFavorite,
  removeFavorite,
  addHidden,
  restoreHidden,
  restoreAllHidden,
} from '../utils/storage';
import MealCard from './MealCard';
import ShoppingListGenerator from './ShoppingListGenerator';

const CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🥗' },
  { id: 'dinner', label: 'Dinner', icon: '🍽️' },
  { id: 'snacks', label: 'Snacks', icon: '🥜' },
];

export default function NutritionTracker() {
  const [selectedCategory, setSelectedCategory] = useState('breakfast');
  const [expandedMealId, setExpandedMealId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [selectedForShopping, setSelectedForShopping] = useState([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showHiddenManager, setShowHiddenManager] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const prefs = getNutritionPrefs();
    setFavorites(prefs.favorites);
    setHidden(prefs.hidden);
  }, []);

  // Get meals for current category, sorted with favorites first, hidden filtered out
  const displayedMeals = useMemo(() => {
    const categoryMeals = MEALS[selectedCategory] || [];

    // Filter out hidden meals
    const visibleMeals = categoryMeals.filter((meal) => {
      const key = `${selectedCategory}-${meal.id}`;
      return !hidden.includes(key);
    });

    // Sort: favorites first, then by original order
    return visibleMeals.sort((a, b) => {
      const aKey = `${selectedCategory}-${a.id}`;
      const bKey = `${selectedCategory}-${b.id}`;
      const aFav = favorites.includes(aKey);
      const bFav = favorites.includes(bKey);

      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [selectedCategory, favorites, hidden]);

  // Get hidden meals for the manager
  const hiddenMeals = useMemo(() => {
    const allHidden = [];
    Object.entries(MEALS).forEach(([category, meals]) => {
      meals.forEach((meal) => {
        const key = `${category}-${meal.id}`;
        if (hidden.includes(key)) {
          allHidden.push({ ...meal, category, key });
        }
      });
    });
    return allHidden;
  }, [hidden]);

  const handleUpvote = (category, mealId) => {
    const key = `${category}-${mealId}`;
    if (favorites.includes(key)) {
      const prefs = removeFavorite(key);
      setFavorites(prefs.favorites);
    } else {
      const prefs = addFavorite(key);
      setFavorites(prefs.favorites);
    }
  };

  const handleDownvote = (category, mealId) => {
    const key = `${category}-${mealId}`;
    const prefs = addHidden(key);
    setHidden(prefs.hidden);
    setFavorites(prefs.favorites);
    // Also remove from shopping selection
    setSelectedForShopping((prev) => prev.filter((k) => k !== key));
  };

  const handleRestoreHidden = (key) => {
    const prefs = restoreHidden(key);
    setHidden(prefs.hidden);
  };

  const handleRestoreAllHidden = () => {
    const prefs = restoreAllHidden();
    setHidden(prefs.hidden);
    setShowHiddenManager(false);
  };

  const handleToggleExpand = (category, mealId) => {
    const key = `${category}-${mealId}`;
    setExpandedMealId((prev) => (prev === key ? null : key));
  };

  const handleToggleShoppingSelect = (category, mealId) => {
    const key = `${category}-${mealId}`;
    setSelectedForShopping((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleClearSelection = () => {
    setSelectedForShopping([]);
  };

  // Count selected meals per category for badge
  const selectedCountByCategory = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = selectedForShopping.filter((key) => key.startsWith(cat.id + '-')).length;
    });
    return counts;
  }, [selectedForShopping]);

  return (
    <div className="space-y-4">
      {/* Category Sub-tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setExpandedMealId(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
            {selectedCountByCategory[cat.id] > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-xs flex items-center justify-center text-white">
                {selectedCountByCategory[cat.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <ShoppingCart className="w-4 h-4" />
          <span>{selectedForShopping.length} meals selected</span>
          {selectedForShopping.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="text-red-400 hover:text-red-300 ml-2"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hidden.length > 0 && (
            <button
              onClick={() => setShowHiddenManager(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              Hidden ({hidden.length})
            </button>
          )}
          <button
            onClick={() => setShowShoppingList(true)}
            className="flex items-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Generate Shopping List
          </button>
        </div>
      </div>

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedMeals.map((meal) => {
          const key = `${selectedCategory}-${meal.id}`;
          return (
            <MealCard
              key={key}
              meal={meal}
              category={selectedCategory}
              isExpanded={expandedMealId === key}
              onToggleExpand={() => handleToggleExpand(selectedCategory, meal.id)}
              isFavorite={favorites.includes(key)}
              onUpvote={() => handleUpvote(selectedCategory, meal.id)}
              onDownvote={() => handleDownvote(selectedCategory, meal.id)}
              isSelectedForShopping={selectedForShopping.includes(key)}
              onToggleShoppingSelect={() => handleToggleShoppingSelect(selectedCategory, meal.id)}
            />
          );
        })}
      </div>

      {displayedMeals.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>All meals in this category have been hidden.</p>
          <button
            onClick={() => setShowHiddenManager(true)}
            className="mt-2 text-blue-400 hover:text-blue-300"
          >
            Manage hidden meals
          </button>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <ShoppingListGenerator
          selectedMealIds={selectedForShopping}
          onClose={() => setShowShoppingList(false)}
        />
      )}

      {/* Hidden Meals Manager Modal */}
      {showHiddenManager && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <EyeOff className="w-5 h-5" />
                Hidden Meals ({hidden.length})
              </h2>
              <button
                onClick={() => setShowHiddenManager(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {hiddenMeals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hidden meals</p>
              ) : (
                <div className="space-y-2">
                  {hiddenMeals.map((meal) => (
                    <div
                      key={meal.key}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span>{CATEGORY_ICONS[meal.category]}</span>
                        <div>
                          <p className="text-sm text-white">{meal.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{meal.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestoreHidden(meal.key)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex gap-2">
              {hiddenMeals.length > 0 && (
                <button
                  onClick={handleRestoreAllHidden}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore All
                </button>
              )}
              <button
                onClick={() => setShowHiddenManager(false)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
