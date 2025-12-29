import { useMemo } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isBefore, isAfter, eachDayOfInterval } from 'date-fns';
import { CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';
import { TRAINING_PLAN, getWeekNumber, getPhaseForDate } from '../data/trainingPlan';

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-gray-400">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

export default function ComplianceStats({ workoutStatuses }) {
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const trainingStart = new Date('2025-12-07');

    // Get all planned workouts up to today
    const plannedWorkouts = Object.entries(TRAINING_PLAN).filter(([date, workout]) => {
      const workoutDate = parseISO(date);
      return !isAfter(workoutDate, today) && !isBefore(workoutDate, trainingStart) && workout.type !== 'rest';
    });

    // Count completed/modified workouts
    let completedCount = 0;
    let modifiedCount = 0;
    let missedCount = 0;
    let pendingCount = 0;

    plannedWorkouts.forEach(([date, workout]) => {
      const status = workoutStatuses[date]?.status || workout.status || 'pending';
      if (status === 'completed') completedCount++;
      else if (status === 'modified') modifiedCount++;
      else if (status === 'missed') missedCount++;
      else pendingCount++;
    });

    const totalPastWorkouts = completedCount + modifiedCount + missedCount + pendingCount;
    const successfulWorkouts = completedCount + modifiedCount;
    const overallCompliance = totalPastWorkouts > 0
      ? Math.round((successfulWorkouts / totalPastWorkouts) * 100)
      : 100;

    // Weekly compliance (current week)
    const weekStart = startOfWeek(today, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
    const thisWeekWorkouts = Object.entries(TRAINING_PLAN).filter(([date, workout]) => {
      const workoutDate = parseISO(date);
      return !isBefore(workoutDate, weekStart) &&
             !isAfter(workoutDate, weekEnd) &&
             !isAfter(workoutDate, today) &&
             workout.type !== 'rest';
    });

    let weeklyCompleted = 0;
    let weeklyTotal = thisWeekWorkouts.length;
    thisWeekWorkouts.forEach(([date, workout]) => {
      const status = workoutStatuses[date]?.status || workout.status || 'pending';
      if (status === 'completed' || status === 'modified') weeklyCompleted++;
    });
    const weeklyCompliance = weeklyTotal > 0
      ? Math.round((weeklyCompleted / weeklyTotal) * 100)
      : 100;

    // Monthly compliance
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const thisMonthWorkouts = Object.entries(TRAINING_PLAN).filter(([date, workout]) => {
      const workoutDate = parseISO(date);
      return !isBefore(workoutDate, monthStart) &&
             !isAfter(workoutDate, monthEnd) &&
             !isAfter(workoutDate, today) &&
             workout.type !== 'rest';
    });

    let monthlyCompleted = 0;
    let monthlyTotal = thisMonthWorkouts.length;
    thisMonthWorkouts.forEach(([date, workout]) => {
      const status = workoutStatuses[date]?.status || workout.status || 'pending';
      if (status === 'completed' || status === 'modified') monthlyCompleted++;
    });
    const monthlyCompliance = monthlyTotal > 0
      ? Math.round((monthlyCompleted / monthlyTotal) * 100)
      : 100;

    // Current streak
    let currentStreak = 0;
    const sortedDates = Object.keys(TRAINING_PLAN)
      .filter(date => {
        const workoutDate = parseISO(date);
        return !isAfter(workoutDate, today) &&
               !isBefore(workoutDate, trainingStart) &&
               TRAINING_PLAN[date].type !== 'rest';
      })
      .sort((a, b) => new Date(b) - new Date(a));

    for (const date of sortedDates) {
      const status = workoutStatuses[date]?.status || TRAINING_PLAN[date].status || 'pending';
      if (status === 'completed' || status === 'modified') {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      overallCompliance,
      weeklyCompliance,
      monthlyCompliance,
      currentStreak,
      completedCount,
      modifiedCount,
      missedCount,
      totalWorkouts: Object.keys(TRAINING_PLAN).filter(d => TRAINING_PLAN[d].type !== 'rest').length,
      successfulWorkouts,
    };
  }, [workoutStatuses]);

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Overall Compliance"
          value={`${stats.overallCompliance}%`}
          subtitle={`${stats.successfulWorkouts} of ${stats.completedCount + stats.modifiedCount + stats.missedCount} workouts`}
          icon={TrendingUp}
          color={stats.overallCompliance >= 80 ? 'bg-green-600' : stats.overallCompliance >= 60 ? 'bg-yellow-600' : 'bg-red-600'}
        />
        <StatCard
          title="This Week"
          value={`${stats.weeklyCompliance}%`}
          icon={Calendar}
          color={stats.weeklyCompliance >= 80 ? 'bg-green-600' : stats.weeklyCompliance >= 60 ? 'bg-yellow-600' : 'bg-red-600'}
        />
        <StatCard
          title="This Month"
          value={`${stats.monthlyCompliance}%`}
          icon={Calendar}
          color={stats.monthlyCompliance >= 80 ? 'bg-green-600' : stats.monthlyCompliance >= 60 ? 'bg-yellow-600' : 'bg-red-600'}
        />
        <StatCard
          title="Current Streak"
          value={stats.currentStreak}
          subtitle="workouts in a row"
          icon={Award}
          color="bg-purple-600"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Training Progress</span>
          <span className="text-gray-400">
            {stats.successfulWorkouts} / {stats.totalWorkouts} workouts
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${(stats.completedCount / stats.totalWorkouts) * 100}%` }}
            />
            <div
              className="bg-yellow-500 transition-all"
              style={{ width: `${(stats.modifiedCount / stats.totalWorkouts) * 100}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${(stats.missedCount / stats.totalWorkouts) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="text-green-400">✓ {stats.completedCount} completed</span>
          <span className="text-yellow-400">~ {stats.modifiedCount} modified</span>
          <span className="text-red-400">✗ {stats.missedCount} missed</span>
        </div>
      </div>
    </div>
  );
}
