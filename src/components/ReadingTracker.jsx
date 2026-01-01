import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import {
  BookOpen,
  Flame,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getWeedStreakData,
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
} from '../lib/dataService';

// Sobriety Display (passive, no toggle)
function SobrietyBadge({ streak }) {
  return (
    <div className="bg-gradient-to-r from-green-900/40 to-green-800/20 rounded-xl px-4 py-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌿</span>
        <span className="text-green-400 font-bold">{streak.current}</span>
        <span className="text-gray-300 text-sm">days weed-free</span>
      </div>
    </div>
  );
}

// Today's Reading Form
function TodaysReading({
  activeBooks,
  onSave,
  todayLog,
  readingStreak,
  onDidReadChange
}) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [didRead, setDidRead] = useState(todayLog?.did_read ?? true);
  const [selectedBookId, setSelectedBookId] = useState(todayLog?.book_id || '');
  const [pageNumber, setPageNumber] = useState(todayLog?.page_number?.toString() || '');
  const [notes, setNotes] = useState(todayLog?.notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (todayLog) {
      setDidRead(todayLog.did_read ?? true);
      setSelectedBookId(todayLog.book_id || '');
      setPageNumber(todayLog.page_number?.toString() || '');
      setNotes(todayLog.notes || '');
    }
  }, [todayLog]);

  // Auto-select first book if none selected
  useEffect(() => {
    if (!selectedBookId && activeBooks.length > 0) {
      setSelectedBookId(activeBooks[0].id);
    }
  }, [activeBooks, selectedBookId]);

  const handleDidReadToggle = () => {
    const newValue = !didRead;
    setDidRead(newValue);
    onDidReadChange(newValue);
  };

  const handleSave = async () => {
    if (!didRead) {
      // Just save that they didn't read
      setSaving(true);
      await onSave({
        date: today,
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
      date: today,
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Today's Reading
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-bold">{readingStreak.current}</span>
          <span className="text-gray-500">days</span>
          <span className="text-gray-600 ml-1">Best: {readingStreak.best}</span>
        </div>
      </div>

      {/* Did you read toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-700/50 rounded-lg">
        <span className="text-sm">Did you read today?</span>
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
export default function ReadingTracker({ entries, updateEntry }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = entries.find(e => e.date === today);

  // State
  const [activeBooks, setActiveBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [todayLog, setTodayLog] = useState(null);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const [bookReadingLogs, setBookReadingLogs] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [completingBook, setCompletingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sobriety streak (always counting from start date, no toggle needed)
  const weedStreak = useMemo(() => getWeedStreakData(true), []);

  // Reading streak state
  const [didReadToday, setDidReadToday] = useState(true);
  const readingStreak = useMemo(() => getReadingStreakData(didReadToday), [didReadToday]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [active, completed, log] = await Promise.all([
          getActiveBooksFromDB(),
          getCompletedBooksFromDB(new Date().getFullYear()),
          getReadingLogForDate(today),
        ]);
        setActiveBooks(active);
        setCompletedBooks(completed);
        setTodayLog(log);
        if (log) {
          setDidReadToday(log.did_read ?? true);
        }
      } catch (error) {
        console.error('Error loading reading data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, [today]);

  // Load reading logs for expanded book
  useEffect(() => {
    if (expandedBookId && !bookReadingLogs[expandedBookId]) {
      getReadingLogsForBook(expandedBookId).then((logs) => {
        setBookReadingLogs((prev) => ({ ...prev, [expandedBookId]: logs }));
      });
    }
  }, [expandedBookId, bookReadingLogs]);

  // Handle reading toggle
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
      setTodayLog(log);

      // Update book progress if they read
      if (log.did_read && log.book_id && log.page_number) {
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
      {/* Sobriety Badge */}
      <SobrietyBadge streak={weedStreak} />

      {/* Today's Reading */}
      <TodaysReading
        activeBooks={activeBooks}
        onSave={handleSaveReading}
        todayLog={todayLog}
        readingStreak={readingStreak}
        onDidReadChange={handleDidReadChange}
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
