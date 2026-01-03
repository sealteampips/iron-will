import { supabase } from './supabase';

// ============ DAILY ENTRIES ============

// Transform Supabase row to app format
const transformDailyEntryFromDB = (row) => {
  if (!row) return null;
  return {
    date: row.date,
    sobriety: {
      cleanFromWeed: row.weed_clean ?? true,
    },
    sleep: {
      hours: row.sleep_hours || 0,
      quality: row.sleep_quality || 0,
    },
    mood: row.energy_mood || 5,
    habits: {
      meditation: row.meditation_minutes || 0,
      reading: row.reading_pages || 0,
      readingBookId: null, // Handle separately if needed
      journaling: row.journaling || false,
      mobility: row.mobility_minutes || 0,
    },
    trading: {
      pnl: row.trading_pnl || 0,
    },
    training: {
      type: null,
      distance: 0,
      notes: '',
    },
  };
};

// Transform app format to Supabase row
const transformDailyEntryToDB = (entry) => {
  return {
    date: entry.date,
    sleep_hours: entry.sleep?.hours || 0,
    sleep_quality: entry.sleep?.quality || 0,
    energy_mood: entry.mood || 5,
    weed_clean: entry.sobriety?.cleanFromWeed ?? true,
    meditation_minutes: entry.habits?.meditation || 0,
    reading_pages: entry.habits?.reading || 0,
    journaling: entry.habits?.journaling || false,
    mobility_minutes: entry.habits?.mobility || 0,
    trading_pnl: entry.trading?.pnl || 0,
  };
};

// Get all daily entries
export const getAllDailyEntries = async () => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching daily entries:', error);
    return [];
  }

  return data.map(transformDailyEntryFromDB);
};

// Get entry for a specific date
export const getDailyEntry = async (date) => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching daily entry:', error);
    return null;
  }

  return transformDailyEntryFromDB(data);
};

// Save/update entry for a date (upsert)
export const saveDailyEntry = async (date, entry) => {
  const dbEntry = transformDailyEntryToDB({ ...entry, date });

  const { data, error } = await supabase
    .from('daily_entries')
    .upsert(dbEntry, { onConflict: 'date' })
    .select()
    .single();

  if (error) {
    console.error('Error saving daily entry:', error);
    throw new Error(`Failed to save entry: ${error.message}`);
  }

  return transformDailyEntryFromDB(data);
};

// Delete entry for a date
export const deleteDailyEntry = async (date) => {
  const { error } = await supabase
    .from('daily_entries')
    .delete()
    .eq('date', date);

  if (error) {
    console.error('Error deleting daily entry:', error);
    return false;
  }

  return true;
};

// ============ WORKOUTS ============

// Transform Supabase row to app format
const transformWorkoutFromDB = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    date: row.date,
    workoutType: row.workout_type,
    plannedDuration: row.planned_duration,
    actualDuration: row.actual_duration,
    plannedDistance: row.planned_distance,
    loggedDistance: row.actual_distance,
    heartRateAvg: row.heart_rate_avg,
    notes: row.notes || '',
    status: row.status || 'pending',
    phase: row.phase,
  };
};

// Transform app format to Supabase row
const transformWorkoutToDB = (workout) => {
  return {
    date: workout.date,
    workout_type: workout.workoutType,
    planned_duration: workout.plannedDuration,
    actual_duration: workout.actualDuration,
    planned_distance: workout.plannedDistance,
    actual_distance: workout.loggedDistance,
    heart_rate_avg: workout.heartRateAvg,
    notes: workout.notes || '',
    status: workout.status || 'pending',
    phase: workout.phase,
  };
};

// Get all workouts
export const getAllWorkouts = async () => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }

  return data.map(transformWorkoutFromDB);
};

// Get workout for a specific date
export const getWorkoutByDate = async (date) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching workout:', error);
    return null;
  }

  return transformWorkoutFromDB(data);
};

// Get all workouts as a status map (for compatibility with existing code)
export const getWorkoutStatusesFromDB = async () => {
  const workouts = await getAllWorkouts();
  const statusMap = {};

  workouts.forEach(workout => {
    statusMap[workout.date] = {
      status: workout.status,
      notes: workout.notes,
      loggedDistance: workout.loggedDistance,
      workoutType: workout.workoutType,
    };
  });

  return statusMap;
};

