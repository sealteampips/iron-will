// IndexedDB utilities for book tracking
const DB_NAME = 'progress-tracker-books';
const DB_VERSION = 1;
const BOOKS_STORE = 'books';
const READING_LOGS_STORE = 'reading-logs';
const COMPOUND_STORE = 'compound-data';

let dbPromise = null;

const openDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Books store
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        const booksStore = db.createObjectStore(BOOKS_STORE, { keyPath: 'id', autoIncrement: true });
        booksStore.createIndex('status', 'status', { unique: false });
        booksStore.createIndex('started_date', 'started_date', { unique: false });
      }

      // Reading logs store
      if (!db.objectStoreNames.contains(READING_LOGS_STORE)) {
        const logsStore = db.createObjectStore(READING_LOGS_STORE, { keyPath: 'id', autoIncrement: true });
        logsStore.createIndex('date', 'date', { unique: false });
        logsStore.createIndex('book_id', 'book_id', { unique: false });
      }

      // Compound progress store
      if (!db.objectStoreNames.contains(COMPOUND_STORE)) {
        const compoundStore = db.createObjectStore(COMPOUND_STORE, { keyPath: 'date' });
      }
    };
  });

  return dbPromise;
};

// ============ BOOKS ============

export const addBook = async (book) => {
  const db = await openDB();
  const tx = db.transaction(BOOKS_STORE, 'readwrite');
  const store = tx.objectStore(BOOKS_STORE);

  const newBook = {
    ...book,
    pages_read: 0,
    status: 'active',
    started_date: new Date().toISOString(),
    completed_date: null,
  };

  return new Promise((resolve, reject) => {
    const request = store.add(newBook);
    request.onsuccess = () => resolve({ ...newBook, id: request.result });
    request.onerror = () => reject(request.error);
  });
};

