import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { getAllDailyEntries, saveDailyEntry } from '../lib/dataService';
import { createDefaultEntry } from '../utils/storage';

export const useProgressData = () => {
  const [data, setData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error'

  // Load data on mount - now from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const supabaseEntries = await getAllDailyEntries();
        setEntries(supabaseEntries);
        // Create a data object similar to old format for compatibility
        const entriesObj = {};
        supabaseEntries.forEach(entry => {
          entriesObj[entry.date] = entry;
        });
        setData({ entries: entriesObj, startDate: '2025-12-08' });
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
        setError('Failed to load data. Please check your connection.');
        setEntries([]);
        setData({ entries: {}, startDate: '2025-12-08' });
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Get entry for a specific date
  const getEntryForDate = useCallback((date) => {
    const entry = entries.find(e => e.date === date);
    return entry || createDefaultEntry(date);
  }, [entries]);

  // Save entry for a date - now to Supabase
  const updateEntry = useCallback(async (date, entry) => {
    setSaveStatus('saving');
    try {
      const savedEntry = await saveDailyEntry(date, entry);
      if (savedEntry) {
        // Update local state
        setEntries(prev => {
          const existing = prev.findIndex(e => e.date === date);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = savedEntry;
            return updated;
          }
          return [...prev, savedEntry].sort((a, b) =>
            new Date(a.date) - new Date(b.date)
          );
        });
        setData(prev => ({
          ...prev,
          entries: { ...prev?.entries, [date]: savedEntry }
        }));
        setSaveStatus('saved');
        // Clear saved status after 2 seconds
        setTimeout(() => setSaveStatus(null), 2000);
      }
    } catch (err) {
      console.error('Error saving entry to Supabase:', err);
      setSaveStatus('error');
      // Keep error status visible longer
      setTimeout(() => setSaveStatus(null), 5000);
    }
  }, []);

  // Get current entry (selected date)
  const currentEntry = getEntryForDate(selectedDate);

  return {
    data,
    entries,
    selectedDate,
    setSelectedDate,
    currentEntry,
    getEntryForDate,
    updateEntry,
    isLoading,
    error,
    saveStatus,
  };
};