// Save/update workout (upsert by date)
export const saveWorkout = async (date, workoutData) => {
  const dbWorkout = transformWorkoutToDB({ ...workoutData, date });

  const { data, error } = await supabase
    .from('workouts')
    .upsert(dbWorkout, { onConflict: 'date' })
    .select()
    .single();

  if (error) {
    console.error('Error saving workout:', error);
    throw new Error(`Failed to save workout: ${error.message}`);
  }

  return transformWorkoutFromDB(data);
};

// Update workout status
export const updateWorkoutStatusInDB = async (date, status) => {
  // First check if workout exists
  const existing = await getWorkoutByDate(date);

  if (existing) {
    const { data, error } = await supabase
      .from('workouts')
      .update({ status })
      .eq('date', date)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout status:', error);
      return null;
    }
    return transformWorkoutFromDB(data);
  } else {
    // Create new workout with just the status
    return saveWorkout(date, { status });
  }
};

// Update workout notes
export const updateWorkoutNotesInDB = async (date, notes) => {
  const existing = await getWorkoutByDate(date);

  if (existing) {
    const { data, error } = await supabase
      .from('workouts')
      .update({ notes })
      .eq('date', date)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout notes:', error);
      return null;
    }
    return transformWorkoutFromDB(data);
  } else {
    return saveWorkout(date, { notes });
  }
};

// Update workout distance
export const updateWorkoutDistanceInDB = async (date, distance, workoutType) => {
  const existing = await getWorkoutByDate(date);

  if (existing) {
    const { data, error } = await supabase
      .from('workouts')
      .update({ actual_distance: distance, workout_type: workoutType })
      .eq('date', date)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout distance:', error);
      return null;
    }
    return transformWorkoutFromDB(data);
  } else {
    return saveWorkout(date, { loggedDistance: distance, workoutType });
  }
};

// Calculate Ironman totals from workouts
const METERS_PER_MILE = 1609.34;