export const getBooks = async (status = null) => {
  const db = await openDB();
  const tx = db.transaction(BOOKS_STORE, 'readonly');
  const store = tx.objectStore(BOOKS_STORE);

  return new Promise((resolve, reject) => {
    const request = status
      ? store.index('status').getAll(status)
      : store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getActiveBooks = async () => {
  return getBooks('active');
};

export const getCompletedBooks = async (year = null) => {
  const books = await getBooks('completed');
  if (!year) return books;

  return books.filter((book) => {
    const completedYear = new Date(book.completed_date).getFullYear();
    return completedYear === year;
  });
};

export const updateBook = async (id, updates) => {
  const db = await openDB();
  const tx = db.transaction(BOOKS_STORE, 'readwrite');
  const store = tx.objectStore(BOOKS_STORE);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const book = getRequest.result;
      if (!book) {
        reject(new Error('Book not found'));
        return;
      }

      const updatedBook = { ...book, ...updates };
      const putRequest = store.put(updatedBook);
      putRequest.onsuccess = () => resolve(updatedBook);
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const markBookComplete = async (id) => {
  return updateBook(id, {
    status: 'completed',
    completed_date: new Date().toISOString(),
  });
};

export const abandonBook = async (id) => {
  return updateBook(id, {
    status: 'abandoned',
    completed_date: new Date().toISOString(),
  });
};

export const addPagesToBook = async (bookId, pages) => {
  const db = await openDB();
  const tx = db.transaction(BOOKS_STORE, 'readwrite');
  const store = tx.objectStore(BOOKS_STORE);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(bookId);
    getRequest.onsuccess = () => {
      const book = getRequest.result;
      if (!book) {
        reject(new Error('Book not found'));
        return;
      }

      const newPagesRead = Math.min(book.pages_read + pages, book.total_pages);
      const updatedBook = { ...book, pages_read: newPagesRead };

      const putRequest = store.put(updatedBook);
      putRequest.onsuccess = () => resolve(updatedBook);
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

// ============ READING LOGS ============

// Upsert reading log for a specific date and book (replaces if exists)
export const setReadingForDate = async (date, bookId, pages) => {
  const db = await openDB();
  const tx = db.transaction(READING_LOGS_STORE, 'readwrite');
  const store = tx.objectStore(READING_LOGS_STORE);

  return new Promise((resolve, reject) => {
    // First, find and delete any existing entry for this date+book
    const index = store.index('date');
    const request = index.getAll(date);

    request.onsuccess = () => {
      const existingLogs = request.result.filter(log => log.book_id === bookId);

      // Delete existing entries for this date+book
      existingLogs.forEach(log => {
        store.delete(log.id);
      });

      // Add new entry (only if pages > 0)
      if (pages > 0) {
        const log = {
          date,
          book_id: bookId,
          pages,
          created_at: new Date().toISOString(),
        };

        const addRequest = store.add(log);
        addRequest.onsuccess = () => resolve({ ...log, id: addRequest.result });
        addRequest.onerror = () => reject(addRequest.error);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

// Get reading entry for a specific date and book
export const getReadingForDate = async (date, bookId) => {
  const db = await openDB();
  const tx = db.transaction(READING_LOGS_STORE, 'readonly');
  const store = tx.objectStore(READING_LOGS_STORE);

  return new Promise((resolve, reject) => {
    const index = store.index('date');
    const request = index.getAll(date);

    request.onsuccess = () => {
      const log = request.result.find(l => l.book_id === bookId);
      resolve(log || null);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getReadingLogs = async (date = null) => {
  const db = await openDB();
  const tx = db.transaction(READING_LOGS_STORE, 'readonly');
  const store = tx.objectStore(READING_LOGS_STORE);

  return new Promise((resolve, reject) => {
    const request = date
      ? store.index('date').getAll(date)
      : store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Get all reading logs for a specific book
export const getReadingLogsForBook = async (bookId) => {
  const db = await openDB();
  const tx = db.transaction(READING_LOGS_STORE, 'readonly');
  const store = tx.objectStore(READING_LOGS_STORE);

  return new Promise((resolve, reject) => {
    const index = store.index('book_id');
    const request = index.getAll(bookId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Calculate total pages read from all committed logs (excluding today)
export const getCommittedPagesForBook = async (bookId, excludeDate = null) => {
  const logs = await getReadingLogsForBook(bookId);
  return logs
    .filter(log => !excludeDate || log.date !== excludeDate)
    .reduce((sum, log) => sum + log.pages, 0);
};

// Recalculate and update book's pages_read from all logs
export const recalculateBookProgress = async (bookId) => {
  const logs = await getReadingLogsForBook(bookId);
  const totalPages = logs.reduce((sum, log) => sum + log.pages, 0);

  const db = await openDB();
  const tx = db.transaction(BOOKS_STORE, 'readwrite');
  const store = tx.objectStore(BOOKS_STORE);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(bookId);
    getRequest.onsuccess = () => {
      const book = getRequest.result;
      if (!book) {
        reject(new Error('Book not found'));
        return;
      }

      const newPagesRead = Math.min(totalPages, book.total_pages);
      const updatedBook = { ...book, pages_read: newPagesRead };

      const putRequest = store.put(updatedBook);
      putRequest.onsuccess = () => resolve(updatedBook);
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

// Clear all reading logs for a book and reset its progress
export const resetBookProgress = async (bookId) => {
  const db = await openDB();

  // Delete all reading logs for this book
  const logsTx = db.transaction(READING_LOGS_STORE, 'readwrite');
  const logsStore = logsTx.objectStore(READING_LOGS_STORE);
  const logsIndex = logsStore.index('book_id');

  await new Promise((resolve, reject) => {
    const request = logsIndex.getAll(bookId);
    request.onsuccess = () => {
      request.result.forEach(log => logsStore.delete(log.id));
      resolve();
    };
    request.onerror = () => reject(request.error);
  });

  // Reset book's pages_read to 0
  return updateBook(bookId, { pages_read: 0 });
};

// Legacy function - kept for compatibility but now uses setReadingForDate
export const logReading = async (date, bookId, pages) => {
  return setReadingForDate(date, bookId, pages);
};

// Find a book by title (case-insensitive partial match)
export const findBookByTitle = async (titleSearch) => {
  const books = await getBooks();
  const searchLower = titleSearch.toLowerCase();
  return books.find(book => book.title.toLowerCase().includes(searchLower));
};

// Reset a book's progress by title (for console use)
export const resetBookByTitle = async (titleSearch) => {
  const book = await findBookByTitle(titleSearch);
  if (!book) {
    console.error(`No book found matching "${titleSearch}"`);
    return null;
  }
  console.log(`Resetting "${book.title}" (ID: ${book.id}) to 0 pages...`);
  const result = await resetBookProgress(book.id);
  console.log(`Done! "${book.title}" reset to 0 pages.`);
  return result;
};

// Expose reset function globally for console access
if (typeof window !== 'undefined') {
  window.resetBookByTitle = resetBookByTitle;
  window.findBookByTitle = findBookByTitle;
}

// ============ COMPOUND PROGRESS ============

export const saveCompoundData = async (date, dailyXP, multiplier, compoundScore) => {
  const db = await openDB();
  const tx = db.transaction(COMPOUND_STORE, 'readwrite');
  const store = tx.objectStore(COMPOUND_STORE);

  const data = {
    date,
    daily_xp: dailyXP,
    multiplier,
    compound_score: compoundScore,
    updated_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve(data);
    request.onerror = () => reject(request.error);
  });
};

export const getCompoundData = async (startDate = null, endDate = null) => {
  const db = await openDB();
  const tx = db.transaction(COMPOUND_STORE, 'readonly');
  const store = tx.objectStore(COMPOUND_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      let results = request.result;

      if (startDate) {
        results = results.filter((r) => r.date >= startDate);
      }
      if (endDate) {
        results = results.filter((r) => r.date <= endDate);
      }

      // Sort by date
      results.sort((a, b) => a.date.localeCompare(b.date));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getLatestCompoundScore = async () => {
  const data = await getCompoundData();
  if (data.length === 0) return { compound_score: 1.0, date: null };
  return data[data.length - 1];
};

// Calculate daily multiplier based on XP
// Formula: 0.99 + (0.02 × daily_XP / 120)
// 120 XP (perfect) = 1.01x, 60 XP = 1.00x, 0 XP = 0.99x
export const calculateDailyMultiplier = (dailyXP) => {
  const maxXP = 120;
  return 0.99 + (0.02 * dailyXP / maxXP);
};

// Calculate and save compound progress for a date
export const updateCompoundProgress = async (date, dailyXP) => {
  const allData = await getCompoundData();
  const multiplier = calculateDailyMultiplier(dailyXP);

  let previousScore = 1.0;

  // Find previous day's score
  const dateObj = new Date(date);
  const prevDate = new Date(dateObj);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().split('T')[0];

  const prevData = allData.find((d) => d.date === prevDateStr);
  if (prevData) {
    previousScore = prevData.compound_score;
  } else if (allData.length > 0) {
    // If no previous day data, use the latest
    previousScore = allData[allData.length - 1].compound_score;
  }

  const compoundScore = previousScore * multiplier;

  return saveCompoundData(date, dailyXP, multiplier, compoundScore);
};

// Generate reference line data (1.01^n, 1.00^n, 0.99^n)
export const generateReferenceLines = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const lines = {
    better: [], // 1.01^n
    neutral: [], // 1.00^n
    worse: [], // 0.99^n
  };

  let day = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    lines.better.push({ date: dateStr, value: Math.pow(1.01, day) });
    lines.neutral.push({ date: dateStr, value: Math.pow(1.0, day) });
    lines.worse.push({ date: dateStr, value: Math.pow(0.99, day) });
    day++;
  }

  return lines;
};

// ============ COMPOUND PROGRESS - YEARLY MANAGEMENT ============

const COMPOUND_ARCHIVE_STORE = 'compound-archive';

// Archive compound data for a specific year
export const archiveCompoundYear = async (year) => {
  const allData = await getCompoundData();
  const yearData = allData.filter((d) => d.date.startsWith(`${year}-`));

  if (yearData.length === 0) return null;

  // Store archive in localStorage (simpler than adding another IndexedDB store)
  const archiveKey = `compound-archive-${year}`;
  const archive = {
    year,
    data: yearData,
    final_score: yearData[yearData.length - 1].compound_score,
    days_tracked: yearData.length,
    archived_at: new Date().toISOString(),
  };

  localStorage.setItem(archiveKey, JSON.stringify(archive));
  return archive;
};

// Get archived compound data for a specific year
export const getCompoundArchive = (year) => {
  const archiveKey = `compound-archive-${year}`;
  const data = localStorage.getItem(archiveKey);
  return data ? JSON.parse(data) : null;
};

// Get all archived years
export const getArchivedYears = () => {
  const years = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('compound-archive-')) {
      const year = key.replace('compound-archive-', '');
      years.push(parseInt(year));
    }
  }
  return years.sort((a, b) => b - a); // Newest first
};

// Clear compound data for a specific year (after archiving)
export const clearCompoundDataForYear = async (year) => {
  const db = await openDB();
  const tx = db.transaction(COMPOUND_STORE, 'readwrite');
  const store = tx.objectStore(COMPOUND_STORE);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const allData = request.result;
      const toDelete = allData.filter((d) => d.date.startsWith(`${year}-`));

      toDelete.forEach((item) => {
        store.delete(item.date);
      });

      resolve(toDelete.length);
    };
    request.onerror = () => reject(request.error);
  });
};

// Reset all compound data (clear everything, start fresh)
export const resetCompoundProgress = async () => {
  const db = await openDB();
  const tx = db.transaction(COMPOUND_STORE, 'readwrite');
  const store = tx.objectStore(COMPOUND_STORE);

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

// Get compound data for a specific year only
export const getCompoundDataForYear = async (year) => {
  const allData = await getCompoundData();
  return allData.filter((d) => d.date.startsWith(`${year}-`));
};

// Check if we need to auto-archive and reset for new year
export const checkAndHandleYearReset = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const previousYear = currentYear - 1;

  // Check if there's data from previous year that hasn't been archived
  const prevYearData = await getCompoundDataForYear(previousYear);
  const existingArchive = getCompoundArchive(previousYear);

  if (prevYearData.length > 0 && !existingArchive) {
    // Archive the previous year
    await archiveCompoundYear(previousYear);
    // Clear the previous year's data from active store
    await clearCompoundDataForYear(previousYear);
    return { archived: true, year: previousYear };
  }

  return { archived: false };
};

// Force reset compound progress - clears ALL data and reloads page
export const forceResetCompoundProgress = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(COMPOUND_STORE, 'readwrite');
    const store = tx.objectStore(COMPOUND_STORE);

    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });

    console.log('Compound progress data cleared successfully!');
    console.log('Reloading page...');
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Error resetting compound progress:', error);
    return false;
  }
};

// Expose reset function globally for console access
if (typeof window !== 'undefined') {
  window.resetCompoundProgress = resetCompoundProgress;
  window.forceResetCompoundProgress = forceResetCompoundProgress;
  window.archiveCompoundYear = archiveCompoundYear;
  window.getCompoundArchive = getCompoundArchive;
}
