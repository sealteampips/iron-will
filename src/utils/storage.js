const STORAGE_KEY = 'progress-tracker-data';

export const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { entries: {}, startDate: '2025-12-08' };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { entries: {}, startDate: '2025-12-08' };
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getEntry = (date) => {
  const data = getStoredData();
  return data.entries[date] || null;
};

export const saveEntry = (date, entry) => {
  const data = getStoredData();
  data.entries[date] = { ...entry, date };
  saveData(data);
  return data;
};

export const getAllEntries = () => {
  const data = getStoredData();
  return Object.values(data.entries).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );
};

export const exportToJSON = () => {
  const data = getStoredData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `progress-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        saveData(data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Create default entry structure
// IMPORTANT: Sobriety defaults to TRUE (clean) - user toggles OFF to break streak
export const createDefaultEntry = (date) => ({
  date,
  sobriety: {
    cleanFromWeed: true,  // Default ON - toggle OFF to break streak
    cleanFromPorn: true,  // Default ON - toggle OFF to break streak
  },
  training: {
    type: null, // 'swim' | 'bike' | 'run' | 'strength' | 'rest'
    distance: 0,
    notes: '',
  },
  trading: {
    pnl: 0,
  },
  sleep: {
    hours: 0,
    quality: 0, // 1-5
  },
  mood: 5, // 1-10
  // XP Habits (simplified)
  habits: {
    meditation: 0,   // minutes (0/5/10)
    reading: 0,      // pages (0/1/5/10), requires book selection
    readingBookId: null, // which book pages are logged to
    journaling: false,   // boolean (yes/no)
    mobility: 0,     // minutes (0/5/10)
  },
});

// Simplified XP Calculation tiers - Perfect day = 120 XP
export const XP_TIERS = {
  meditation: [
    { min: 5, xp: 15 },
    { min: 10, xp: 30 },
  ],
  reading: [
    { min: 1, xp: 10 },
    { min: 5, xp: 20 },
    { min: 10, xp: 30 },
  ],
  journaling: [
    { min: 1, xp: 30 }, // boolean: 1 = true
  ],
  mobility: [
    { min: 5, xp: 15 },
    { min: 10, xp: 30 },
  ],
};

// Max possible daily XP
export const MAX_DAILY_XP = 120;

// Calculate XP for a habit based on value
export const calculateHabitXP = (habit, value) => {
  if (!value || value <= 0) return 0;
  const tiers = XP_TIERS[habit];
  if (!tiers) return 0;

  let xp = 0;
  for (const tier of tiers) {
    if (value >= tier.min) {
      xp = tier.xp;
    }
  }
  return xp;
};

// Calculate total daily XP from habits
export const calculateDailyXP = (habits) => {
  if (!habits) return 0;
  // Journaling is boolean, convert to 1/0 for XP calc
  const journalingValue = habits.journaling ? 1 : 0;
  return (
    calculateHabitXP('meditation', habits.meditation) +
    calculateHabitXP('reading', habits.reading) +
    calculateHabitXP('journaling', journalingValue) +
    calculateHabitXP('mobility', habits.mobility)
  );
};

// Get habit value, handling journaling as boolean
const getHabitValue = (entry, habit) => {
  const rawValue = entry.habits?.[habit];
  if (habit === 'journaling') {
    return rawValue ? 1 : 0;
  }
  return rawValue || 0;
};

// Calculate habit streaks and total XP from entries
export const calculateHabitStats = (entries, habit) => {
  if (!entries.length) return { current: 0, longest: 0, totalXP: 0 };

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let totalXP = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate current streak (counting back from today)
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const value = getHabitValue(entry, habit);

    // Check if this is consecutive
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    const entryDateStr = entryDate.toISOString().split('T')[0];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (entryDateStr === expectedDateStr && value > 0) {
      currentStreak++;
    } else if (entryDateStr === expectedDateStr) {
      break; // Date matches but no activity
    } else {
      break; // Gap in dates
    }
  }

  // Calculate longest streak and total XP
  const chronologicalEntries = [...entries].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  for (const entry of chronologicalEntries) {
    const value = getHabitValue(entry, habit);
    totalXP += calculateHabitXP(habit, value);

    if (value > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak, totalXP };
};

// Training Plan Workout Status Storage
const WORKOUT_STATUS_KEY = 'progress-tracker-workout-statuses';

export const getWorkoutStatuses = () => {
  try {
    const data = localStorage.getItem(WORKOUT_STATUS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading workout statuses:', error);
    return {};
  }
};

export const saveWorkoutStatuses = (statuses) => {
  try {
    localStorage.setItem(WORKOUT_STATUS_KEY, JSON.stringify(statuses));
  } catch (error) {
    console.error('Error saving workout statuses:', error);
  }
};

export const updateWorkoutStatus = (date, status) => {
  const statuses = getWorkoutStatuses();
  statuses[date] = { ...statuses[date], status };
  saveWorkoutStatuses(statuses);
  return statuses;
};

export const updateWorkoutNotes = (date, notes) => {
  const statuses = getWorkoutStatuses();
  statuses[date] = { ...statuses[date], notes };
  saveWorkoutStatuses(statuses);
  return statuses;
};

export const updateWorkoutDistance = (date, distance, workoutType) => {
  const statuses = getWorkoutStatuses();
  statuses[date] = {
    ...statuses[date],
    loggedDistance: distance,
    workoutType: workoutType
  };
  saveWorkoutStatuses(statuses);
  return statuses;
};

// Calculate Ironman totals from workout statuses (distances logged on calendar)
const METERS_PER_MILE = 1609.34;

export const calculateIronmanFromWorkouts = () => {
  const statuses = getWorkoutStatuses();
  const totals = { swim: 0, bike: 0, run: 0 };

  Object.values(statuses).forEach(workout => {
    if (workout.loggedDistance && workout.loggedDistance > 0 && workout.workoutType) {
      const distance = parseFloat(workout.loggedDistance);
      if (workout.workoutType === 'swim') {
        // Swim is logged in meters, convert to miles
        totals.swim += distance / METERS_PER_MILE;
      } else if (workout.workoutType === 'bike') {
        totals.bike += distance;
      } else if (workout.workoutType === 'run') {
        totals.run += distance;
      }
    }
  });

  return totals;
};

// Reset all logged distances (clears existing totals)
export const resetAllWorkoutDistances = () => {
  const statuses = getWorkoutStatuses();
  Object.keys(statuses).forEach(date => {
    delete statuses[date].loggedDistance;
    delete statuses[date].workoutType;
  });
  saveWorkoutStatuses(statuses);
  return statuses;
};

// Nutrition Preferences Storage
const NUTRITION_PREFS_KEY = 'progress-tracker-nutrition-prefs';

export const getNutritionPrefs = () => {
  try {
    const data = localStorage.getItem(NUTRITION_PREFS_KEY);
    return data ? JSON.parse(data) : { favorites: [], hidden: [] };
  } catch (error) {
    console.error('Error reading nutrition preferences:', error);
    return { favorites: [], hidden: [] };
  }
};

export const saveNutritionPrefs = (prefs) => {
  try {
    localStorage.setItem(NUTRITION_PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving nutrition preferences:', error);
  }
};

export const addFavorite = (mealKey) => {
  const prefs = getNutritionPrefs();
  if (!prefs.favorites.includes(mealKey)) {
    prefs.favorites.push(mealKey);
    saveNutritionPrefs(prefs);
  }
  return prefs;
};

export const removeFavorite = (mealKey) => {
  const prefs = getNutritionPrefs();
  prefs.favorites = prefs.favorites.filter((key) => key !== mealKey);
  saveNutritionPrefs(prefs);
  return prefs;
};

export const addHidden = (mealKey) => {
  const prefs = getNutritionPrefs();
  if (!prefs.hidden.includes(mealKey)) {
    prefs.hidden.push(mealKey);
    // Also remove from favorites if present
    prefs.favorites = prefs.favorites.filter((key) => key !== mealKey);
    saveNutritionPrefs(prefs);
  }
  return prefs;
};

export const restoreHidden = (mealKey) => {
  const prefs = getNutritionPrefs();
  prefs.hidden = prefs.hidden.filter((key) => key !== mealKey);
  saveNutritionPrefs(prefs);
  return prefs;
};

export const restoreAllHidden = () => {
  const prefs = getNutritionPrefs();
  prefs.hidden = [];
  saveNutritionPrefs(prefs);
  return prefs;
};

// Expose reset function globally for console access
if (typeof window !== 'undefined') {
  window.resetWorkoutDistances = resetAllWorkoutDistances;
  window.getWorkoutTotals = calculateIronmanFromWorkouts;
}
