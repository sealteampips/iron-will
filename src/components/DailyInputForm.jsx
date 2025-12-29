import { useState, useEffect } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { createDefaultEntry } from '../utils/storage';

const TRAINING_TYPES = [
  { value: 'swim', label: 'Swim', icon: '🏊', unit: 'meters', unitLabel: 'meters' },
  { value: 'bike', label: 'Bike', icon: '🚴', unit: 'miles', unitLabel: 'miles' },
  { value: 'run', label: 'Run', icon: '🏃', unit: 'miles', unitLabel: 'miles' },
  { value: 'strength', label: 'Strength', icon: '💪', unit: null, unitLabel: null },
  { value: 'rest', label: 'Rest Day', icon: '😴', unit: null, unitLabel: null },
];

const getTrainingType = (type) => TRAINING_TYPES.find((t) => t.value === type);

export default function DailyInputForm({ selectedDate, onDateChange, entry, onSave }) {
  const [formData, setFormData] = useState(createDefaultEntry(selectedDate));

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData(createDefaultEntry(selectedDate));
    }
  }, [entry, selectedDate]);

  const handleChange = (field, value) => {
    const newData = { ...formData };

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newData[parent] = { ...newData[parent], [child]: value };
    } else {
      newData[field] = value;
    }

    setFormData(newData);
    onSave(selectedDate, newData);
  };

  const navigateDate = (direction) => {
    const currentDate = parseISO(selectedDate);
    const newDate = direction === 'prev'
      ? subDays(currentDate, 1)
      : addDays(currentDate, 1);
    onDateChange(format(newDate, 'yyyy-MM-dd'));
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateDate('prev')}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          {isToday && (
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Today</span>
          )}
        </div>

        <button
          onClick={() => navigateDate('next')}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sobriety Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sobriety</h3>

          <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Clean from weed
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.sobriety?.cleanFromWeed || false}
                onChange={(e) => handleChange('sobriety.cleanFromWeed', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </div>
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Clean from porn
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.sobriety?.cleanFromPorn || false}
                onChange={(e) => handleChange('sobriety.cleanFromPorn', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </div>
          </label>
        </div>

        {/* Training Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Training</h3>

          <div className="flex flex-wrap gap-2">
            {TRAINING_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleChange('training.type', type.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.training?.type === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {formData.training?.type && !['strength', 'rest'].includes(formData.training.type) && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={formData.training.type === 'swim' ? '25' : '0.1'}
                min="0"
                placeholder="Distance"
                value={formData.training?.distance || ''}
                onChange={(e) => {
                  const trainingType = getTrainingType(formData.training.type);
                  const newData = {
                    ...formData,
                    training: {
                      ...formData.training,
                      distance: parseFloat(e.target.value) || 0,
                      distanceUnit: trainingType?.unit || 'miles',
                    },
                  };
                  setFormData(newData);
                  onSave(selectedDate, newData);
                }}
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-gray-400">
                {getTrainingType(formData.training.type)?.unitLabel || 'miles'}
              </span>
            </div>
          )}

          <textarea
            placeholder="Training notes (optional)"
            value={formData.training?.notes || ''}
            onChange={(e) => handleChange('training.notes', e.target.value)}
            rows={2}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        {/* Trading Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trading P&L</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.trading?.pnl || ''}
              onChange={(e) => handleChange('trading.pnl', parseFloat(e.target.value) || 0)}
              className={`flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none ${
                (formData.trading?.pnl || 0) > 0 ? 'text-green-400' : (formData.trading?.pnl || 0) < 0 ? 'text-red-400' : ''
              }`}
            />
          </div>
        </div>

        {/* Sleep Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sleep</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="Hours"
                value={formData.sleep?.hours || ''}
                onChange={(e) => handleChange('sleep.hours', parseFloat(e.target.value) || 0)}
                className="w-20 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-gray-400">hrs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Quality:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChange('sleep.quality', num)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      formData.sleep?.quality === num
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobility Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mobility Work</h3>
          <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650">
            <span>Did mobility/stretching</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.mobility || false}
                onChange={(e) => handleChange('mobility', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </div>
          </label>
        </div>

        {/* Mood Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Energy / Mood: <span className="text-white">{formData.mood || 5}</span>
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-sm">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood || 5}
              onChange={(e) => handleChange('mood', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-green-400 text-sm">10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
