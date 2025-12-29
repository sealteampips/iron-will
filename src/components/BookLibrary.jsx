import { useState, useEffect } from 'react';
import { BookOpen, Plus, Check, X, Library, Trophy, Edit3 } from 'lucide-react';
// Old IndexedDB imports - kept for reference/rollback
// import {
//   addBook,
//   getActiveBooks,
//   getCompletedBooks,
//   markBookComplete,
//   abandonBook,
//   updateBook,
// } from '../utils/bookStorage';
import {
  addBookToDB,
  getActiveBooksFromDB,
  getCompletedBooksFromDB,
  markBookCompleteInDB,
  abandonBookInDB,
  updateBookInDB,
} from '../lib/dataService';

function AddBookForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !totalPages) return;

    await onAdd({
      title,
      author,
      total_pages: parseInt(totalPages),
    });

    setTitle('');
    setAuthor('');
    setTotalPages('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700/50 rounded-lg p-4 space-y-3">
      <div>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Total Pages"
          value={totalPages}
          onChange={(e) => setTotalPages(e.target.value)}
          min="1"
          className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Add Book
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Modal for editing book progress
function BookEditModal({ book, onSave, onComplete, onAbandon, onClose }) {
  const [currentPage, setCurrentPage] = useState(book.pages_read);
  const [saving, setSaving] = useState(false);

  const progress = Math.round((currentPage / book.total_pages) * 100);
  const isComplete = currentPage >= book.total_pages;

  const handlePageChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    // Clamp between 0 and total_pages
    value = Math.max(0, Math.min(value, book.total_pages));
    setCurrentPage(value);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(book.id, currentPage);
      onClose();
    } catch (error) {
      console.error('Error saving book progress:', error);
    }
    setSaving(false);
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await onComplete(book.id);
      onClose();
    } catch (error) {
      console.error('Error completing book:', error);
    }
    setSaving(false);
  };

  const handleAbandon = async () => {
    if (!confirm('Are you sure you want to abandon this book?')) return;
    setSaving(true);
    try {
      await onAbandon(book.id);
      onClose();
    } catch (error) {
      console.error('Error abandoning book:', error);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{book.title}</h3>
            <p className="text-sm text-gray-400">{book.author}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Current Page Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Current Page</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max={book.total_pages}
              value={currentPage}
              onChange={handlePageChange}
              className="flex-1 bg-gray-700 text-white text-xl px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-center font-bold"
            />
            <span className="text-gray-400 text-lg">/ {book.total_pages}</span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-white">{progress}%</span>
            <p className="text-sm text-gray-400">
              Page {currentPage} of {book.total_pages}
            </p>
          </div>
          {/* Progress bar */}
          <div className="h-3 bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || currentPage === book.pages_read}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                saving || currentPage === book.pages_read
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-700">
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={handleAbandon}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 rounded-lg text-sm transition-colors border border-red-600/30"
            >
              <X className="w-4 h-4" />
              Abandon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookCard({ book, onClick }) {
  const progress = Math.round((book.pages_read / book.total_pages) * 100);
  const isComplete = progress >= 100;

  return (
    <div
      className="bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-white">{book.title}</h4>
          <p className="text-sm text-gray-400">{book.author}</p>
        </div>
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
            Reading
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {book.pages_read} / {book.total_pages} pages
        </span>
        <span className={`font-medium ${isComplete ? 'text-green-400' : 'text-blue-400'}`}>
          {progress}%
        </span>
      </div>

      {/* Hover hint */}
      <p className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Click to edit progress
      </p>
    </div>
  );
}

export default function BookLibrary({ onBooksChange, refreshKey = 0 }) {
  const [activeBooks, setActiveBooks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = async () => {
    try {
      const active = await getActiveBooksFromDB();
      const completed = await getCompletedBooksFromDB(new Date().getFullYear());
      setActiveBooks(active);
      setCompletedCount(completed.length);
      onBooksChange?.(active);
      // Old IndexedDB code - kept for reference/rollback
      // const active = await getActiveBooks();
      // const completed = await getCompletedBooks(new Date().getFullYear());
    } catch (error) {
      console.error('Error loading books:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBooks();
  }, [refreshKey]);

  const handleAddBook = async (bookData) => {
    if (activeBooks.length >= 2) {
      alert('You can only have 2 active books at a time. Complete or abandon a book first.');
      return;
    }

    try {
      await addBookToDB(bookData);
      await loadBooks();
      setShowAddForm(false);
      // Old IndexedDB code - kept for reference/rollback
      // await addBook(bookData);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleSaveProgress = async (bookId, newPagesRead) => {
    try {
      await updateBookInDB(bookId, { pages_read: newPagesRead });
      await loadBooks();
      // Old IndexedDB code - kept for reference/rollback
      // await updateBook(bookId, { pages_read: newPagesRead });
    } catch (error) {
      console.error('Error saving book progress:', error);
      throw error;
    }
  };

  const handleComplete = async (bookId) => {
    try {
      await markBookCompleteInDB(bookId);
      await loadBooks();
      // Old IndexedDB code - kept for reference/rollback
      // await markBookComplete(bookId);
    } catch (error) {
      console.error('Error completing book:', error);
      throw error;
    }
  };

  const handleAbandon = async (bookId) => {
    try {
      await abandonBookInDB(bookId);
      await loadBooks();
      // Old IndexedDB code - kept for reference/rollback
      // await abandonBook(bookId);
    } catch (error) {
      console.error('Error abandoning book:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Library className="w-5 h-5 text-blue-400" />
          Library
        </h3>

        {/* Completed counter */}
        <div className="flex items-center gap-2 bg-amber-900/30 px-3 py-1.5 rounded-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm">
            <span className="font-bold text-amber-400">{completedCount}</span>
            <span className="text-gray-400"> books in {new Date().getFullYear()}</span>
          </span>
        </div>
      </div>

      {/* Active Books */}
      {activeBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {activeBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setEditingBook(book)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 mb-4">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No active books. Add one to start tracking!</p>
        </div>
      )}

      {/* Add Book */}
      {showAddForm ? (
        <AddBookForm onAdd={handleAddBook} onCancel={() => setShowAddForm(false)} />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          disabled={activeBooks.length >= 2}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
            activeBooks.length >= 2
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          {activeBooks.length >= 2 ? 'Max 2 Active Books' : 'Add Book'}
        </button>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <BookEditModal
          book={editingBook}
          onSave={handleSaveProgress}
          onComplete={handleComplete}
          onAbandon={handleAbandon}
          onClose={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}
