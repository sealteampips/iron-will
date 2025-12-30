import { useState, useEffect } from 'react';
import { X, Clock, Heart, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { WORKOUT_TYPES, HR_ZONES } from '../data/trainingPlan';
import WorkoutImages from './WorkoutImages';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Upcoming', color: 'gray', icon: Clock },
  { value: 'completed', label: 'Completed', color: 'green', icon: CheckCircle },
  { value: 'modified', label: 'Modified', color: 'yellow', icon: AlertCircle },
  { value: 'missed', label: 'Missed', color: 'red', icon: XCircle },
];

// Workout types that track distance
const DISTANCE_WORKOUT_TYPES = ['swim', 'bike', 'run'];

// Meters to miles conversion
const METERS_PER_MILE = 1609.34;

export default function WorkoutModal({ workout, date, onClose, onUpdateStatus, onUpdateNotes, onUpdateDistance }) {
  const [notes, setNotes] = useState(workout?.notes || '');
  const [status, setStatus] = useState(workout?.status || 'pending');
  const [loggedDistance, setLoggedDistance] = useState(workout?.loggedDistance || '');

  if (!workout) return null;

  const workoutTypeKey = workout.type;
  const workoutTypeInfo = WORKOUT_TYPES[workoutTypeKey] || WORKOUT_TYPES.rest;
  const showDistanceInput = DISTANCE_WORKOUT_TYPES.includes(workoutTypeKey);
  const distanceUnit = workoutTypeKey === 'swim' ? 'meters' : 'miles';

  // Convert meters to miles for display
  const getDistanceInMiles = (distance) => {
    if (!distance || distance === 0) return 0;
    if (workoutTypeKey === 'swim') {
      return distance / METERS_PER_MILE;
    }
    return distance;
  };
  const hrZone = workout.zone ? HR_ZONES[workout.zone] : null;

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onUpdateStatus(date, newStatus);
  };

  const handleNotesBlur = () => {
    onUpdateNotes(date, notes);
  };

  const handleDistanceChange = (e) => {
    const value = e.target.value;
    setLoggedDistance(value);
  };

  const handleDistanceBlur = () => {
    const distance = Math.max(0, parseFloat(loggedDistance) || 0);
    setLoggedDistance(distance > 0 ? distance.toString() : '');
    onUpdateDistance?.(date, distance, workoutTypeKey);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{workoutTypeInfo.icon}</span>
            <div>
              <h2 className="text-lg font-bold">{workout.name}</h2>
              <p className="text-sm text-gray-400">{formatDate(date)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Workout Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? option.value === 'completed'
                          ? 'border-green-500 bg-green-500/20'
                          : option.value === 'modified'
                          ? 'border-yellow-500 bg-yellow-500/20'
                          : option.value === 'missed'
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-gray-500 bg-gray-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isSelected
                        ? option.value === 'completed'
                          ? 'text-green-400'
                          : option.value === 'modified'
                          ? 'text-yellow-400'
                          : option.value === 'missed'
                          ? 'text-red-400'
                          : 'text-gray-400'
                        : 'text-gray-500'
                    }`} />
                    <span className={isSelected ? 'text-white' : 'text-gray-400'}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workout Details */}
          <div className="grid grid-cols-2 gap-4">
            {workout.duration && (
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
                <p className="text-xl font-bold">{workout.duration} min</p>
              </div>
            )}

            {/* Target Distance - Display only, from training plan */}
            {workout.distance && (
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Target Distance</span>
                </div>
                <p className="text-xl font-bold">{workout.distance} mi</p>
              </div>
            )}
          </div>

          {/* Actual Distance Input - Only for Swim, Bike, Run */}
          {showDistanceInput && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>Actual Distance</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={loggedDistance}
                    onChange={handleDistanceChange}
                    onBlur={handleDistanceBlur}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className="w-24 bg-gray-600 text-white text-xl font-bold px-2 py-1 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-gray-400">{distanceUnit}</span>
                </div>
              {/* Show conversion for swim */}
              {workoutTypeKey === 'swim' && loggedDistance > 0 && (
                <p className="text-xs text-cyan-400 mt-1">
                  = {getDistanceInMiles(parseFloat(loggedDistance)).toFixed(2)} miles
                </p>
              )}
            </div>
          )}

          {/* HR Zone */}
          {hrZone && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Heart className="w-4 h-4" />
                <span>Target Heart Rate</span>
              </div>
              <p className="text-lg font-bold">{hrZone.name}</p>
              <p className="text-sm text-gray-400">{hrZone.min}-{hrZone.max} bpm · {hrZone.description}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Workout Description
            </label>
            <p className="text-gray-300 bg-gray-700/50 rounded-lg p-3">
              {workout.description}
            </p>
          </div>

          {/* Drills (for swim) */}
          {workout.drills && workout.drills.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Drills
              </label>
              <ul className="space-y-2">
                {workout.drills.map((drill, index) => (
                  <li key={index} className="text-gray-300 bg-gray-700/50 rounded-lg p-3 text-sm">
                    {drill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strength Workout Details */}
          {workout.strength && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Gym Version
                </label>
                <ul className="space-y-1">
                  {workout.strength.gymVersion.map((exercise, index) => (
                    <li key={index} className="text-gray-300 bg-gray-700/50 rounded-lg p-2 text-sm">
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="text-sm font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                  Home Workout Variation
                </label>
                <ul className="space-y-1">
                  {workout.strength.homeVersion.map((exercise, index) => (
                    <li key={index} className="text-gray-300 bg-cyan-900/30 rounded-lg p-2 text-sm">
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Milestone Check-in */}
          {workout.milestone && (
            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
              <p className="text-amber-300 font-semibold mb-2">📊 Milestone Check-in</p>
              <p className="text-gray-300 text-sm">{workout.milestoneText}</p>
            </div>
          )}

          {/* Mobility Reminder */}
          {workout.mobility && (
            <div className="bg-pink-900/30 border border-pink-500/50 rounded-lg p-3">
              <p className="text-pink-300 text-sm">
                🧘 Don't forget: 10-15 minutes mobility work today!
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Your Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="How did it go? Add notes here..."
              rows={3}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Workout Photos */}
          <WorkoutImages date={date} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
