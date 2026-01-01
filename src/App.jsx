import { useState, useMemo, useEffect } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Download, Upload, Menu, X, Flame, Medal, Target } from 'lucide-react';
import { useProgressData } from './hooks/useProgressData';
import { exportToJSON, importFromJSON } from './utils/storage';
import { calculateIronmanFromWorkoutsDB, getWeedStreakData } from './lib/dataService';
import { IRONMAN } from './utils/calculations';
import TrainingTracker from './components/TrainingTracker';
import ReadingTracker from './components/ReadingTracker';
import NutritionTracker from './components/NutritionTracker';
import DailyQuote from './components/DailyQuote';

const START_DATE = '2025-12-08';
const RACE_DATE = '2026-06-14';

const TABS = [
  { id: 'training', label: 'Training', icon: '🏋️' },
  { id: 'reading', label: 'Reading', icon: '📚' },
  { id: 'nutrition', label: 'Nutrition', icon: '🍽️' },
];

function RaceCountdown() {
  const today = new Date();
  const raceDate = parseISO(RACE_DATE);
  const startDate = parseISO(START_DATE);

  const daysRemaining = differenceInDays(raceDate, today);
  const totalDays = differenceInDays(raceDate, startDate);
  const daysPassed = differenceInDays(today, startDate);
  const progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

  return (
    <div className="bg-gradient-to-r from-red-900/30 via-orange-900/30 to-amber-900/30 rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-red-400" />
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{daysRemaining}</div>
            <p className="text-sm text-gray-300">days to race day</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-400">{format(raceDate, 'MMMM d, yyyy')}</p>
          <p className="text-xs text-gray-500">Race Day</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Training started</span>
          <span>{progressPercent.toFixed(0)}% complete</span>
          <span>Race day</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function TopStats({ entries, todayEntry }) {
  // Use new streak calculation based on start date
  // Streak only breaks if TODAY's toggle is OFF
  const todayClean = todayEntry?.sobriety?.cleanFromWeed ?? true;
  const weedStreaks = useMemo(() => getWeedStreakData(todayClean), [todayClean]);

  // State for async ironman data from Supabase
  const [ironmanData, setIronmanData] = useState({ fullIronmans: 0, totals: { swim: 0, bike: 0, run: 0 } });

  // Load Ironman progress from Supabase
  useEffect(() => {
    const loadIronmanData = async () => {
      try {
        const totals = await calculateIronmanFromWorkoutsDB();

        const ironmansCompleted = {
          swim: Math.floor(totals.swim / IRONMAN.swim),
          bike: Math.floor(totals.bike / IRONMAN.bike),
          run: Math.floor(totals.run / IRONMAN.run),
        };

        const fullIronmans = Math.min(
          ironmansCompleted.swim,
          ironmansCompleted.bike,
          ironmansCompleted.run
        );

        setIronmanData({ fullIronmans, totals });
      } catch (error) {
        console.error('Error loading ironman data:', error);
      }
    };
    loadIronmanData();

    // Old localStorage code - kept for reference/rollback
    // const totals = calculateIronmanFromWorkouts();
    // const ironmansCompleted = { ... };
    // const fullIronmans = Math.min(...);
    // return { fullIronmans, totals };
  }, []);

  const dayNumber = differenceInDays(new Date(), parseISO(START_DATE)) + 1;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* Day Counter */}
      <div className="bg-gray-800 rounded-xl p-3 md:p-4 text-center">
        <div className="text-2xl md:text-3xl font-bold text-white">Day {dayNumber}</div>
        <p className="text-xs text-gray-400">of your journey</p>
      </div>

      {/* Weed Streak */}
      <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-2xl md:text-3xl font-bold text-white">{weedStreaks.current}</span>
        </div>
        <p className="text-xs text-gray-300">Weed-free streak</p>
        <p className="text-xs text-gray-500">Best: {weedStreaks.longest}</p>
      </div>

      {/* Ironman Counter */}
      <div className="col-span-2 bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-3">
          <Medal className="w-8 h-8 text-amber-400 flex-shrink-0" />
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white">{ironmanData.fullIronmans}</div>
            <p className="text-xs text-gray-300">Ironmans Completed</p>
          </div>
          {/* Distance totals - inline on mobile, stacked on desktop */}
          <div className="ml-auto flex gap-2 md:gap-0 md:flex-col md:text-right text-xs text-gray-400">
            <span><span className="text-cyan-400">{ironmanData.totals.swim.toFixed(1)}</span> swim</span>
            <span><span className="text-yellow-400">{ironmanData.totals.bike.toFixed(1)}</span> bike</span>
            <span><span className="text-orange-400">{ironmanData.totals.run.toFixed(1)}</span> run</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { entries, selectedDate, setSelectedDate, currentEntry, updateEntry, isLoading, getEntryForDate, error, saveStatus } = useProgressData();
  const [activeTab, setActiveTab] = useState('training');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get today's entry for streak calculation (streak only breaks if TODAY is toggled off)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = getEntryForDate(todayStr);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importFromJSON(file);
        window.location.reload();
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-400 text-xl mb-2">Connection Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Progress Tracker</h1>
              {/* Save Status Indicator */}
              {saveStatus === 'saving' && (
                <span className="text-xs text-gray-400 animate-pulse">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-xs text-green-400">Saved</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-xs text-red-400">Save failed!</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Export/Import buttons */}
              <button
                onClick={exportToJSON}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Export data"
              >
                <Download className="w-5 h-5" />
              </button>

              <label className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title="Import data">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex gap-1 mt-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Navigation - Mobile */}
          {mobileMenuOpen && (
            <nav className="md:hidden flex flex-col gap-1 mt-3 pb-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Show training-focused header for Training and Nutrition tabs */}
        {activeTab !== 'reading' && (
          <>
            {/* Daily Motivational Quote */}
            <DailyQuote />

            {/* Race Countdown */}
            <RaceCountdown />

            {/* Top Stats */}
            <TopStats entries={entries} todayEntry={todayEntry} />
          </>
        )}

        {/* Tab Content */}
        <div className={activeTab === 'reading' ? '' : 'pt-2'}>
          {activeTab === 'training' && <TrainingTracker entries={entries} />}
          {activeTab === 'reading' && <ReadingTracker />}
          {activeTab === 'nutrition' && <NutritionTracker />}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        <p>Started {format(parseISO(START_DATE), 'MMMM d, yyyy')} · Keep pushing forward</p>
      </footer>
    </div>
  );
}
