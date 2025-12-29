import { useMemo } from 'react';
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  subWeeks,
  isBefore,
  isAfter,
  eachDayOfInterval,
} from 'date-fns';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { TRAINING_PLAN } from '../data/trainingPlan';

function getWeekStats(weekStart, weekEnd, workoutStatuses, includeUpcoming = false) {
  const today = new Date();

  // Get all workouts for this week
  const weekWorkouts = Object.entries(TRAINING_PLAN).filter(([date]) => {
    const workoutDate = parseISO(date);
    return !isBefore(workoutDate, weekStart) && !isAfter(workoutDate, weekEnd);
  });

  // Separate by discipline
  const disciplines = { swim: { planned: 0, completed: 0, duration: 0 }, bike: { planned: 0, completed: 0, duration: 0 }, run: { planned: 0, completed: 0, duration: 0 }, strength: { planned: 0, completed: 0, duration: 0 } };

  let totalPlanned = 0;
  let totalCompleted = 0;
  let totalDuration = 0;
  let completedDuration = 0;

  weekWorkouts.forEach(([date, workout]) => {
    const workoutDate = parseISO(date);
    const isPast = !isAfter(workoutDate, today);

    if (workout.type === 'rest') return;

    // Count planned workouts
    if (disciplines[workout.type]) {
      disciplines[workout.type].planned++;
      disciplines[workout.type].duration += workout.duration || 0;
    }
    totalPlanned++;
    totalDuration += workout.duration || 0;

    // Count completed workouts (only for past dates)
    if (isPast || includeUpcoming) {
      const status = workoutStatuses[date]?.status || workout.status || 'pending';
      if (status === 'completed' || status === 'modified') {
        if (disciplines[workout.type]) {
          disciplines[workout.type].completed++;
        }
        totalCompleted++;
        completedDuration += workout.duration || 0;
      }
    }
  });

  const completionPercent = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

  return {
    weekStart,
    weekEnd,
    disciplines,
    totalPlanned,
    totalCompleted,
    totalDuration,
    completedDuration,
    completionPercent,
  };
}

function DisciplineBar({ label, icon, completed, planned, color }) {
  const percent = planned > 0 ? (completed / planned) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-0.5">
          <span className={`${color}`}>{label}</span>
          <span className="text-gray-400">
            {completed}/{planned}
          </span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              color.includes('cyan') ? 'bg-cyan-500' :
              color.includes('yellow') ? 'bg-yellow-500' :
              color.includes('orange') ? 'bg-orange-500' :
              'bg-purple-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function WeekRow({ stats, label, isCurrentWeek = false }) {
  const getStatusColor = (percent) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBg = (percent) => {
    if (percent >= 80) return 'bg-green-900/30';
    if (percent >= 60) return 'bg-yellow-900/30';
    return 'bg-red-900/30';
  };

  const formatHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${
        isCurrentWeek ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-gray-800/50'
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isCurrentWeek ? 'text-blue-300' : 'text-gray-300'}`}>
            {label}
          </span>
          {isCurrentWeek && (
            <span className="text-xs px-1.5 py-0.5 bg-blue-600 rounded text-white">Current</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {format(stats.weekStart, 'MMM d')} - {format(stats.weekEnd, 'MMM d')}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-300">
            {stats.totalCompleted}/{stats.totalPlanned}
          </div>
          <div className="text-xs text-gray-500">workouts</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-gray-300">
            {formatHours(stats.completedDuration)}
          </div>
          <div className="text-xs text-gray-500">trained</div>
        </div>

        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusBg(
            stats.completionPercent
          )}`}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-white">{stats.completionPercent}%</div>
          </div>
        </div>

        <div className={`w-2 h-8 rounded-full ${getStatusColor(stats.completionPercent)}`} />
      </div>
    </div>
  );
}

export default function WeeklySummary({ workoutStatuses }) {
  const { currentWeek, pastWeeks } = useMemo(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    const currentWeekEnd = endOfWeek(today, { weekStartsOn: 0 });

    const currentWeek = getWeekStats(currentWeekStart, currentWeekEnd, workoutStatuses);

    // Get last 4 weeks (excluding current week)
    const pastWeeks = [];
    for (let i = 1; i <= 4; i++) {
      const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 0 });
      const weekEnd = endOfWeek(subWeeks(today, i), { weekStartsOn: 0 });

      // Only include weeks that have started after training began
      const trainingStart = parseISO('2025-12-06');
      if (!isBefore(weekEnd, trainingStart)) {
        pastWeeks.push(getWeekStats(weekStart, weekEnd, workoutStatuses));
      }
    }

    return { currentWeek, pastWeeks };
  }, [workoutStatuses]);

  const formatHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-4">
      {/* Current Week Details */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">This Week</h3>
          <span className="text-sm text-gray-400 ml-auto">
            {format(currentWeek.weekStart, 'MMM d')} - {format(currentWeek.weekEnd, 'MMM d')}
          </span>
        </div>

        {/* Main Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {currentWeek.totalCompleted}/{currentWeek.totalPlanned}
            </div>
            <div className="text-xs text-gray-400">Workouts</div>
          </div>
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {formatHours(currentWeek.completedDuration)}
            </div>
            <div className="text-xs text-gray-400">
              of {formatHours(currentWeek.totalDuration)} planned
            </div>
          </div>
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div
              className={`text-2xl font-bold ${
                currentWeek.completionPercent >= 80
                  ? 'text-green-400'
                  : currentWeek.completionPercent >= 60
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {currentWeek.completionPercent}%
            </div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>

        {/* Discipline Breakdown */}
        <div className="space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider">By Discipline</p>
          <DisciplineBar
            label="Swim"
            icon="🏊"
            completed={currentWeek.disciplines.swim.completed}
            planned={currentWeek.disciplines.swim.planned}
            color="text-cyan-400"
          />
          <DisciplineBar
            label="Bike"
            icon="🚴"
            completed={currentWeek.disciplines.bike.completed}
            planned={currentWeek.disciplines.bike.planned}
            color="text-yellow-400"
          />
          <DisciplineBar
            label="Run"
            icon="🏃"
            completed={currentWeek.disciplines.run.completed}
            planned={currentWeek.disciplines.run.planned}
            color="text-orange-400"
          />
          <DisciplineBar
            label="Strength"
            icon="💪"
            completed={currentWeek.disciplines.strength.completed}
            planned={currentWeek.disciplines.strength.planned}
            color="text-purple-400"
          />
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Weekly Progress</span>
            <span>
              {currentWeek.totalCompleted} of {currentWeek.totalPlanned} workouts
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentWeek.completionPercent >= 80
                  ? 'bg-green-500'
                  : currentWeek.completionPercent >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${currentWeek.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Past 4 Weeks */}
      {pastWeeks.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold">Recent Weeks</h3>
          </div>

          <div className="space-y-2">
            {pastWeeks.map((week, index) => (
              <WeekRow
                key={format(week.weekStart, 'yyyy-MM-dd')}
                stats={week}
                label={index === 0 ? 'Last Week' : `${index + 1} Weeks Ago`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
