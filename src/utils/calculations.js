import { format, parseISO, differenceInDays, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from 'date-fns';

// Ironman distances in miles
export const IRONMAN = {
  swim: 2.4,
  bike: 112,
  run: 26.2,
};

// Convert distance to miles based on unit
export const convertToMiles = (distance, unit) => {
  if (!distance || distance === 0) return 0;
  if (unit === 'meters') {
    return distance / 1609.34; // 1 mile = 1609.34 meters
  }
  return distance; // Already in miles
};

// Get distance in miles from a training entry
export const getDistanceInMiles = (entry) => {
  if (!entry?.training?.distance) return 0;
  const unit = entry.training.distanceUnit || 'miles'; // Default to miles for legacy data
  return convertToMiles(entry.training.distance, unit);
};

// Calculate sobriety streaks
// Missing days count as clean - only explicitly OFF (false) breaks the streak
export const calculateStreaks = (entries, field) => {
  if (!entries.length) return { current: 0, longest: 0 };

  // Create a map of entries by date for quick lookup
  const entriesMap = {};
  entries.forEach(entry => {
    entriesMap[entry.date] = entry;
  });

  // Find the earliest entry date to know where to start counting
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );
  const earliestDate = parseISO(sortedEntries[0].date);

  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper: check if a date has an explicit OFF (false) for the field
  const isExplicitlyOff = (dateStr) => {
    const entry = entriesMap[dateStr];
    // Only return true if entry exists AND sobriety field is explicitly false
    return entry?.sobriety?.[field] === false;
  };

  // Calculate current streak (counting back from today)
  let currentStreak = 0;
  let checkDate = new Date(today);

  while (checkDate >= earliestDate) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');

    if (isExplicitlyOff(dateStr)) {
      // Found an explicit OFF - streak breaks here
      break;
    }

    // Day is clean (either explicitly ON, missing entry, or no sobriety data)
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate longest streak by iterating through all days from earliest to today
  let longestStreak = 0;
  let tempStreak = 0;
  let iterDate = new Date(earliestDate);

  while (iterDate <= today) {
    const dateStr = format(iterDate, 'yyyy-MM-dd');

    if (isExplicitlyOff(dateStr)) {
      // Explicit OFF breaks the streak
      tempStreak = 0;
    } else {
      // Clean day (explicit ON, missing, or no data)
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    iterDate.setDate(iterDate.getDate() + 1);
  }

  return { current: currentStreak, longest: longestStreak };
};

// Calculate training totals (all distances in miles)
export const calculateTrainingTotals = (entries) => {
  const totals = {
    swim: 0,
    bike: 0,
    run: 0,
    strength: 0,
    rest: 0,
  };

  entries.forEach(entry => {
    if (entry.training?.type && entry.training.type !== 'rest' && entry.training.type !== 'strength') {
      // Convert to miles for consistent stats
      totals[entry.training.type] += getDistanceInMiles(entry);
    } else if (entry.training?.type === 'strength') {
      totals.strength++;
    } else if (entry.training?.type === 'rest') {
      totals.rest++;
    }
  });

  return totals;
};

// Calculate Ironman progress
export const calculateIronmanProgress = (entries) => {
  const totals = calculateTrainingTotals(entries);

  const ironmansCompleted = {
    swim: Math.floor(totals.swim / IRONMAN.swim),
    bike: Math.floor(totals.bike / IRONMAN.bike),
    run: Math.floor(totals.run / IRONMAN.run),
  };

  // The limiting discipline determines completed full Ironmans
  const fullIronmans = Math.min(
    ironmansCompleted.swim,
    ironmansCompleted.bike,
    ironmansCompleted.run
  );

  // Progress toward next Ironman for each discipline
  const nextIronmanProgress = {
    swim: {
      current: totals.swim - (fullIronmans * IRONMAN.swim),
      target: IRONMAN.swim,
      percentage: ((totals.swim - (fullIronmans * IRONMAN.swim)) / IRONMAN.swim) * 100,
    },
    bike: {
      current: totals.bike - (fullIronmans * IRONMAN.bike),
      target: IRONMAN.bike,
      percentage: ((totals.bike - (fullIronmans * IRONMAN.bike)) / IRONMAN.bike) * 100,
    },
    run: {
      current: totals.run - (fullIronmans * IRONMAN.run),
      target: IRONMAN.run,
      percentage: ((totals.run - (fullIronmans * IRONMAN.run)) / IRONMAN.run) * 100,
    },
  };

  return {
    fullIronmans,
    totals,
    nextIronmanProgress,
  };
};

// Calculate weekly training volume (all distances in miles)
export const calculateWeeklyVolume = (entries, date = new Date()) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

  const weekEntries = entries.filter(entry => {
    const entryDate = parseISO(entry.date);
    return !isBefore(entryDate, weekStart) && !isAfter(entryDate, weekEnd);
  });

  const volume = {
    swim: 0,
    bike: 0,
    run: 0,
    strength: 0,
    rest: 0,
    total: 0,
  };

  weekEntries.forEach(entry => {
    if (entry.training?.type) {
      if (['swim', 'bike', 'run'].includes(entry.training.type)) {
        // Convert to miles for consistent stats
        const distanceInMiles = getDistanceInMiles(entry);
        volume[entry.training.type] += distanceInMiles;
        volume.total += distanceInMiles;
      } else {
        volume[entry.training.type]++;
      }
    }
  });

  return volume;
};

