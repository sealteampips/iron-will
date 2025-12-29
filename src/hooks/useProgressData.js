import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { getAllDailyEntries, saveDailyEntry } from '../lib/dataService';
// Old localStorage imports - kept for reference/rollback
// import { getStoredData, saveEntry, getAllEntries, createDefaultEntry } from '../utils/storage';
import { createDefaultEntry } from '../utils/storage';

export const useProgressData = () => {
  const [data, setData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount - now from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const supabaseEntries = await getAllDailyEntries();
        setEntries(supabaseEntries);
        // Create a data object similar to old format for compatibility
        const entriesObj = {};
        supabaseEntries.forEach(entry => {
          entriesObj[entry.date] = entry;
        });
        setData({ entries: entriesObj, startDate: '2025-12-08' });
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        setEntries([]);
        setData({ entries: {}, startDate: '2025-12-08' });
      }
      setIsLoading(false);
    };

    loadData();

    // Old localStorage code - kept for reference/rollback
    // const storedData = getStoredData();
    // setData(storedData);
    // setEntries(getAllEntries());
    // setIsLoading(false);
  }, []);

  // Get entry for a specific date
  const getEntryForDate = useCallback((date) => {
    const entry = entries.find(e => e.date === date);
    return entry || createDefaultEntry(date);
  }, [entries]);

  // Save entry for a date - now to Supabase
  const updateEntry = useCallback(async (date, entry) => {
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
      }
    } catch (error) {
      console.error('Error saving entry to Supabase:', error);
    }

    // Old localStorage code - kept for reference/rollback
    // const updatedData = saveEntry(date, entry);
    // setData(updatedData);
    // setEntries(getAllEntries());
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
  };
};
