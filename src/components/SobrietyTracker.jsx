import { useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { getWeedStreakData } from '../lib/dataService';
import { Flame, Trophy } from 'lucide-react';

function StreakCard({ title, current, longest, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-4 md:p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-3xl md:text-4xl font-bold text-white">{current}</span>
          </div>
          <p className="text-xs text-gray-300 uppercase tracking-wider">Current Streak</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-3xl md:text-4xl font-bold text-white">{longest}</span>
          </div>
          <p className="text-xs text-gray-300 uppercase tracking-wider">Longest Streak</p>
        </div>
      </div>
    </div>
  );
}

function CalendarHeatmap({ entries, year, month }) {
  const calendarData = useMemo(() => {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    const days = eachDayOfInterval({ start, end });

    const entriesMap = {};
    entries.forEach(entry => {
      entriesMap[entry.date] = entry;
    });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = entriesMap[dateStr];
      const isWeedClean = entry?.sobriety?.cleanFromWeed;

      return {
        date: dateStr,
        day: format(day, 'd'),
        dayOfWeek: getDay(day),
        isWeedClean,
        hasData: !!entry,
      };
    });
  }, [entries, year, month]);

  // Get the first day offset (0 = Sunday, 1 = Monday, etc.)
  const firstDayOffset = calendarData[0]?.dayOfWeek || 0;

  const getCellColor = (data) => {
    if (!data.hasData) return 'bg-gray-800';
    if (data.isWeedClean) return 'bg-green-500';
    return 'bg-red-900';
  };

  return (
    <div>
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {/* Day cells */}
        {calendarData.map((data) => (
          <div
            key={data.date}
            className={`aspect-square rounded-sm ${getCellColor(data)} flex items-center justify-center text-xs transition-colors cursor-default`}
            title={`${data.date}${data.hasData ? ` - Weed: ${data.isWeedClean ? 'Clean' : 'Not clean'}` : ''}`}
          >
            <span className={data.hasData ? 'text-white' : 'text-gray-600'}>
              {data.day}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-gray-400">Clean</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-900 rounded-sm"></div>
          <span className="text-gray-400">Not clean</span>
        </div>
      </div>
    </div>
  );
}

export default function SobrietyTracker({ entries, todayEntry }) {
  // Get today's clean status - default to true if not set
  const todayClean = todayEntry?.sobriety?.cleanFromWeed ?? true;

  // Use the new streak calculation based on start date
  const weedStreaks = useMemo(() =>
    getWeedStreakData(todayClean),
    [todayClean]
  );

  const currentDate = new Date();

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <StreakCard
        title="Clean from Weed"
        current={weedStreaks.current}
        longest={weedStreaks.longest}
        color="bg-green-500"
        bgColor="bg-gradient-to-br from-green-900/50 to-green-800/30"
      />

      {/* Calendar Heatmap */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <CalendarHeatmap
          entries={entries}
          year={currentDate.getFullYear()}
          month={currentDate.getMonth()}
        />
      </div>
    </div>
  );
}
