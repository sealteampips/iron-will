import { useState, useEffect, useMemo } from 'react';
import { format, addDays, subDays, isToday, parseISO } from 'date-fns';
import {
  BookOpen,
  Flame,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Trophy,
  Quote,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getActiveBooksFromDB,
  getCompletedBooksFromDB,
  addBookToDB,
  updateBookInDB,
  markBookCompleteInDB,
  saveReadingLog,
  getReadingLogForDate,
  getReadingLogsForBook,
  getReadingStreakData,
  breakReadingStreak,
  restoreReadingStreak,
  setReadingStreakStart,
} from '../lib/dataService';

// Reading-focused quotes
const READING_QUOTES = [
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "A book is a dream that you hold in your hand.", author: "Neil Gaiman" },
  { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
  { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "The reading of all good books is like a conversation with the finest minds of past centuries.", author: "René Descartes" },
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
  { text: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" },
  { text: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn" },
  { text: "A book is a gift you can open again and again.", author: "Garrison Keillor" },
  { text: "You can never get a cup of tea large enough or a book long enough to suit me.", author: "C.S. Lewis" },
  { text: "Reading is a discount ticket to everywhere.", author: "Mary Schmich" },
  { text: "Books are the plane, and the train, and the road. They are the destination, and the journey.", author: "Anna Quindlen" },
  { text: "The person who deserves most pity is a lonesome one on a rainy day who doesn't know how to read.", author: "Benjamin Franklin" },
  { text: "Think before you speak. Read before you think.", author: "Fran Lebowitz" },
  { text: "Reading brings us unknown friends.", author: "Honoré de Balzac" },
  { text: "In the case of good books, the point is not to see how many of them you can get through, but rather how many can get through to you.", author: "Mortimer J. Adler" },
  { text: "A great book should leave you with many experiences, and slightly exhausted at the end.", author: "William Styron" },
  { text: "Reading is a basic tool in the living of a good life.", author: "Mortimer J. Adler" },
  { text: "No matter how busy you may think you are, you must find time for reading.", author: "Confucius" },
  { text: "Books are mirrors: you only see in them what you already have inside you.", author: "Carlos Ruiz Zafón" },
  { text: "Reading without reflecting is like eating without digesting.", author: "Edmund Burke" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "One glance at a book and you hear the voice of another person, perhaps someone dead for 1,000 years.", author: "Carl Sagan" },
  { text: "Sleep is good, and books are better.", author: "George R.R. Martin" },
  { text: "Reading is an act of civilization; it's one of the greatest acts of civilization.", author: "Junot Díaz" },
  { text: "The only thing you absolutely have to know is the location of the library.", author: "Albert Einstein" },
];

// Get today's reading quote (deterministic based on date)
function getTodaysReadingQuote() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % READING_QUOTES.length;
  return READING_QUOTES[quoteIndex];
}

// Reading Quote Component
function ReadingQuote() {
  const quote = getTodaysReadingQuote();

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
      <div className="flex items-start gap-3">
        <Quote className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
        <div>
          <p className="text-gray-200 italic text-sm leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-gray-500 text-xs mt-2">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
}

// Stats Row Component
function StatsRow({ completedBooks, readingStreak }) {
  return (
    <div className="flex items-center justify-center gap-4 text-sm mb-4 py-2">
      <div className="flex items-center gap-1.5">
        <span>📚</span>
        <span className="text-gray-300">
          <span className="text-white font-medium">{completedBooks}</span> books in {new Date().getFullYear()}
        </span>
      </div>
      <span className="text-gray-600">·</span>
      <div className="flex items-center gap-1.5">
        <span>🔥</span>
        <span className="text-gray-300">
          <span className="text-orange-400 font-medium">{readingStreak}</span> day streak
        </span>
      </div>
    </div>
  );
}

// Date Navigation Component
function DateNavigation({ selectedDate, onDateChange }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCurrentDay = selectedDate === today;
  const displayDate = parseISO(selectedDate);

  const handlePrev = () => {
    const prevDate = subDays(displayDate, 1);
    onDateChange(format(prevDate, 'yyyy-MM-dd'));
  };

  const handleNext = () => {
    if (!isCurrentDay) {
      const nextDate = addDays(displayDate, 1);
      onDateChange(format(nextDate, 'yyyy-MM-dd'));
    }
  };

  const handleToday = () => {
    onDateChange(today);
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button
        onClick={handlePrev}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-400" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-white font-medium">
          {format(displayDate, 'MMMM d, yyyy')}
        </span>
        {!isCurrentDay && (
          <button
            onClick={handleToday}
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={isCurrentDay}
        className={`p-2 rounded-lg transition-colors ${
          isCurrentDay
            ? 'text-gray-600 cursor-not-allowed'
            : 'hover:bg-gray-700 text-gray-400'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Reading Form Component
function ReadingForm({
  selectedDate,
  activeBooks,
  onSave,
  currentLog,
  onDidReadChange,
  isToday: isTodayDate,
}) {
  const [didRead, setDidRead] = useState(currentLog?.did_read ?? true);
  const [selectedBookId, setSelectedBookId] = useState(currentLog?.book_id || '');
  const [pageNumber, setPageNumber] = useState(currentLog?.page_number?.toString() || '');
  const [notes, setNotes] = useState(currentLog?.notes || '');
  const [saving, setSaving] = useState(false);

  // Update form when log changes
  useEffect(() => {
    setDidRead(currentLog?.did_read ?? true);
    setSelectedBookId(currentLog?.book_id || '');
    setPageNumber(currentLog?.page_number?.toString() || '');
    setNotes(currentLog?.notes || '');
  }, [currentLog, selectedDate]);

  // Auto-select first book if none selected
  useEffect(() => {
    if (!selectedBookId && activeBooks.length > 0) {
      setSelectedBookId(activeBooks[0].id);
    }
  }, [activeBooks, selectedBookId]);

  const handleDidReadToggle = () => {
    const newValue = !didRead;
    setDidRead(newValue);
    if (isTodayDate) {
      onDidReadChange(newValue);
    }
  };

  const handleSave = async () => {
    if (!didRead) {
      setSaving(true);
      await onSave({
        date: selectedDate,
        book_id: null,
        page_number: null,
        notes: '',
        did_read: false,
      });
      setSaving(false);
      return;
    }

    if (!selectedBookId || !pageNumber) return;

    setSaving(true);
    await onSave({
      date: selectedDate,
      book_id: selectedBookId,
      page_number: parseInt(pageNumber, 10),
      notes,
      did_read: true,
    });
    setSaving(false);
  };

  const selectedBook = activeBooks.find(b => b.id === selectedBookId);

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-400" />
        {isTodayDate ? "Today's Reading" : `Reading for ${format(parseISO(selectedDate), 'MMM d')}`}
      </h3>

      {/* Did you read toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-700/50 rounded-lg">
        <span className="text-sm">Did you read{isTodayDate ? ' today' : ''}?</span>
        <button
          onClick={handleDidReadToggle}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            didRead ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              didRead ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {didRead && (
        <>
          {/* Book selection */}
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Which book?</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select a book...</option>
              {activeBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          {/* Page number */}
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">
              Page stopped on:
              {selectedBook && (
                <span className="text-gray-500 ml-2">
                  (of {selectedBook.total_pages})
                </span>
              )}
            </label>
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              min="1"
              max={selectedBook?.total_pages || 9999}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter page number"
            />
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
              placeholder="Quotes, insights, page references..."
            />
          </div>
        </>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || (didRead && (!selectedBookId || !pageNumber))}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          saving || (didRead && (!selectedBookId || !pageNumber))
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

// Book Card Component
function BookCard({ book, onClick, isExpanded, readingLogs }) {
  const progress = book.total_pages > 0
    ? Math.round((book.pages_read / book.total_pages) * 100)
    : 0;

  return (
    <div className="bg-gray-700/50 rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className="w-full p-3 text-left hover:bg-gray-700/70 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{book.title}</h4>
            <p className="text-sm text-gray-400 truncate">{book.author}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {book.pages_read} of {book.total_pages} pages ({progress}%)
          </p>
        </div>
      </button>

      {/* Expanded reading history */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-600">
          <h5 className="text-xs text-gray-400 uppercase tracking-wide mt-2 mb-2">
            Reading History
          </h5>
          {readingLogs.length === 0 ? (
            <p className="text-sm text-gray-500">No reading logged yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {readingLogs.map((log) => (
                <div key={log.id} className="text-sm bg-gray-800/50 rounded p-2">
                  <div className="flex justify-between text-gray-400">
                    <span>{format(new Date(log.date), 'MMM d, yyyy')}</span>
                    <span>Page {log.page_number}</span>
                  </div>
                  {log.notes && (
                    <p className="text-gray-300 mt-1 text-xs">{log.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Completed Book Card
function CompletedBookCard({ book }) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">{book.title}</h4>
          <p className="text-sm text-gray-400 truncate">{book.author}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>{book.total_pages} pages</span>
        {book.completed_date && (
          <span>Completed {format(new Date(book.completed_date), 'MMM d, yyyy')}</span>
        )}
      </div>
    </div>
  );
}

// Add Book Modal
function AddBookModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !totalPages) return;

    setSaving(true);
    await onAdd({
      title,
      author,
      total_pages: parseInt(totalPages, 10),
    });
    setSaving(false);
    setTitle('');
    setAuthor('');
    setTotalPages('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Book</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-1">Author *</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Total Pages *</label>
            <input
              type="number"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              min="1"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || !title || !author || !totalPages}
            className={`w-full py-2 rounded-lg font-medium ${
              saving || !title || !author || !totalPages
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saving ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Book Completion Modal
function CompletionModal({ book, onConfirm, onCancel }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
        <p className="text-gray-300 mb-4">
          You finished <span className="text-white font-medium">{book.title}</span>!
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Mark this book as complete?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Not yet
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
          >
            Complete!
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Reading Tracker Component
export default function ReadingTracker() {
  const today = format(new Date(), 'yyyy-MM-dd');

  // State
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeBooks, setActiveBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [currentLog, setCurrentLog] = useState(null);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const [bookReadingLogs, setBookReadingLogs] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [completingBook, setCompletingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reading streak (reset to Jan 1, 2026)
  const [didReadToday, setDidReadToday] = useState(true);
  const readingStreak = useMemo(() => {
    // Ensure streak starts from Jan 1, 2026
    const storedStart = localStorage.getItem('iron-will-reading-streak-start');
    if (!storedStart || storedStart < '2026-01-01') {
      setReadingStreakStart('2026-01-01');
    }
    return getReadingStreakData(didReadToday);
  }, [didReadToday]);

  const isTodaySelected = selectedDate === today;

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [active, completed] = await Promise.all([
          getActiveBooksFromDB(),
          getCompletedBooksFromDB(new Date().getFullYear()),
        ]);
        setActiveBooks(active);
        setCompletedBooks(completed);
      } catch (error) {
        console.error('Error loading reading data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Load reading log for selected date
  useEffect(() => {
    const loadLog = async () => {
      try {
        const log = await getReadingLogForDate(selectedDate);
        setCurrentLog(log);
        if (selectedDate === today && log) {
          setDidReadToday(log.did_read ?? true);
        }
      } catch (error) {
        console.error('Error loading reading log:', error);
        setCurrentLog(null);
      }
    };
    loadLog();
  }, [selectedDate, today]);

  // Load reading logs for expanded book
  useEffect(() => {
    if (expandedBookId && !bookReadingLogs[expandedBookId]) {
      getReadingLogsForBook(expandedBookId).then((logs) => {
        setBookReadingLogs((prev) => ({ ...prev, [expandedBookId]: logs }));
      });
    }
  }, [expandedBookId, bookReadingLogs]);

  // Handle reading toggle (only affects today)
  const handleDidReadChange = (value) => {
    setDidReadToday(value);
    if (value === false) {
      breakReadingStreak();
    } else {
      restoreReadingStreak();
    }
  };

  // Handle save reading log
  const handleSaveReading = async (log) => {
    try {
      await saveReadingLog(log);
      setCurrentLog(log);

      // Update book progress if they read (only for today's entries to prevent confusion)
      if (log.did_read && log.book_id && log.page_number && log.date === today) {
        const book = activeBooks.find((b) => b.id === log.book_id);
        if (book) {
          const updated = await updateBookInDB(log.book_id, {
            pages_read: log.page_number,
          });

          // Check if book is complete
          if (updated && log.page_number >= book.total_pages) {
            setCompletingBook(book);
          } else {
            // Refresh active books
            setActiveBooks((prev) =>
              prev.map((b) =>
                b.id === log.book_id ? { ...b, pages_read: log.page_number } : b
              )
            );
          }
        }
      }

      // Refresh book reading logs if expanded
      if (log.book_id && bookReadingLogs[log.book_id]) {
        const logs = await getReadingLogsForBook(log.book_id);
        setBookReadingLogs((prev) => ({ ...prev, [log.book_id]: logs }));
      }
    } catch (error) {
      console.error('Error saving reading:', error);
    }
  };

  // Handle book completion
  const handleCompleteBook = async () => {
    if (!completingBook) return;

    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    await markBookCompleteInDB(completingBook.id);

    // Refresh books
    const [active, completed] = await Promise.all([
      getActiveBooksFromDB(),
      getCompletedBooksFromDB(new Date().getFullYear()),
    ]);
    setActiveBooks(active);
    setCompletedBooks(completed);
    setCompletingBook(null);
  };

  // Handle add book
  const handleAddBook = async (book) => {
    const newBook = await addBookToDB(book);
    if (newBook) {
      setActiveBooks((prev) => [newBook, ...prev]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Reading Quote */}
      <ReadingQuote />

      {/* Stats Row */}
      <StatsRow
        completedBooks={completedBooks.length}
        readingStreak={readingStreak.current}
      />

      {/* Date Navigation */}
      <DateNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Reading Form */}
      <ReadingForm
        selectedDate={selectedDate}
        activeBooks={activeBooks}
        onSave={handleSaveReading}
        currentLog={currentLog}
        onDidReadChange={handleDidReadChange}
        isToday={isTodaySelected}
      />

      {/* Currently Reading */}
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Currently Reading
        </h3>
        {activeBooks.length === 0 ? (
          <p className="text-gray-400 text-sm">No active books. Add one below!</p>
        ) : (
          <div className="space-y-2">
            {activeBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() =>
                  setExpandedBookId(expandedBookId === book.id ? null : book.id)
                }
                isExpanded={expandedBookId === book.id}
                readingLogs={bookReadingLogs[book.id] || []}
              />
            ))}
          </div>
        )}
      </div>

      {/* Library */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Library
            <span className="text-sm font-normal text-gray-400 ml-2">
              {completedBooks.length} books in {new Date().getFullYear()}
            </span>
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>

        {completedBooks.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No books completed this year yet. Keep reading!
          </p>
        ) : (
          <div className="space-y-2">
            {completedBooks.map((book) => (
              <CompletedBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddBook}
      />
      <CompletionModal
        book={completingBook}
        onConfirm={handleCompleteBook}
        onCancel={() => setCompletingBook(null)}
      />
    </div>
  );
}
