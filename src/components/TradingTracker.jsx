import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateCumulativePnL, calculateMonthlyPnL } from '../utils/calculations';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-400 text-sm">{format(parseISO(data.date), 'MMM d, yyyy')}</p>
        <p className={`font-semibold ${data.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          Daily: ${data.pnl.toFixed(2)}
        </p>
        <p className={`font-semibold ${data.cumulative >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          Total: ${data.cumulative.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}

function PnLChart({ entries }) {
  const chartData = useMemo(() => calculateCumulativePnL(entries), [entries]);

  if (chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 md:p-6 h-64 flex items-center justify-center">
        <p className="text-gray-500">No trading data yet</p>
      </div>
    );
  }

  const totalPnL = chartData.length > 0 ? chartData[chartData.length - 1].cumulative : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Cumulative P&L
        </h3>
        <div className={`flex items-center gap-1 text-lg font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {totalPnL >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          ${totalPnL.toFixed(2)}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'M/d')}
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke={totalPnL >= 0 ? '#22C55E' : '#EF4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MonthlySummary({ entries }) {
  const monthlyData = useMemo(() => calculateMonthlyPnL(entries), [entries]);

  if (monthlyData.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <h3 className="font-semibold mb-4">Monthly Summary</h3>

      <div className="space-y-3">
        {monthlyData.map((month) => (
          <div
            key={month.month}
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
          >
            <div>
              <p className="font-medium">
                {format(parseISO(`${month.month}-01`), 'MMMM yyyy')}
              </p>
              <p className="text-sm text-gray-400">
                {month.days} trading days · {month.positive} green · {month.negative} red
              </p>
            </div>
            <div className={`text-lg font-bold ${month.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {month.total >= 0 ? '+' : ''}${month.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyStats({ entries }) {
  const stats = useMemo(() => {
    const tradingEntries = entries.filter(e => e.trading?.pnl !== 0);
    if (tradingEntries.length === 0) {
      return { winRate: 0, avgWin: 0, avgLoss: 0, largestWin: 0, largestLoss: 0 };
    }

    const wins = tradingEntries.filter(e => e.trading.pnl > 0);
    const losses = tradingEntries.filter(e => e.trading.pnl < 0);

    return {
      winRate: (wins.length / tradingEntries.length * 100).toFixed(0),
      avgWin: wins.length > 0
        ? (wins.reduce((sum, e) => sum + e.trading.pnl, 0) / wins.length).toFixed(2)
        : 0,
      avgLoss: losses.length > 0
        ? (losses.reduce((sum, e) => sum + e.trading.pnl, 0) / losses.length).toFixed(2)
        : 0,
      largestWin: Math.max(0, ...tradingEntries.map(e => e.trading.pnl)).toFixed(2),
      largestLoss: Math.min(0, ...tradingEntries.map(e => e.trading.pnl)).toFixed(2),
    };
  }, [entries]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6">
      <h3 className="font-semibold mb-4">Trading Stats</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.winRate}%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">${stats.avgWin}</div>
          <div className="text-xs text-gray-400">Avg Win</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">${stats.avgLoss}</div>
          <div className="text-xs text-gray-400">Avg Loss</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">${stats.largestWin}</div>
          <div className="text-xs text-gray-400">Largest Win</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">${stats.largestLoss}</div>
          <div className="text-xs text-gray-400">Largest Loss</div>
        </div>
      </div>
    </div>
  );
}

export default function TradingTracker({ entries }) {
  return (
    <div className="space-y-6">
      <PnLChart entries={entries} />
      <DailyStats entries={entries} />
      <MonthlySummary entries={entries} />
    </div>
  );
}
