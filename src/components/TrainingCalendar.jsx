import { useState, useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday, isBefore, isAfter } from 'date-fns';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { TRAINING_PLAN, WORKOUT_TYPES, getPhaseForDate, getWeekNumber, TRAINING_PHASES, MILESTONE_WEEKS } from '../data/trainingPlan';
import { getHolidayForDate } from '../data/holidays';
import WorkoutModal from './WorkoutModal';

const PHASE_COLORS = {
  BASE: 'from-blue-900/30 to-blue-800/20',
  BUILD: 'from-yellow-900/30 to-yellow-800/20',
  PEAK: 'from-orange-900/30 to-orange-800/20',
  TAPER: 'from-green-900/30 to-green-800/20',
};

const STATUS_COLORS = {
  pending: 'bg-gray-700',
  completed: 'bg-green-600',
  modified: 'bg-yellow-600',
  missed: 'bg-red-600',
};

export default function TrainingCalendar({ workoutStatuses, onUpdateStatus, onUpdateNotes, onUpdateDistance }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showHolidays, setShowHolidays] = useState(true);

  const calendarData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const workout = TRAINING_PLAN[dateStr];
      const status = workoutStatuses[dateStr]?.status || workout?.status || 'pending';
      const phase = getPhaseForDate(dateStr);
      const weekNum = getWeekNumber(dateStr);
      const holiday = getHolidayForDate(dateStr);
      const isMilestoneWeek = MILESTONE_WEEKS.includes(weekNum);

      return {
        date: dateStr,
        day: format(day, 'd'),
        dayOfWeek: getDay(day),
        workout,
        status,
        phase,
        weekNum,
        holiday,
        isMilestoneWeek,
        isToday: isToday(day),
        isPast: isBefore(day, new Date()) && !isToday(day),
      };
    });
  }, [currentMonth, workoutStatuses]);

  const firstDayOffset = calendarData[0]?.dayOfWeek || 0;

  // Get current phase for the header
  const currentPhase = useMemo(() => {
    const firstDayOfMonth = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    return getPhaseForDate(firstDayOfMonth);
  }, [currentMonth]);

  const handleDayClick = (data) => {
    if (data.workout) {
      setSelectedWorkout({
        ...data.workout,
        ...workoutStatuses[data.date],
      });
      setSelectedDate(data.date);
    }
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
    setSelectedDate(null);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev =>
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  // Calculate training period bounds (first day of training month to last day of race month+1)
  const trainingStartMonth = new Date('2025-12-01');  // December 2025
  const trainingEndMonth = new Date('2026-07-31');    // Extended one month past race day

  // Check if we can navigate to previous/next month
  const canGoPrev = !isBefore(startOfMonth(subMonths(currentMonth, 1)), trainingStartMonth);
  const canGoNext = !isAfter(startOfMonth(addMonths(currentMonth, 1)), trainingEndMonth);

  return (
    <div className="space-y-4">
      {/* Phase Banner */}
      {currentPhase && (
        <div className={`bg-gradient-to-r ${PHASE_COLORS[currentPhase.name]} rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{currentPhase.name} PHASE</h3>
              <p className="text-sm text-gray-300">Weeks {currentPhase.weeks[0]}-{currentPhase.weeks[currentPhase.weeks.length - 1]} · {currentPhase.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">Week {getWeekNumber(format(new Date(), 'yyyy-MM-dd'))}</p>
              <p className="text-xs text-gray-400">of 27</p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            disabled={!canGoPrev}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHolidays(!showHolidays)}
              className={`p-2 rounded-lg transition-colors ${showHolidays ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              title={showHolidays ? 'Hide holidays' : 'Show holidays'}
            >
              {showHolidays ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigateMonth('next')}
              disabled={!canGoNext}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square md:aspect-auto md:min-h-[80px]"></div>
          ))}

          {/* Day cells */}
          {calendarData.map((data) => {
            const workoutType = data.workout ? WORKOUT_TYPES[data.workout.type] : null;
            const statusColor = data.workout ? STATUS_COLORS[data.status] : 'bg-gray-800';

            return (
              <div
                key={data.date}
                onClick={() => handleDayClick(data)}
                className={`aspect-square md:aspect-auto md:min-h-[80px] rounded-lg p-1 md:p-2 transition-colors cursor-pointer border-2 ${
                  data.isToday
                    ? 'border-blue-500'
                    : data.workout
                    ? 'border-transparent hover:border-gray-600'
                    : 'border-transparent'
                } ${data.workout ? statusColor : 'bg-gray-800/50'}`}
              >
                {/* Date number */}
                <div className="flex items-start justify-between">
                  <span className={`text-xs md:text-sm font-medium ${
                    data.isToday ? 'text-blue-400' : data.isPast && data.workout ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                    {data.day}
                  </span>
                  {data.isMilestoneWeek && data.dayOfWeek === 0 && (
                    <span className="text-xs" title="Milestone week">📊</span>
                  )}
                </div>

                {/* Workout info */}
                {data.workout && (
                  <div className="mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm md:text-base">{workoutType?.icon}</span>
                      <span className="text-xs text-gray-300 truncate hidden md:inline">
                        {data.workout.name.split(' - ')[0]}
                      </span>
                    </div>
                    {data.workout.duration && (
                      <p className="text-xs text-gray-400 hidden md:block">
                        {data.workout.duration}min
                      </p>
                    )}
                  </div>
                )}

                {/* Holiday */}
                {showHolidays && data.holiday && (
                  <p className="text-xs text-purple-400 truncate mt-1 hidden md:block">
                    {data.holiday}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span className="text-gray-400">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span className="text-gray-400">Modified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-400">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
            <span className="text-gray-400">Today</span>
          </div>
        </div>
      </div>

      {/* Quick Jump */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TRAINING_PHASES).map(([key, phase]) => {
          // Calculate the start date of this phase
          const phaseStartDate = new Date('2025-12-06');
          phaseStartDate.setDate(phaseStartDate.getDate() + (phase.weeks[0] - 1) * 7);

          // Check if the current month view overlaps with this phase
          const monthStart = startOfMonth(currentMonth);
          const monthEnd = endOfMonth(currentMonth);
          const phaseEndDate = new Date('2025-12-06');
          phaseEndDate.setDate(phaseEndDate.getDate() + (phase.weeks[phase.weeks.length - 1]) * 7 - 1);

          // Phase is selected if current month overlaps with it
          const isSelected = currentPhase?.name === phase.name;

          return (
            <button
              key={key}
              onClick={() => {
                setCurrentMonth(phaseStartDate);
              }}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {phase.name}
            </button>
          );
        })}
      </div>

      {/* Workout Modal */}
      {selectedWorkout && (
        <WorkoutModal
          workout={selectedWorkout}
          date={selectedDate}
          onClose={handleCloseModal}
          onUpdateStatus={onUpdateStatus}
          onUpdateNotes={onUpdateNotes}
          onUpdateDistance={onUpdateDistance}
        />
      )}
    </div>
  );
}
