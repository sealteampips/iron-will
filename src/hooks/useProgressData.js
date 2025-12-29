import { useState, useEffect, useCallback } from 'react';
import { getStoredData, saveEntry, getAllEntries, createDefaultEntry } from '../utils/storage';
import { format } from 'date-fns';

export const useProgressData = () => {
  const [data, setData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const storedData = getStoredData();
    setData(storedData);
    setEntries(getAllEntries());
    setIsLoading(false);
  }, []);

  // Get entry for a specific date
  const getEntryForDate = useCallback((date) => {
    const entry = entries.find(e => e.date === date);
    return entry || createDefaultEntry(date);
  }, [entries]);

  // Save entry for a date
  const updateEntry = useCallback((date, entry) => {
    const updatedData = saveEntry(date, entry);
    setData(updatedData);
    setEntries(getAllEntries());
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
