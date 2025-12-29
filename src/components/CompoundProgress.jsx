import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, differenceInDays, eachDayOfInterval } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  getCompoundData,
  getCompoundDataForYear,
  generateReferenceLines,
  calculateDailyMultiplier,
  checkAndHandleYearReset,
  getArchivedYears,
  getCompoundArchive,
} from '../utils/bookStorage';

// Dynamic tracking - starts from the first entry or today, whichever is earlier
const getTrackingDates = (compoundData) => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  if (compoundData.length === 0) {
    // No data yet - start from today
    return { start: todayStr, end: todayStr };
  }

  // Start from first entry date
  const firstDate = compoundData[0].date;
  return { start: firstDate, end: todayStr };
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-sm text-gray-400">{format(parseISO(label), 'MMM d, yyyy')}</p>
        <p className="text-lg font-bold text-amber-400">
          {data.compound_score?.toFixed(3)}x
        </p>
        {data.daily_xp !== undefined && (
          <>
            <p className="text-sm text-gray-400">
              Daily XP: <span className="text-white">{data.daily_xp}</span>
            </p>
            <p className="text-sm text-gray-400">
              Multiplier: <span className="text-white">{data.multiplier?.toFixed(4)}</span>
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
}

export default function CompoundProgress({ entries, refreshKey = 0 }) {
  const [compoundData, setCompoundData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [archivedYears, setArchivedYears] = useState([]);
  const [viewingArchive, setViewingArchive] = useState(false);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const currentYear = today.getFullYear();

  // Calculate days tracked from the data
  const dayNumber = compoundData.length;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for year rollover and auto-archive
        await checkAndHandleYearReset();

        // Get archived years list
        const years = getArchivedYears();
        setArchivedYears(years);

        // Get data for the selected year
        if (selectedYear === currentYear) {
          // Current year - get live data
          const data = await getCompoundDataForYear(currentYear);
          setCompoundData(data);
          setViewingArchive(false);
        } else {
          // Viewing archived year
          const archive = getCompoundArchive(selectedYear);
          setCompoundData(archive?.data || []);
          setViewingArchive(true);
        }
      } catch (error) {
        console.error('Error loading compound data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, [refreshKey, selectedYear, currentYear]);

  // Generate chart data with reference lines
  const chartData = useMemo(() => {
    if (compoundData.length === 0) {
      // No data yet - show just today with starting values
      return [{
        date: todayStr,
        better: 1.0,
        neutral: 1.0,
        worse: 1.0,
        compound_score: 1.0,
      }];
    }

    const { start, end } = getTrackingDates(compoundData);
    const referenceLines = generateReferenceLines(start, end);

    // Create a map of user data by date
    const userDataMap = {};
    compoundData.forEach((d) => {
      userDataMap[d.date] = d;
    });

    // Combine reference lines with user data
    return referenceLines.better.map((point, idx) => ({
      date: point.date,
      better: point.value,
      neutral: referenceLines.neutral[idx].value,
      worse: referenceLines.worse[idx].value,
      compound_score: userDataMap[point.date]?.compound_score,
      daily_xp: userDataMap[point.date]?.daily_xp,
      multiplier: userDataMap[point.date]?.multiplier,
    }));
  }, [compoundData, todayStr]);

  // Calculate current score and comparison
  const currentScore = compoundData.length > 0
    ? compoundData[compoundData.length - 1].compound_score
    : 1.0;

  const neutralScore = Math.pow(1.0, dayNumber);
  const percentVsNeutral = ((currentScore / neutralScore - 1) * 100).toFixed(1);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Available years for selector (current year + archived)
  const availableYears = [currentYear, ...archivedYears.filter(y => y !== currentYear)].sort((a, b) => b - a);

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Compound Progress
          </h3>
          {/* Year Selector */}
          {availableYears.length > 1 ? (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year} {year === currentYear ? '' : '(archived)'}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {selectedYear}
            </span>
          )}
          {viewingArchive && (
            <span className="text-xs bg-amber-600/20 text-amber-400 px-2 py-1 rounded">
              Archived
            </span>
          )}
        </div>

        {/* Current Score */}
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">
            {currentScore.toFixed(3)}x
          </div>
          <div className="text-xs text-gray-500">
            {parseFloat(percentVsNeutral) >= 0 ? '+' : ''}{percentVsNeutral}% vs neutral
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-white">{dayNumber}</div>
          <div className="text-xs text-gray-400">Days Tracked</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-400">
            {Math.pow(1.01, dayNumber).toFixed(2)}x
          </div>
          <div className="text-xs text-gray-400">1% Better Target</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-400">
            {Math.pow(0.99, dayNumber).toFixed(2)}x
          </div>
          <div className="text-xs text-gray-400">1% Worse</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'MMM')}
              stroke="#6B7280"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(val) => `${val.toFixed(1)}x`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference lines */}
            <Line
              type="monotone"
              dataKey="better"
              stroke="#22C55E"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="1% Better"
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#6B7280"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Neutral"
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="worse"
              stroke="#EF4444"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="1% Worse"
              opacity={0.5}
            />

            {/* User's actual progress */}
            <Line
              type="monotone"
              dataKey="compound_score"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="Your Progress"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-amber-500"></div>
          <span className="text-gray-400">Your Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500 opacity-50"></div>
          <span className="text-gray-400">1% Better Daily</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-gray-500 opacity-50"></div>
          <span className="text-gray-400">Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-red-500 opacity-50"></div>
          <span className="text-gray-400">1% Worse Daily</span>
        </div>
      </div>

      {/* Started Date */}
      {compoundData.length > 0 && (
        <p className="text-center text-xs text-gray-500 mt-4">
          Started {format(parseISO(compoundData[0].date), 'MMMM d, yyyy')}
        </p>
      )}
      {compoundData.length === 0 && !viewingArchive && (
        <p className="text-center text-xs text-gray-500 mt-4">
          Started {format(new Date(), 'MMMM d, yyyy')}
        </p>
      )}
    </div>
  );
}