export const calculateIronmanFromWorkoutsDB = async () => {
  const workouts = await getAllWorkouts();
  const totals = { swim: 0, bike: 0, run: 0 };

  workouts.forEach(workout => {
    if (workout.loggedDistance && workout.loggedDistance > 0 && workout.workoutType) {
      const distance = parseFloat(workout.loggedDistance);
      if (workout.workoutType === 'swim') {
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

// ============ BOOKS ============

// Transform Supabase row to app format
const transformBookFromDB = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    total_pages: row.total_pages,
    pages_read: row.current_page || 0,
    status: row.status || 'active',
    started_date: row.started_at,
    completed_date: row.completed_at,
  };
};

// Transform app format to Supabase row
const transformBookToDB = (book) => {
  return {
    title: book.title,
    author: book.author,
    total_pages: book.total_pages,
    current_page: book.pages_read || 0,
    status: book.status || 'active',
    started_at: book.started_date || new Date().toISOString(),
    completed_at: book.completed_date || null,
  };
};

// Get all books
export const getAllBooks = async (status = null) => {
  let query = supabase.from('books').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('started_at', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data.map(transformBookFromDB);
};

// Get active books
export const getActiveBooksFromDB = async () => {
  return getAllBooks('active');
};

// Get completed books
export const getCompletedBooksFromDB = async (year = null) => {
  const books = await getAllBooks('completed');

  if (!year) return books;

  return books.filter((book) => {
    if (!book.completed_date) return false;
    const completedYear = new Date(book.completed_date).getFullYear();
    return completedYear === year;
  });
};

// Add a new book
export const addBookToDB = async (book) => {
  const dbBook = transformBookToDB({
    ...book,
    pages_read: 0,
    status: 'active',
    started_date: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from('books')
    .insert(dbBook)
    .select()
    .single();

  if (error) {
    console.error('Error adding book:', error);
    return null;
  }

  return transformBookFromDB(data);
};

// Update a book
export const updateBookInDB = async (id, updates) => {
  const dbUpdates = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.author !== undefined) dbUpdates.author = updates.author;
  if (updates.total_pages !== undefined) dbUpdates.total_pages = updates.total_pages;
  if (updates.pages_read !== undefined) dbUpdates.current_page = updates.pages_read;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.completed_date !== undefined) dbUpdates.completed_at = updates.completed_date;

  const { data, error } = await supabase
    .from('books')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating book:', error);
    return null;
  }

  return transformBookFromDB(data);
};

// Mark book as complete
export const markBookCompleteInDB = async (id) => {
  return updateBookInDB(id, {
    status: 'completed',
    completed_date: new Date().toISOString(),
  });
};

// Abandon book
export const abandonBookInDB = async (id) => {
  return updateBookInDB(id, {
    status: 'abandoned',
    completed_date: new Date().toISOString(),
  });
};

// Delete a book
export const deleteBookFromDB = async (id) => {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting book:', error);
    return false;
  }

  return true;
};

// Add pages to a book
export const addPagesToBookInDB = async (bookId, pages) => {
  // Get current book
  const { data: book, error: fetchError } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (fetchError) {
    console.error('Error fetching book:', fetchError);
    return null;
  }

  const newPagesRead = Math.min((book.current_page || 0) + pages, book.total_pages);

  const { data, error } = await supabase
    .from('books')
    .update({ current_page: newPagesRead })
    .eq('id', bookId)
    .select()
    .single();

  if (error) {
    console.error('Error adding pages to book:', error);
    return null;
  }

  return transformBookFromDB(data);
};

// Set pages for a book (absolute value, not additive)
export const setPagesForBookInDB = async (bookId, pages) => {
  const { data: book, error: fetchError } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (fetchError) {
    console.error('Error fetching book:', fetchError);
    return null;
  }

  const newPagesRead = Math.min(pages, book.total_pages);

  const { data, error } = await supabase
    .from('books')
    .update({ current_page: newPagesRead })
    .eq('id', bookId)
    .select()
    .single();

  if (error) {
    console.error('Error setting pages for book:', error);
    return null;
  }

  return transformBookFromDB(data);
};

// ============ WEED STREAK TRACKING ============
// Streak is calculated from a start date, stored in localStorage
// The streak only breaks if today's toggle is OFF

const WEED_STREAK_KEY = 'iron-will-weed-streak-start';
const DEFAULT_STREAK_START = '2025-12-09'; // Day 1 of the streak

// Get the streak start date
export const getWeedStreakStart = () => {
  if (typeof window === 'undefined') return DEFAULT_STREAK_START;
  const stored = localStorage.getItem(WEED_STREAK_KEY);
  return stored || DEFAULT_STREAK_START;
};

// Set the streak start date
export const setWeedStreakStart = (date) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WEED_STREAK_KEY, date);
};

// Calculate current streak from start date
export const calculateWeedStreak = (todayClean = true) => {
  const startDate = getWeedStreakStart();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  // If today is not clean, streak is 0
  if (!todayClean) {
    return 0;
  }

  // Calculate days since start date (inclusive of start day)
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(0, diffDays);
};

// Handle streak break - reset start date to tomorrow (streak restarts tomorrow)
export const breakWeedStreak = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  setWeedStreakStart(tomorrowStr);
};

// Handle streak restore - if user toggles back ON today, start streak from today
export const restoreWeedStreak = () => {
  const today = new Date().toISOString().split('T')[0];
  setWeedStreakStart(today);
};

// Get streak data (current streak and start date)
export const getWeedStreakData = (todayClean = true) => {
  const startDate = getWeedStreakStart();
  const current = calculateWeedStreak(todayClean);

  return {
    current,
    startDate,
    longest: current, // For now, longest is same as current (can add separate tracking later)
  };
};

// ============ READING LOGS ============

// Get all reading logs for a specific book
export const getReadingLogsForBook = async (bookId) => {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('book_id', bookId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching reading logs:', error);
    return [];
  }

  return data;
};

// Get reading log for a specific date
export const getReadingLogForDate = async (date) => {
  const { data, error } = await supabase
    .from('reading_logs')
    .select('*, books(title, author)')
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching reading log:', error);
    return null;
  }

  return data;
};

