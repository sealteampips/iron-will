import { useMemo, useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { calculateIronmanProgress, calculateWeeklyVolume, IRONMAN } from '../utils/calculations';
// Old localStorage imports - kept for reference/rollback
// import { getWorkoutStatuses, updateWorkoutStatus, updateWorkoutNotes, updateWorkoutDistance, calculateIronmanFromWorkouts } from '../utils/storage';
import {
  getWorkoutStatusesFromDB,
  updateWorkoutStatusInDB,
  updateWorkoutNotesInDB,
  updateWorkoutDistanceInDB,
  calculateIronmanFromWorkoutsDB
} from '../lib/dataService';
import { Medal, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import TrainingCalendar from './TrainingCalendar';
import ComplianceStats from './ComplianceStats';
import WeeklySummary from './WeeklySummary';

const WORKOUT_COLORS = {
  swim: 'bg-cyan-500',
  bike: 'bg-yellow-500',
  run: 'bg-orange-500',
  strength: 'bg-purple-500',
  rest: 'bg-gray-600',
};

function IronmanCounter({ fullIronmans, nextIronmanProgress }) {
  return (
    <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Medal className="w-8 h-8 text-amber-400" />
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">{fullIronmans}</h3>
          <p className="text-sm text-gray-300">Ironmans Completed</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Progress to Next Ironman</p>

        {/* Swim Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-cyan-400">🏊 Swim</span>
            <span className="text-gray-400">
              {nextIronmanProgress.swim.current.toFixed(1)} / {IRONMAN.swim} mi
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${Math.min(nextIronmanProgress.swim.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Bike Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-yellow-400">🚴 Bike</span>
            <span className="text-gray-400">
              {nextIronmanProgress.bike.current.toFixed(1)} / {IRONMAN.bike} mi
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${Math.min(nextIronmanProgress.bike.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Run Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-orange-400">🏃 Run</span>
            <span className="text-gray-400">
              {nextIronmanProgress.run.current.toFixed(1)} / {IRONMAN.run} mi
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${Math.min(nextIronmanProgress.run.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Full Ironman: {IRONMAN.swim}mi swim + {IRONMAN.bike}mi bike + {IRONMAN.run}mi run
      </p>
    </div>
  );
}

function WeeklyVolume({ entries }) {
  const volume = useMemo(() => calculateWeeklyVolume(entries), [entries]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold">This Week (Logged)</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{volume.swim.toFixed(1)}</div>
          <div className="text-xs text-gray-400">🏊 Swim mi</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{volume.bike.toFixed(1)}</div>
          <div className="text-xs text-gray-400">🚴 Bike mi</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{volume.run.toFixed(1)}</div>
          <div className="text-xs text-gray-400">🏃 Run mi</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-purple-400">{volume.strength}</div>
          <div className="text-xs text-gray-400">💪 Strength</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-400">{volume.rest}</div>
          <div className="text-xs text-gray-400">😴 Rest Days</div>
        </div>
      </div>
    </div>
  );
}

function AllTimeTotals({ ironmanData }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <h3 className="font-semibold mb-4">All-Time Totals (Logged)</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {ironmanData.totals.swim.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Miles Swum</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {ironmanData.totals.bike.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Miles Biked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {ironmanData.totals.run.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Miles Run</div>
        </div>
      </div>
    </div>
  );
}

export default function TrainingTracker({ entries }) {
  const [workoutStatuses, setWorkoutStatuses] = useState({});
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'stats'
  const [isLoading, setIsLoading] = useState(true);
  const [ironmanTotals, setIronmanTotals] = useState({ swim: 0, bike: 0, run: 0 });

  // Load workout statuses on mount - now from Supabase
  useEffect(() => {
    const loadWorkouts = async () => {
      setIsLoading(true);
      try {
        const statuses = await getWorkoutStatusesFromDB();
        setWorkoutStatuses(statuses);
        const totals = await calculateIronmanFromWorkoutsDB();
        setIronmanTotals(totals);
      } catch (error) {
        console.error('Error loading workouts from Supabase:', error);
      }
      setIsLoading(false);
    };
    loadWorkouts();

    // Old localStorage code - kept for reference/rollback
    // setWorkoutStatuses(getWorkoutStatuses());
  }, []);

  const ironmanData = useMemo(() => calculateIronmanProgress(entries), [entries]);

  const handleUpdateStatus = async (date, status) => {
    // Optimistic update
    setWorkoutStatuses(prev => ({
      ...prev,
      [date]: { ...prev[date], status }
    }));
    await updateWorkoutStatusInDB(date, status);
    // Old localStorage code - kept for reference/rollback
    // const updated = updateWorkoutStatus(date, status);
    // setWorkoutStatuses(updated);
  };

  const handleUpdateNotes = async (date, notes) => {
    setWorkoutStatuses(prev => ({
      ...prev,
      [date]: { ...prev[date], notes }
    }));
    await updateWorkoutNotesInDB(date, notes);
    // Old localStorage code - kept for reference/rollback
    // const updated = updateWorkoutNotes(date, notes);
    // setWorkoutStatuses(updated);
  };

  const handleUpdateDistance = async (date, distance, workoutType) => {
    setWorkoutStatuses(prev => ({
      ...prev,
      [date]: { ...prev[date], loggedDistance: distance, workoutType }
    }));
    await updateWorkoutDistanceInDB(date, distance, workoutType);
    // Refresh ironman totals after distance update
    const totals = await calculateIronmanFromWorkoutsDB();
    setIronmanTotals(totals);
    // Old localStorage code - kept for reference/rollback
    // const updated = updateWorkoutDistance(date, distance, workoutType);
    // setWorkoutStatuses(updated);
  };

  // Calculate Ironman progress from logged workout distances
  const workoutIronmanData = useMemo(() => {
    const totals = ironmanTotals;

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
  }, [ironmanTotals]);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveView('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          Training Calendar
        </button>
        <button
          onClick={() => setActiveView('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'stats'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Stats & Progress
        </button>
      </div>

      {activeView === 'calendar' ? (
        <>
          {/* Compliance Stats */}
          <ComplianceStats workoutStatuses={workoutStatuses} />

          {/* Training Calendar */}
          <TrainingCalendar
            workoutStatuses={workoutStatuses}
            onUpdateStatus={handleUpdateStatus}
            onUpdateNotes={handleUpdateNotes}
            onUpdateDistance={handleUpdateDistance}
          />
        </>
      ) : (
        <>
          {/* Weekly Summary */}
          <WeeklySummary workoutStatuses={workoutStatuses} />

          {/* Ironman Counter and Weekly Volume */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IronmanCounter
              fullIronmans={workoutIronmanData.fullIronmans}
              nextIronmanProgress={workoutIronmanData.nextIronmanProgress}
            />
            <WeeklyVolume entries={entries} />
          </div>

          {/* All-Time Totals */}
          <AllTimeTotals ironmanData={workoutIronmanData} />

          {/* Compliance Stats */}
          <ComplianceStats workoutStatuses={workoutStatuses} />
        </>
      )}
    </div>
  );
}
