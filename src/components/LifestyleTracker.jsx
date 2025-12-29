import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Flame,
  Sparkles,
  Moon,
  Brain,
  BookOpen,
  PenLine,
  Activity,
  Smile,
  TrendingUp,
  Check,
} from 'lucide-react';
import {
  createDefaultEntry,
  calculateHabitXP,
  calculateDailyXP,
  calculateHabitStats,
  XP_TIERS,
  MAX_DAILY_XP,
} from '../utils/storage';
import { calculateStreaks } from '../utils/calculations';
import {
  getActiveBooks,
  setReadingForDate,
  getReadingForDate,
  recalculateBookProgress,
  updateCompoundProgress
} from '../utils/bookStorage';
import BookLibrary from './BookLibrary';
import CompoundProgress from './CompoundProgress';

// Simplified Habit Input Component
function HabitInput({ label, icon: Icon, value, onChange, options, unit, habit, isToggle = false }) {
  const xp = calculateHabitXP(habit, isToggle ? (value ? 1 : 0) : value);
  const maxXP = XP_TIERS[habit]?.[XP_TIERS[habit].length - 1]?.xp || 30;

  if (isToggle) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-3">
            {value && (
              <span className="text-xs font-bold text-amber-400">+{maxXP} XP</span>
            )}
            <button
              onClick={() => onChange(!value)}
              className={`w-16 h-8 rounded-lg font-medium text-sm transition-colors ${
                value
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {value ? 'Done' : 'No'}
            </button>
          </div>
        </div>
        {/* XP Progress indicator */}
        <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: value ? '100%' : '0%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        {xp > 0 && (
          <span className="text-xs font-bold text-amber-400">+{xp} XP</span>
        )}
      </div>

      {options ? (
        <div className="flex flex-wrap gap-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                value === opt
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {opt}{unit}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="w-20 bg-gray-600 text-white px-2 py-1 rounded text-sm border border-gray-500 focus:border-amber-500 focus:outline-none"
            placeholder="0"
          />
          <span className="text-xs text-gray-400">{unit}</span>
        </div>
      )}

      {/* XP Progress indicator */}
      <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${(xp / maxXP) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Reading Input with Book Selection and Custom Input
function ReadingInput({ value, bookId, onChange, onBookChange, selectedDate, onBooksUpdated }) {
  const [activeBooks, setActiveBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [todaysPendingPages, setTodaysPendingPages] = useState(0);

  // Tier options for quick selection
  const tierOptions = [0, 1, 5, 10];
  const isCustomValue = value > 0 && !tierOptions.includes(value);

  useEffect(() => {
    const loadBooks = async () => {
      const books = await getActiveBooks();
      setActiveBooks(books);
      setLoading(false);
    };
    loadBooks();
  }, [refreshKey]);

  // Sync custom input with value when it's a custom value
  useEffect(() => {
    if (isCustomValue) {
      setCustomInput(value.toString());
    } else {
      setCustomInput('');
    }
  }, [value, isCustomValue]);

  const xp = calculateHabitXP('reading', value);
  const maxXP = XP_TIERS.reading[XP_TIERS.reading.length - 1].xp;

  const handlePageSelect = async (pages) => {
    let targetBookId = bookId;

    if (pages > 0 && !bookId && activeBooks.length > 0) {
      // Auto-select first book if none selected
      targetBookId = activeBooks[0].id;
      onBookChange(targetBookId);
    }

    // Clear custom input when selecting a tier
    setCustomInput('');
    onChange(pages);

    // Save reading entry for this date (replaces any existing entry)
    if (targetBookId) {
      try {
        await setReadingForDate(selectedDate, targetBookId, pages);
        // Recalculate book's total from all logs
        await recalculateBookProgress(targetBookId);
        // Refresh books to show updated progress
        setRefreshKey(k => k + 1);
        onBooksUpdated?.();
      } catch (error) {
        console.error('Error saving reading:', error);
      }
    }
  };

  const handleCustomInputChange = (e) => {
    const inputValue = e.target.value;
    setCustomInput(inputValue);

    // Only update if it's a valid number
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 500) {
      handlePageSelect(numValue);
    } else if (inputValue === '' || inputValue === '0') {
      handlePageSelect(0);
    }
  };

  const handleCustomInputBlur = () => {
    // Ensure value is within bounds on blur
    const numValue = parseInt(customInput);
    if (isNaN(numValue) || numValue < 0) {
      setCustomInput('');
      handlePageSelect(0);
    } else if (numValue > 500) {
      setCustomInput('500');
      handlePageSelect(500);
    }
  };

  return (
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">Reading</span>
        </div>
        {xp > 0 && (
          <span className="text-xs font-bold text-amber-400">+{xp} XP</span>
        )}
      </div>

      {activeBooks.length === 0 ? (
        <p className="text-xs text-gray-500 mb-2">Add a book to track reading</p>
      ) : (
        <div className="mb-2">
          <select
            value={bookId || ''}
            onChange={(e) => onBookChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full bg-gray-600 text-white px-2 py-1 rounded text-xs border border-gray-500 focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select book...</option>
            {activeBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.pages_read}/{book.total_pages})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1">
        {tierOptions.map((pages) => (
          <button
            key={pages}
            onClick={() => handlePageSelect(pages)}
            disabled={pages > 0 && activeBooks.length === 0}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              value === pages && !isCustomValue
                ? 'bg-amber-600 text-white'
                : pages > 0 && activeBooks.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            {pages === 0 ? '0' : `${pages} pg`}
          </button>
        ))}
        {/* Custom input */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="1"
            max="500"
            placeholder="Custom"
            value={customInput}
            onChange={handleCustomInputChange}
            onBlur={handleCustomInputBlur}
            disabled={activeBooks.length === 0}
            className={`w-16 px-2 py-1.5 rounded text-xs border focus:outline-none transition-colors ${
              isCustomValue
                ? 'bg-amber-600 text-white border-amber-600'
                : activeBooks.length === 0
                ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                : 'bg-gray-600 text-gray-300 border-gray-500 focus:border-amber-500'
            }`}
          />
          <span className="text-xs text-gray-400">pg</span>
        </div>
      </div>

      {/* XP Progress indicator */}
      <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${(xp / maxXP) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Streak Display Component
function StreakDisplay({ current, best, color }) {
  return (
    <div className="flex items-center gap-2">
      <Flame className={`w-4 h-4 ${color}`} />
      <div>
        <span className="text-lg font-bold">{current}</span>
        <span className="text-xs text-gray-400 ml-1">days</span>
      </div>
      <span className="text-xs text-gray-500">Best: {best}</span>
    </div>
  );
}

// Habit Stats Card
function HabitStatsCard({ label, icon: Icon, stats, color }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <StreakDisplay current={stats.current} best={stats.longest} color={color} />
        <div className="text-right">
          <div className="text-sm font-bold text-amber-400">{stats.totalXP}</div>
          <div className="text-xs text-gray-500">Total XP</div>
        </div>
      </div>
    </div>
  );
}

export default function LifestyleTracker({ entries, selectedDate, onDateChange, currentEntry, onSave }) {
  const [formData, setFormData] = useState(() => {
    if (currentEntry) return currentEntry;
    return createDefaultEntry(selectedDate);
  });
  const [activeBooks, setActiveBooks] = useState([]);
  const [compoundRefreshKey, setCompoundRefreshKey] = useState(0);
  const [booksRefreshKey, setBooksRefreshKey] = useState(0);

  useEffect(() => {
    if (currentEntry) {
      // Merge with default to ensure all fields exist
      const defaultEntry = createDefaultEntry(selectedDate);
      setFormData({
        ...defaultEntry,
        ...currentEntry,
        sobriety: { ...defaultEntry.sobriety, ...currentEntry.sobriety },
        habits: { ...defaultEntry.habits, ...currentEntry.habits },
        sleep: { ...defaultEntry.sleep, ...currentEntry.sleep },
        trading: { ...defaultEntry.trading, ...currentEntry.trading },
      });
    } else {
      setFormData(createDefaultEntry(selectedDate));
    }
  }, [currentEntry, selectedDate]);

  // Update compound progress when habits change
  useEffect(() => {
    const dailyXP = calculateDailyXP(formData.habits);
    updateCompoundProgress(selectedDate, dailyXP)
      .then(() => {
        // Trigger compound progress component to refresh
        setCompoundRefreshKey(k => k + 1);
      })
      .catch(console.error);
  }, [formData.habits, selectedDate]);

  // Merge current form data into entries for accurate streak calculation
  const entriesWithCurrent = useMemo(() => {
    // Create a copy of entries
    const merged = entries.filter(e => e.date !== selectedDate);
    // Add current form data
    merged.push({ ...formData, date: selectedDate });
    return merged;
  }, [entries, formData, selectedDate]);

  // Calculate streaks using merged entries (includes current unsaved changes)
  const weedStreaks = useMemo(() => calculateStreaks(entriesWithCurrent, 'cleanFromWeed'), [entriesWithCurrent]);
  const pornStreaks = useMemo(() => calculateStreaks(entriesWithCurrent, 'cleanFromPorn'), [entriesWithCurrent]);
  const meditationStats = useMemo(() => calculateHabitStats(entriesWithCurrent, 'meditation'), [entriesWithCurrent]);
  const readingStats = useMemo(() => calculateHabitStats(entriesWithCurrent, 'reading'), [entriesWithCurrent]);
  const journalingStats = useMemo(() => calculateHabitStats(entriesWithCurrent, 'journaling'), [entriesWithCurrent]);
  const mobilityStats = useMemo(() => calculateHabitStats(entriesWithCurrent, 'mobility'), [entriesWithCurrent]);

  // Calculate total XP
  const totalXP = useMemo(() => {
    return meditationStats.totalXP + readingStats.totalXP + journalingStats.totalXP + mobilityStats.totalXP;
  }, [meditationStats, readingStats, journalingStats, mobilityStats]);

  const dailyXP = useMemo(() => calculateDailyXP(formData.habits), [formData.habits]);

  const handleChange = (field, value) => {
    const newData = { ...formData };

    if (field.includes('.')) {
      const parts = field.split('.');
      if (parts.length === 2) {
        newData[parts[0]] = { ...newData[parts[0]], [parts[1]]: value };
      }
    } else {
      newData[field] = value;
    }

    setFormData(newData);
    onSave(selectedDate, newData);
  };

  const navigateDate = (direction) => {
    const currentDate = parseISO(selectedDate);
    const newDate = direction === 'prev'
      ? subDays(currentDate, 1)
      : addDays(currentDate, 1);
    onDateChange(format(newDate, 'yyyy-MM-dd'));
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Daily Entry Section */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            {isToday && (
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Today</span>
            )}
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sobriety Section - Left */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sobriety</h3>

            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Clean from weed</span>
              </div>
              <div className="flex items-center gap-3">
                <StreakDisplay
                  current={weedStreaks.current}
                  best={weedStreaks.longest}
                  color="text-green-400"
                />
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sobriety?.cleanFromWeed ?? true}
                    onChange={(e) => handleChange('sobriety.cleanFromWeed', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-red-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Clean from porn</span>
              </div>
              <div className="flex items-center gap-3">
                <StreakDisplay
                  current={pornStreaks.current}
                  best={pornStreaks.longest}
                  color="text-blue-400"
                />
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sobriety?.cleanFromPorn ?? true}
                    onChange={(e) => handleChange('sobriety.cleanFromPorn', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-red-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Sleep Section - Right */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Sleep
            </h3>
            <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="Hours"
                value={formData.sleep?.hours || ''}
                onChange={(e) => handleChange('sleep.hours', parseFloat(e.target.value) || 0)}
                className="w-16 bg-gray-600 text-white px-2 py-1 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-gray-400 text-sm">hrs</span>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Quality:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleChange('sleep.quality', num)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        formData.sleep?.quality === num
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy / Mood Section - Full Width */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Smile className="w-4 h-4" />
            Energy / Mood: <span className="text-white">{formData.mood || 5}</span>
          </h3>
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <span className="text-red-400 text-xs">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood || 5}
              onChange={(e) => handleChange('mood', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-green-400 text-xs">10</span>
          </div>
        </div>

        {/* XP Habits Section - Simplified */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          {/* Daily XP Banner - Inside XP Habits section */}
          <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">XP Habits</span>
              </div>
              <span className="text-xl font-bold text-amber-400">{dailyXP} / {MAX_DAILY_XP} XP</span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${(dailyXP / MAX_DAILY_XP) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HabitInput
              label="Meditation"
              icon={Brain}
              value={formData.habits?.meditation || 0}
              onChange={(v) => handleChange('habits.meditation', v)}
              options={[0, 5, 10]}
              unit=" min"
              habit="meditation"
            />

            <ReadingInput
              value={formData.habits?.reading || 0}
              bookId={formData.habits?.readingBookId}
              onChange={(v) => handleChange('habits.reading', v)}
              onBookChange={(id) => handleChange('habits.readingBookId', id)}
              selectedDate={selectedDate}
              onBooksUpdated={() => setBooksRefreshKey(k => k + 1)}
            />

            <HabitInput
              label="Journaling"
              icon={PenLine}
              value={formData.habits?.journaling || false}
              onChange={(v) => handleChange('habits.journaling', v)}
              habit="journaling"
              isToggle={true}
            />

            <HabitInput
              label="Mobility"
              icon={Activity}
              value={formData.habits?.mobility || 0}
              onChange={(v) => handleChange('habits.mobility', v)}
              options={[0, 5, 10]}
              unit=" min"
              habit="mobility"
            />
          </div>
        </div>
      </div>

      {/* Book Library Section */}
      <BookLibrary onBooksChange={setActiveBooks} refreshKey={booksRefreshKey} />

      {/* Streaks & XP Summary Section */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Streaks & Progress
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-400">{totalXP}</div>
            <div className="text-xs text-gray-500">Total XP</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HabitStatsCard
            label="Meditation"
            icon={Brain}
            stats={meditationStats}
            color="text-purple-400"
          />
          <HabitStatsCard
            label="Reading"
            icon={BookOpen}
            stats={readingStats}
            color="text-blue-400"
          />
          <HabitStatsCard
            label="Journaling"
            icon={PenLine}
            stats={journalingStats}
            color="text-pink-400"
          />
          <HabitStatsCard
            label="Mobility"
            icon={Activity}
            stats={mobilityStats}
            color="text-green-400"
          />
        </div>
      </div>

      {/* Compound Progress Section */}
      <CompoundProgress entries={entries} refreshKey={compoundRefreshKey} />
    </div>
  );
}