// Calculate cumulative P&L
export const calculateCumulativePnL = (entries) => {
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  let cumulative = 0;
  return sortedEntries.map(entry => {
    cumulative += entry.trading?.pnl || 0;
    return {
      date: entry.date,
      pnl: entry.trading?.pnl || 0,
      cumulative,
    };
  });
};

// Calculate monthly P&L summary
export const calculateMonthlyPnL = (entries) => {
  const monthly = {};

  entries.forEach(entry => {
    const month = format(parseISO(entry.date), 'yyyy-MM');
    if (!monthly[month]) {
      monthly[month] = { total: 0, days: 0, positive: 0, negative: 0 };
    }
    monthly[month].total += entry.trading?.pnl || 0;
    monthly[month].days++;
    if ((entry.trading?.pnl || 0) > 0) monthly[month].positive++;
    if ((entry.trading?.pnl || 0) < 0) monthly[month].negative++;
  });

  return Object.entries(monthly).map(([month, data]) => ({
    month,
    ...data,
  })).sort((a, b) => a.month.localeCompare(b.month));
};

// Get calendar data for heatmap
export const getCalendarData = (entries, year, month) => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start, end });

  const entriesMap = {};
  entries.forEach(entry => {
    entriesMap[entry.date] = entry;
  });

  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return {
      date: dateStr,
      day: format(day, 'd'),
      dayOfWeek: day.getDay(),
      entry: entriesMap[dateStr] || null,
    };
  });
};

// Calculate average sleep
export const calculateAverageSleep = (entries) => {
  const sleepEntries = entries.filter(e => e.sleep?.hours > 0);
  if (!sleepEntries.length) return { avgHours: 0, avgQuality: 0 };

  const totalHours = sleepEntries.reduce((sum, e) => sum + (e.sleep?.hours || 0), 0);
  const totalQuality = sleepEntries.reduce((sum, e) => sum + (e.sleep?.quality || 0), 0);

  return {
    avgHours: (totalHours / sleepEntries.length).toFixed(1),
    avgQuality: (totalQuality / sleepEntries.length).toFixed(1),
  };
};

// Calculate mobility percentage
export const calculateMobilityRate = (entries) => {
  if (!entries.length) return 0;
  const mobilityDays = entries.filter(e => e.mobility).length;
  return Math.round((mobilityDays / entries.length) * 100);
};

// Calculate average mood
export const calculateAverageMood = (entries) => {
  const moodEntries = entries.filter(e => e.mood > 0);
  if (!moodEntries.length) return 0;
  const total = moodEntries.reduce((sum, e) => sum + e.mood, 0);
  return (total / moodEntries.length).toFixed(1);
};