// Save reading log (upsert by date - one entry per day)
export const saveReadingLog = async (log) => {
  console.log('[saveReadingLog] Input:', log);

  const payload = {
    date: log.date,
    book_id: log.book_id,
    page_number: log.page_number, // Keep for backward compatibility
    start_page: log.start_page,
    end_page: log.end_page,
    notes: log.notes || '',
    did_read: log.did_read ?? true,
  };

  // Include id if we're updating an existing record
  if (log.id) {
    payload.id = log.id;
  }

  console.log('[saveReadingLog] Payload:', payload);

  const { data, error } = await supabase
    .from('reading_logs')
    .upsert(payload, { onConflict: 'date' })
    .select()
    .single();

  console.log('[saveReadingLog] Result:', { data, error });

  if (error) {
    console.error('Error saving reading log:', error);
    throw new Error(`Failed to save reading log: ${error.message}`);
  }

  return data;
};

// Calculate reading progress from logs (unique pages read)
export const calculateReadingProgress = (readingLogs, totalPages) => {
  if (!readingLogs || readingLogs.length === 0 || !totalPages) {
    return { uniquePagesRead: 0, progress: 0, pageHeatMap: {} };
  }

  // Build heat map of page read counts
  const pageHeatMap = {};

  readingLogs.forEach(log => {
    // Handle new format (start_page to end_page)
    if (log.start_page && log.end_page) {
      for (let page = log.start_page; page <= log.end_page; page++) {
        pageHeatMap[page] = (pageHeatMap[page] || 0) + 1;
      }
    }
    // Handle old format (single page_number - treat as reading up to that page)
    else if (log.page_number) {
      // For backward compatibility, assume pages 1 to page_number were read
      // This is a fallback; ideally old data should be migrated
      pageHeatMap[log.page_number] = (pageHeatMap[log.page_number] || 0) + 1;
    }
  });

  const uniquePagesRead = Object.keys(pageHeatMap).length;
  const progress = totalPages > 0 ? Math.round((uniquePagesRead / totalPages) * 100) : 0;

  return { uniquePagesRead, progress, pageHeatMap };
};

// Delete reading log for a date
export const deleteReadingLog = async (date) => {
  const { error } = await supabase
    .from('reading_logs')
    .delete()
    .eq('date', date);

  if (error) {
    console.error('Error deleting reading log:', error);
    return false;
  }

  return true;
};

// ============ READING STREAK ============
const READING_STREAK_KEY = 'iron-will-reading-streak-start';
const READING_BEST_STREAK_KEY = 'iron-will-reading-best-streak';
const DEFAULT_READING_STREAK_START = '2026-01-01'; // Day 1 of reading streak

export const getReadingStreakStart = () => {
  if (typeof window === 'undefined') return DEFAULT_READING_STREAK_START;
  const stored = localStorage.getItem(READING_STREAK_KEY);
  // Always use the default if not set or if before the reset date
  if (!stored || stored < DEFAULT_READING_STREAK_START) {
    localStorage.setItem(READING_STREAK_KEY, DEFAULT_READING_STREAK_START);
    return DEFAULT_READING_STREAK_START;
  }
  return stored;
};

export const setReadingStreakStart = (date) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(READING_STREAK_KEY, date);
};

export const getReadingBestStreak = () => {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(READING_BEST_STREAK_KEY) || '0', 10);
};

export const setReadingBestStreak = (streak) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(READING_BEST_STREAK_KEY, streak.toString());
};

export const calculateReadingStreak = (didReadToday = true) => {
  const startDate = getReadingStreakStart();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  if (!didReadToday) {
    return 0;
  }

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(0, diffDays);
};

export const breakReadingStreak = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  setReadingStreakStart(tomorrowStr);
};

export const restoreReadingStreak = () => {
  const today = new Date().toISOString().split('T')[0];
  // If today is before the reset date, use the reset date instead
  if (today < DEFAULT_READING_STREAK_START) {
    setReadingStreakStart(DEFAULT_READING_STREAK_START);
  } else {
    setReadingStreakStart(today);
  }
};

// Reset reading streak to the default start date (Jan 1, 2026)
export const resetReadingStreak = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(READING_STREAK_KEY, DEFAULT_READING_STREAK_START);
  localStorage.setItem(READING_BEST_STREAK_KEY, '0');
};

export const getReadingStreakData = (didReadToday = true) => {
  const current = calculateReadingStreak(didReadToday);
  const best = getReadingBestStreak();

  // Update best if current is higher
  if (current > best) {
    setReadingBestStreak(current);
    return { current, best: current };
  }

  return { current, best };
};

