import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Clock, Flame, Check } from 'lucide-react';
import { TAG_COLORS, CATEGORY_ICONS } from '../data/meals';

export default function MealCard({
  meal,
  category,
  isExpanded,
  onToggleExpand,
  isFavorite,
  onUpvote,
  onDownvote,
  isSelectedForShopping,
  onToggleShoppingSelect,
}) {
  const tagStyle = TAG_COLORS[meal.tag] || TAG_COLORS['Everyday'];

  return (
    <div
      className={`bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${
        isFavorite ? 'ring-2 ring-yellow-500/50' : ''
      }`}
    >
      {/* Emoji Placeholder */}
      <div className="relative">
        <div className="w-full h-40 bg-gray-700/50 flex items-center justify-center">
          <span className="text-5xl">{CATEGORY_ICONS[category]}</span>
        </div>
        {/* Checkbox overlay */}
        <label className="absolute top-2 left-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelectedForShopping}
            onChange={(e) => {
              e.stopPropagation();
              onToggleShoppingSelect();
            }}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors backdrop-blur-sm ${
              isSelectedForShopping
                ? 'bg-blue-600 border-blue-600'
                : 'bg-black/30 border-white/50 hover:border-white'
            }`}
          >
            {isSelectedForShopping && <Check className="w-4 h-4 text-white" />}
          </div>
        </label>
        {/* Favorite star overlay */}
        {isFavorite && (
          <div className="absolute top-2 right-2 text-yellow-400 text-xl drop-shadow-lg">★</div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Meal info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm leading-tight mb-2">
              {meal.name}
            </h3>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                {meal.calories} cal
              </span>
              <span className="text-blue-400">{meal.protein} protein</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {meal.cookTime}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${tagStyle.bg} ${tagStyle.text}`}
              >
                {meal.tag}
              </span>
              {meal.mealPrep && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-orange-900/50 text-orange-400">
                  Meal Prep Friendly
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote();
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-green-900/50 text-green-400'
                  : 'hover:bg-green-900/30 text-gray-500 hover:text-green-400'
              }`}
              title="Upvote - Move to favorites"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownvote();
              }}
              className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-500 hover:text-red-400 transition-colors"
              title="Downvote - Hide meal"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={onToggleExpand}
          className="w-full mt-3 pt-2 border-t border-gray-700 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Recipe
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Recipe
            </>
          )}
        </button>
      </div>

      {/* Expanded Recipe Details */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/50">
          {/* Ingredients */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Ingredients</h4>
            <ul className="space-y-1">
              {meal.ingredients.map((ingredient, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-gray-500 mt-1">•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Instructions</h4>
            <div className="space-y-3">
              {meal.instructions.map((instruction) => (
                <div key={instruction.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {instruction.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{instruction.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{instruction.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Prep Notes */}
          {meal.mealPrepNotes && (
            <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-800/30">
              <h4 className="text-sm font-semibold text-orange-400 mb-1">Meal Prep Notes</h4>
              <p className="text-sm text-gray-300">{meal.mealPrepNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
