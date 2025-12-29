// 27-Week Half-Ironman Training Plan
// Race: June 14, 2026 (70.3 - 1.2mi swim, 56mi bike, 13.1mi run)
// Training Start: December 6, 2025 (Saturday)

export const TRAINING_START = '2025-12-06';
export const RACE_DATE = '2026-06-14';

export const TRAINING_PHASES = {
  BASE: { name: 'BASE', weeks: [1, 2, 3, 4, 5, 6, 7, 8], color: 'blue', description: 'Build aerobic engine, technique focus' },
  BUILD: { name: 'BUILD', weeks: [9, 10, 11, 12, 13, 14, 15, 16], color: 'yellow', description: 'Increase volume, introduce intensity' },
  PEAK: { name: 'PEAK', weeks: [17, 18, 19, 20, 21, 22, 23, 24], color: 'orange', description: 'Race-specific preparation' },
  TAPER: { name: 'TAPER', weeks: [25, 26, 27], color: 'green', description: 'Freshening up for race day' },
};

export const HR_ZONES = {
  1: { name: 'Zone 1 - Recovery', min: 113, max: 131, description: 'Very easy, conversational' },
  2: { name: 'Zone 2 - Aerobic', min: 131, max: 145, description: 'Easy endurance, can hold conversation' },
  3: { name: 'Zone 3 - Tempo', min: 145, max: 165, description: 'Comfortably hard, limited talking' },
  4: { name: 'Zone 4 - Threshold', min: 165, max: 179, description: 'Hard effort, race pace' },
};

export const MILESTONE_WEEKS = [4, 8, 12, 16, 20, 24];

// Workout type definitions
export const WORKOUT_TYPES = {
  swim: { icon: '🏊', label: 'Swim', color: 'cyan' },
  bike: { icon: '🚴', label: 'Bike', color: 'yellow' },
  run: { icon: '🏃', label: 'Run', color: 'orange' },
  strength: { icon: '💪', label: 'Strength', color: 'purple' },
  rest: { icon: '😴', label: 'Rest', color: 'gray' },
  brick: { icon: '🧱', label: 'Brick', color: 'red' },
  mobility: { icon: '🧘', label: 'Mobility', color: 'pink' },
  race: { icon: '🏆', label: 'Race', color: 'gold' },
};

// Strength workout templates
const STRENGTH_WORKOUTS = {
  fullBody: {
    name: 'Full Body Strength',
    gymVersion: [
      'Goblet Squats: 3x12',
      'Romanian Deadlifts: 3x10',
      'Lat Pulldowns: 3x12',
      'Dumbbell Bench Press: 3x10',
      'Plank: 3x45sec',
      'Dead Bugs: 3x10 each side',
    ],
    homeVersion: [
      'Goblet Squats (kettlebell): 3x12',
      'Single-Leg RDL (kettlebell): 3x10 each',
      'Bent Over Rows (dumbbells): 3x12',
      'Push-ups: 3x15',
      'Plank: 3x45sec',
      'Dead Bugs: 3x10 each side',
    ],
  },
  lowerBody: {
    name: 'Lower Body Focus',
    gymVersion: [
      'Leg Press: 3x12',
      'Walking Lunges: 3x10 each leg',
      'Leg Curls: 3x12',
      'Calf Raises: 3x15',
      'Glute Bridges: 3x15',
      'Copenhagen Plank: 3x20sec each side',
    ],
    homeVersion: [
      'Bulgarian Split Squats: 3x10 each leg',
      'Kettlebell Swings: 3x15',
      'Single-Leg Glute Bridges: 3x12 each',
      'Calf Raises (weighted): 3x15',
      'Side-Lying Leg Raises: 3x15 each',
      'Copenhagen Plank: 3x20sec each side',
    ],
  },
  upperBody: {
    name: 'Upper Body & Core',
    gymVersion: [
      'Cable Rows: 3x12',
      'Dumbbell Shoulder Press: 3x10',
      'Tricep Pushdowns: 3x12',
      'Bicep Curls: 3x12',
      'Pallof Press: 3x10 each side',
      'Hanging Leg Raises: 3x10',
    ],
    homeVersion: [
      'Mace 360s: 3x10 each direction',
      'Pike Push-ups: 3x10',
      'Diamond Push-ups: 3x12',
      'Dumbbell Curls: 3x12',
      'Pallof Press (band): 3x10 each side',
      'V-Ups: 3x12',
    ],
  },
  triCore: {
    name: 'Tri-Specific Core & Stability',
    gymVersion: [
      'Cable Woodchops: 3x10 each side',
      'TRX Y-T-W: 3x8 each',
      'Single-Leg Deadlift: 3x10 each',
      'Bosu Ball Squats: 3x12',
      'Bird Dogs: 3x10 each side',
      'Side Plank with Rotation: 3x8 each side',
    ],
    homeVersion: [
      'Mace Gravediggers: 3x10 each side',
      'Prone Y-T-W (light dumbbells): 3x8 each',
      'Single-Leg Deadlift (kettlebell): 3x10 each',
      'Pistol Squat Progressions: 3x8 each',
      'Bird Dogs: 3x10 each side',
      'Side Plank with Rotation: 3x8 each side',
    ],
  },
  light: {
    name: 'Light Strength - Maintenance',
    gymVersion: [
      'Goblet Squats: 2x10',
      'Push-ups: 2x12',
      'TRX Rows: 2x12',
      'Plank: 2x30sec',
      'Bird Dogs: 2x8 each side',
    ],
    homeVersion: [
      'Bodyweight Squats: 2x15',
      'Push-ups: 2x12',
      'Bent Over Rows (light): 2x12',
      'Plank: 2x30sec',
      'Bird Dogs: 2x8 each side',
    ],
  },
};

// Swim drill descriptions
const SWIM_DRILLS = {
  catchUp: 'Catch-Up Drill: One arm stays extended while other completes full stroke. Focus on rotation and catch.',
  fingertipDrag: 'Fingertip Drag: Drag fingertips along water surface during recovery. Promotes high elbow.',
  kickOnSide: 'Kick on Side: Kick with one arm extended, body rotated. Switch sides every 25m.',
  fistDrill: 'Fist Drill: Swim with closed fists to improve feel for water with forearms.',
  sixKickSwitch: '6-Kick Switch: 6 kicks on side, take one stroke, 6 kicks on other side.',
  tarzan: 'Tarzan Drill: Swim with head up, eyes forward. Builds neck strength for sighting.',
  buildSwim: 'Build: Start easy, increase effort every 25m to finish fast.',
};

// Generate the complete 27-week plan starting December 6, 2025
function generateTrainingPlan() {
  const plan = {};

  // Week 1 - Rust Shaking (Dec 6-12) - NO SWIMMING
  // Sat Dec 6
  plan['2025-12-06'] = {
    type: 'bike',
    name: 'Easy Bike - Getting Started',
    duration: 45,
    zone: 2,
    distance: 7.75,
    description: 'Easy spin on the trainer. Focus on smooth pedaling, stay seated. Get reacquainted with the bike.',
    status: 'completed',
  };
  // Sun Dec 7
  plan['2025-12-07'] = {
    type: 'run',
    name: 'Easy Run - Baseline',
    duration: 30,
    zone: 2,
    distance: 1.8,
    description: 'Very easy jog. Walk breaks are fine. Just get moving and establish baseline.',
    status: 'completed',
  };
  // Mon Dec 8
  plan['2025-12-08'] = {
    type: 'strength',
    name: 'Light Strength - Gym',
    duration: 40,
    description: 'Light gym session. Getting back into the routine. Focus on form over weight.',
    strength: STRENGTH_WORKOUTS.light,
    mobility: true,
    status: 'completed',
  };
  // Tue Dec 9
  plan['2025-12-09'] = {
    type: 'bike',
    name: 'Easy Bike - Zone 2',
    duration: 35,
    zone: 2,
    description: 'Steady Zone 2 effort on trainer. Focus on cadence 85-95 RPM. Stay aerobic.',
    status: 'pending',
  };
  // Wed Dec 10
  plan['2025-12-10'] = {
    type: 'run',
    name: 'Easy Run + Mobility',
    duration: 30,
    zone: 2,
    description: 'Easy Zone 2 run. Walk when HR drifts too high. Follow with 15min mobility routine.',
    mobility: true,
    status: 'pending',
  };
  // Thu Dec 11
  plan['2025-12-11'] = {
    type: 'bike',
    name: 'Easy Bike - Building Time',
    duration: 40,
    zone: 2,
    description: 'Slightly longer Zone 2 ride. Practice fueling - try sipping water every 15min.',
    status: 'pending',
  };
  // Fri Dec 12
  plan['2025-12-12'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Complete rest. Light stretching and foam rolling if desired. Hydrate well.',
    mobility: true,
    status: 'pending',
  };

  // Week 2 - First Swim Week (Dec 13-19)
  plan['2025-12-13'] = {
    type: 'run',
    name: 'Long Run - Zone 2',
    duration: 40,
    zone: 2,
    description: 'Longest run so far. Stay strictly in Zone 2. Walk breaks as needed. Build time on feet.',
    status: 'pending',
  };
  plan['2025-12-14'] = {
    type: 'swim',
    name: 'First Swim - Technique Assessment',
    duration: 30,
    zone: 1,
    distance: 0.5,
    description: 'First swim session! Easy effort. Focus on body position and breathing. 4x50m with rest. Assess where technique is at.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.fingertipDrag],
    status: 'pending',
  };
  plan['2025-12-15'] = {
    type: 'bike',
    name: 'Easy Bike - Recovery',
    duration: 35,
    zone: 1,
    description: 'Very easy spin. Active recovery. Keep HR in Zone 1.',
    status: 'pending',
  };
  plan['2025-12-16'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 2,
    description: 'Easy Zone 2 run. Focus on relaxed form. Short quick steps.',
    mobility: true,
    status: 'pending',
  };
  plan['2025-12-17'] = {
    type: 'swim',
    name: 'Swim - Drill Focus',
    duration: 35,
    zone: 2,
    distance: 0.6,
    description: 'Warm up 200m easy. 4x50m drill/swim by 25. 4x50m build. Cool down 100m.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.kickOnSide],
    status: 'pending',
  };
  plan['2025-12-18'] = {
    type: 'strength',
    name: 'Lower Body Strength',
    duration: 45,
    description: 'Lower body focus. Building foundation for bike and run.',
    strength: STRENGTH_WORKOUTS.lowerBody,
    mobility: true,
    status: 'pending',
  };
  plan['2025-12-19'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Complete rest. Light mobility work. Prepare for week 3.',
    status: 'pending',
  };

  // Week 3 - Building Routine (Dec 20-26)
  plan['2025-12-20'] = {
    type: 'bike',
    name: 'Long Bike - Zone 2',
    duration: 50,
    zone: 2,
    distance: 12,
    description: 'Longest bike so far. Steady Zone 2. Practice nutrition - aim for 100-150 cal/hour.',
    status: 'pending',
  };
  plan['2025-12-21'] = {
    type: 'swim',
    name: 'Swim - Building Endurance',
    duration: 35,
    zone: 2,
    distance: 0.7,
    description: 'Continuous swimming focus. 200m warm-up. 6x100m with 20sec rest. 100m cool-down.',
    drills: [SWIM_DRILLS.fingertipDrag],
    status: 'pending',
  };
  plan['2025-12-22'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 2,
    description: 'Easy effort. Focus on form. Stay relaxed through the holidays.',
    status: 'pending',
  };
  plan['2025-12-23'] = {
    type: 'bike',
    name: 'Easy Bike',
    duration: 35,
    zone: 2,
    description: 'Easy spin. Keep things light before the holidays.',
    status: 'pending',
  };
  plan['2025-12-24'] = {
    type: 'rest',
    name: 'Rest Day - Christmas Eve',
    description: 'Rest and enjoy the holiday. Light stretching if desired.',
    status: 'pending',
  };
  plan['2025-12-25'] = {
    type: 'rest',
    name: 'Rest Day - Christmas',
    description: 'Merry Christmas! Complete rest. Enjoy family time.',
    status: 'pending',
  };
  plan['2025-12-26'] = {
    type: 'swim',
    name: 'Swim - Drill Day',
    duration: 30,
    zone: 2,
    distance: 0.5,
    description: 'All drills today. Focus on technique refinement.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.fistDrill, SWIM_DRILLS.sixKickSwitch],
    status: 'pending',
  };

  // Week 4 - First Milestone (Dec 27 - Jan 2)
  plan['2025-12-27'] = {
    type: 'run',
    name: 'Long Run - Zone 2',
    duration: 45,
    zone: 2,
    distance: 3.5,
    description: 'Building run duration. Stay in Zone 2. Walk breaks OK. Focus on time on feet.',
    status: 'pending',
  };
  plan['2025-12-28'] = {
    type: 'bike',
    name: 'Long Bike - Steady',
    duration: 55,
    zone: 2,
    distance: 14,
    description: 'Longest ride yet. Steady effort. Practice eating/drinking on the bike.',
    status: 'pending',
  };
  plan['2025-12-29'] = {
    type: 'swim',
    name: 'Swim - Endurance',
    duration: 40,
    zone: 2,
    distance: 0.8,
    description: '200m warm-up. 8x100m @ Zone 2 with 15sec rest. 200m cool-down.',
    status: 'pending',
  };
  plan['2025-12-30'] = {
    type: 'strength',
    name: 'Full Body Strength',
    duration: 45,
    description: 'Year-end strength session. Solid form, moderate effort.',
    strength: STRENGTH_WORKOUTS.fullBody,
    mobility: true,
    status: 'pending',
  };
  plan['2025-12-31'] = {
    type: 'rest',
    name: "Rest Day - New Year's Eve",
    description: 'Rest and prepare for the new year. Light stretching.',
    status: 'pending',
  };
  plan['2026-01-01'] = {
    type: 'rest',
    name: "Rest Day - New Year's Day",
    description: "Start the year fresh. Rest and reflect on week 4 progress.",
    milestone: true,
    milestoneText: '📊 WEEK 4 MILESTONE: How is the routine feeling? Any nagging issues?',
    status: 'pending',
  };
  plan['2026-01-02'] = {
    type: 'bike',
    name: 'Easy Bike',
    duration: 35,
    zone: 2,
    description: 'Easy spin to start the new year of training.',
    status: 'pending',
  };

  // Week 5 (Jan 3-9)
  plan['2026-01-03'] = {
    type: 'swim',
    name: 'Swim - Technique + Distance',
    duration: 40,
    zone: 2,
    distance: 0.9,
    description: '200m warm-up. 4x50m drills. 6x100m steady. 200m cool-down. Focus on long strokes.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.fingertipDrag],
    status: 'pending',
  };
  plan['2026-01-04'] = {
    type: 'bike',
    name: 'Long Bike - Zone 2',
    duration: 60,
    zone: 2,
    distance: 15,
    description: 'First hour-long ride. Steady Zone 2. Dial in your trainer setup and positioning.',
    status: 'pending',
  };
  plan['2026-01-05'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 2,
    description: 'Recovery run. Keep it very easy.',
    status: 'pending',
  };
  plan['2026-01-06'] = {
    type: 'swim',
    name: 'Swim - Drill Focus',
    duration: 35,
    zone: 2,
    distance: 0.6,
    description: 'Technique day. Lots of drills. 50% drill, 50% swim.',
    drills: [SWIM_DRILLS.fistDrill, SWIM_DRILLS.sixKickSwitch, SWIM_DRILLS.kickOnSide],
    status: 'pending',
  };
  plan['2026-01-07'] = {
    type: 'strength',
    name: 'Upper Body & Core',
    duration: 45,
    description: 'Upper body focus with core work.',
    strength: STRENGTH_WORKOUTS.upperBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-01-08'] = {
    type: 'bike',
    name: 'Easy Bike - Cadence Work',
    duration: 40,
    zone: 2,
    description: 'Zone 2 with cadence focus. Alternate 5min @ 85rpm and 5min @ 95rpm.',
    status: 'pending',
  };
  plan['2026-01-09'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Full rest day. Foam rolling and stretching.',
    status: 'pending',
  };

  // Week 6 (Jan 10-16)
  plan['2026-01-10'] = {
    type: 'run',
    name: 'Long Run - Building',
    duration: 50,
    zone: 2,
    distance: 4,
    description: 'Extending the long run. Maintain Zone 2. Practice run nutrition (gels/chews).',
    status: 'pending',
  };
  plan['2026-01-11'] = {
    type: 'swim',
    name: 'Swim - Continuous Effort',
    duration: 40,
    zone: 2,
    distance: 1.0,
    description: '200m warm-up. 800m continuous @ Zone 2. 200m cool-down. Build swim endurance.',
    status: 'pending',
  };
  plan['2026-01-12'] = {
    type: 'bike',
    name: 'Easy Bike - Recovery',
    duration: 35,
    zone: 1,
    description: 'Very easy spin. Active recovery.',
    status: 'pending',
  };
  plan['2026-01-13'] = {
    type: 'run',
    name: 'Easy Run + Strides',
    duration: 30,
    zone: 2,
    description: '25min easy run + 4x20sec strides (not sprints, just faster turnover).',
    mobility: true,
    status: 'pending',
  };
  plan['2026-01-14'] = {
    type: 'swim',
    name: 'Swim - Mixed Session',
    duration: 40,
    zone: 2,
    distance: 0.9,
    description: '200m warm-up. 4x50m drill. 4x100m descend 1-4. 4x50m build. 100m cool-down.',
    drills: [SWIM_DRILLS.tarzan, SWIM_DRILLS.buildSwim],
    status: 'pending',
  };
  plan['2026-01-15'] = {
    type: 'strength',
    name: 'Tri-Specific Core',
    duration: 45,
    description: 'Core and stability work specific to triathlon.',
    strength: STRENGTH_WORKOUTS.triCore,
    mobility: true,
    status: 'pending',
  };
  plan['2026-01-16'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recovery.',
    status: 'pending',
  };

  // Week 7 (Jan 17-23)
  plan['2026-01-17'] = {
    type: 'bike',
    name: 'Long Bike - Endurance',
    duration: 70,
    zone: 2,
    distance: 18,
    description: '70 minutes steady Zone 2. Practice race nutrition strategy.',
    status: 'pending',
  };
  plan['2026-01-18'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 35,
    zone: 2,
    description: 'Easy recovery run. Keep effort conversational.',
    status: 'pending',
  };
  plan['2026-01-19'] = {
    type: 'swim',
    name: 'Swim - Technique',
    duration: 35,
    zone: 2,
    distance: 0.8,
    description: 'Drill-heavy session. 200m warm-up. 8x50m alternating drill/swim. 400m steady. 100m cool-down.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.fingertipDrag, SWIM_DRILLS.kickOnSide],
    status: 'pending',
  };
  plan['2026-01-20'] = {
    type: 'bike',
    name: 'Bike - Cadence Intervals',
    duration: 45,
    zone: 2,
    description: '10min warm-up. 6x3min @ high cadence (100+rpm) with 2min recovery. 10min cool-down.',
    status: 'pending',
  };
  plan['2026-01-21'] = {
    type: 'strength',
    name: 'Lower Body Strength',
    duration: 45,
    description: 'Lower body focus. Building leg strength for the bike and run.',
    strength: STRENGTH_WORKOUTS.lowerBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-01-22'] = {
    type: 'swim',
    name: 'Swim - Endurance',
    duration: 40,
    zone: 2,
    distance: 1.0,
    description: '200m warm-up. 1000m continuous at comfortable pace. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-01-23'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and prepare for week 8 - final base week.',
    status: 'pending',
  };

  // Week 8 - Final Base Week / Milestone (Jan 24-30)
  plan['2026-01-24'] = {
    type: 'run',
    name: 'Long Run - Base Test',
    duration: 55,
    zone: 2,
    distance: 4.5,
    description: 'Final base phase long run. How far can you go at Zone 2? Test your progress.',
    status: 'pending',
  };
  plan['2026-01-25'] = {
    type: 'swim',
    name: 'Swim - Distance Test',
    duration: 45,
    zone: 2,
    distance: 1.2,
    description: '200m warm-up. 1200m continuous effort. 200m cool-down. Half-Ironman swim distance check!',
    status: 'pending',
  };
  plan['2026-01-26'] = {
    type: 'bike',
    name: 'Easy Bike - Recovery',
    duration: 35,
    zone: 1,
    description: 'Easy recovery spin.',
    status: 'pending',
  };
  plan['2026-01-27'] = {
    type: 'run',
    name: 'Easy Run + Strides',
    duration: 30,
    zone: 2,
    description: 'Easy run with 6x20sec strides.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-01-28'] = {
    type: 'strength',
    name: 'Full Body Strength',
    duration: 45,
    description: 'Final base phase strength session.',
    strength: STRENGTH_WORKOUTS.fullBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-01-29'] = {
    type: 'bike',
    name: 'Long Bike - Base Finale',
    duration: 75,
    zone: 2,
    distance: 20,
    description: 'Final base phase long ride. Celebrate your progress!',
    status: 'pending',
  };
  plan['2026-01-30'] = {
    type: 'rest',
    name: 'Rest Day - End of Base',
    description: 'Base phase complete! Rest and reflect.',
    milestone: true,
    milestoneText: '📊 WEEK 8 MILESTONE: Base phase complete! Ready to build intensity?',
    status: 'pending',
  };

  // BUILD PHASE - Weeks 9-16
  // Week 9 - Intro to Intensity (Jan 31 - Feb 6)
  plan['2026-01-31'] = {
    type: 'swim',
    name: 'Swim - First Intervals',
    duration: 45,
    zone: 2,
    distance: 1.2,
    description: '300m warm-up. 8x100m @ Zone 3 with 20sec rest. 300m cool-down. First taste of intensity!',
    status: 'pending',
  };
  plan['2026-02-01'] = {
    type: 'bike',
    name: 'Long Bike - Steady',
    duration: 80,
    zone: 2,
    distance: 22,
    description: 'Building bike volume. Stay in Zone 2 for most, finish with 10min @ Zone 3.',
    status: 'pending',
  };
  plan['2026-02-02'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 35,
    zone: 2,
    description: 'Recovery run. Stay easy.',
    status: 'pending',
  };
  plan['2026-02-03'] = {
    type: 'swim',
    name: 'Swim - Technique',
    duration: 40,
    zone: 2,
    distance: 0.9,
    description: 'Drill focus day. Work on catch and rotation.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.fistDrill],
    status: 'pending',
  };
  plan['2026-02-04'] = {
    type: 'bike',
    name: 'Bike - First Tempo',
    duration: 50,
    zone: 2,
    description: '15min warm-up. 2x10min @ Zone 3 with 5min recovery. 10min cool-down.',
    status: 'pending',
  };
  plan['2026-02-05'] = {
    type: 'strength',
    name: 'Tri-Specific Core',
    duration: 45,
    description: 'Core and stability focus.',
    strength: STRENGTH_WORKOUTS.triCore,
    mobility: true,
    status: 'pending',
  };
  plan['2026-02-06'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 10 - First Brick (Feb 7-13)
  plan['2026-02-07'] = {
    type: 'run',
    name: 'Long Run - Tempo Finish',
    duration: 55,
    zone: 2,
    distance: 5,
    description: '45min Zone 2, then 10min @ Zone 3. Practice race effort.',
    status: 'pending',
  };
  plan['2026-02-08'] = {
    type: 'brick',
    name: 'First Brick - Bike to Run',
    duration: 70,
    description: '45min bike @ Zone 2, immediately followed by 15min easy run. Experience the jelly legs!',
    status: 'pending',
  };
  plan['2026-02-09'] = {
    type: 'swim',
    name: 'Swim - Endurance',
    duration: 45,
    zone: 2,
    distance: 1.3,
    description: '300m warm-up. 1200m continuous @ Zone 2. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-02-10'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Very easy recovery run.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-02-11'] = {
    type: 'bike',
    name: 'Bike - Intervals',
    duration: 55,
    zone: 2,
    description: '15min warm-up. 5x4min @ Zone 3 with 3min recovery. 10min cool-down.',
    status: 'pending',
  };
  plan['2026-02-12'] = {
    type: 'strength',
    name: 'Lower Body Strength',
    duration: 45,
    description: 'Building power in the legs.',
    strength: STRENGTH_WORKOUTS.lowerBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-02-13'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 11 (Feb 14-20)
  plan['2026-02-14'] = {
    type: 'swim',
    name: 'Swim - Speed Work',
    duration: 45,
    zone: 2,
    distance: 1.2,
    description: "300m warm-up. 8x75m fast with 30sec rest. 6x100m steady. 200m cool-down. Happy Valentine's Day!",
    status: 'pending',
  };
  plan['2026-02-15'] = {
    type: 'bike',
    name: 'Long Bike - Building',
    duration: 90,
    zone: 2,
    distance: 25,
    description: '90 minutes steady. Include 15min @ race effort (Zone 3).',
    status: 'pending',
  };
  plan['2026-02-16'] = {
    type: 'run',
    name: 'Run - Tempo Intervals',
    duration: 40,
    zone: 2,
    description: '10min warm-up. 4x5min @ Zone 3 with 2min jog. 5min cool-down.',
    status: 'pending',
  };
  plan['2026-02-17'] = {
    type: 'swim',
    name: 'Swim - Drills',
    duration: 35,
    zone: 2,
    distance: 0.8,
    description: 'Technique refinement day.',
    drills: [SWIM_DRILLS.tarzan, SWIM_DRILLS.catchUp],
    status: 'pending',
  };
  plan['2026-02-18'] = {
    type: 'bike',
    name: 'Easy Bike - Recovery',
    duration: 35,
    zone: 1,
    description: 'Easy spin. Active recovery.',
    status: 'pending',
  };
  plan['2026-02-19'] = {
    type: 'strength',
    name: 'Full Body Strength',
    duration: 45,
    description: 'Balanced strength work.',
    strength: STRENGTH_WORKOUTS.fullBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-02-20'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 12 - Milestone (Feb 21-27)
  plan['2026-02-21'] = {
    type: 'run',
    name: 'Long Run',
    duration: 60,
    zone: 2,
    distance: 5.5,
    description: 'Hour-long run. Stay mostly Zone 2 with 15min @ Zone 3.',
    status: 'pending',
  };
  plan['2026-02-22'] = {
    type: 'brick',
    name: 'Brick - Longer Combo',
    duration: 85,
    description: '60min bike @ Zone 2, then 20min run. Practice quick transition.',
    status: 'pending',
  };
  plan['2026-02-23'] = {
    type: 'swim',
    name: 'Swim - Race Simulation',
    duration: 50,
    zone: 2,
    distance: 1.4,
    description: '200m easy warm-up. 1200m @ race pace (Zone 3). 200m cool-down. Race distance!',
    status: 'pending',
  };
  plan['2026-02-24'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Recovery run.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-02-25'] = {
    type: 'bike',
    name: 'Bike - Sweet Spot',
    duration: 60,
    zone: 2,
    description: '15min warm-up. 2x15min @ Zone 3 with 5min recovery. 10min cool-down.',
    status: 'pending',
  };
  plan['2026-02-26'] = {
    type: 'strength',
    name: 'Upper Body & Core',
    duration: 45,
    description: 'Upper body and core focus.',
    strength: STRENGTH_WORKOUTS.upperBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-02-27'] = {
    type: 'rest',
    name: 'Rest Day - Week 12 Milestone',
    description: 'Halfway through build phase!',
    milestone: true,
    milestoneText: '📊 WEEK 12 MILESTONE: How are the intensity sessions going? Any adjustments?',
    status: 'pending',
  };

  // Week 13 (Feb 28 - Mar 6)
  plan['2026-02-28'] = {
    type: 'swim',
    name: 'Swim - Pyramid',
    duration: 50,
    zone: 2,
    distance: 1.4,
    description: '200m warm-up. Pyramid: 100-200-300-400-300-200-100 with 20sec rest. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-03-01'] = {
    type: 'bike',
    name: 'Long Bike - Progression',
    duration: 100,
    zone: 2,
    distance: 28,
    description: 'Longer ride. First hour easy, second 40min at Zone 2-3. Build effort.',
    status: 'pending',
  };
  plan['2026-03-02'] = {
    type: 'run',
    name: 'Easy Run + Strides',
    duration: 35,
    zone: 2,
    description: '30min easy + 6x20sec strides.',
    status: 'pending',
  };
  plan['2026-03-03'] = {
    type: 'swim',
    name: 'Swim - Speed',
    duration: 40,
    zone: 2,
    distance: 1.0,
    description: '300m warm-up. 10x50m fast with 20sec rest. 500m steady. 100m cool-down.',
    status: 'pending',
  };
  plan['2026-03-04'] = {
    type: 'run',
    name: 'Run - Tempo',
    duration: 45,
    zone: 2,
    description: '10min warm-up. 25min @ Zone 3 (tempo). 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-05'] = {
    type: 'strength',
    name: 'Tri-Specific Core',
    duration: 45,
    description: 'Core stability for racing.',
    strength: STRENGTH_WORKOUTS.triCore,
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-06'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 14 (Mar 7-13)
  plan['2026-03-07'] = {
    type: 'run',
    name: 'Long Run - Half Marathon Prep',
    duration: 70,
    zone: 2,
    distance: 6.5,
    description: 'Building toward half marathon distance. Include 20min @ race effort.',
    status: 'pending',
  };
  plan['2026-03-08'] = {
    type: 'brick',
    name: 'Brick - Race Simulation',
    duration: 100,
    description: '70min bike with 20min @ Zone 3, then 25min run starting easy, building to Zone 3.',
    status: 'pending',
  };
  plan['2026-03-09'] = {
    type: 'swim',
    name: 'Swim - Endurance',
    duration: 50,
    zone: 2,
    distance: 1.5,
    description: '300m warm-up. 1500m continuous @ Zone 2. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-03-10'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Very easy recovery.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-11'] = {
    type: 'bike',
    name: 'Bike - Threshold Intervals',
    duration: 60,
    zone: 2,
    description: '15min warm-up. 3x10min @ Zone 4 with 5min recovery. 10min cool-down.',
    status: 'pending',
  };
  plan['2026-03-12'] = {
    type: 'strength',
    name: 'Lower Body Power',
    duration: 45,
    description: 'Building explosive power.',
    strength: STRENGTH_WORKOUTS.lowerBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-13'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 15 (Mar 14-20)
  plan['2026-03-14'] = {
    type: 'swim',
    name: 'Swim - Race Pace',
    duration: 50,
    zone: 2,
    distance: 1.5,
    description: '300m warm-up. 4x300m @ race pace with 30sec rest. 300m cool-down.',
    status: 'pending',
  };
  plan['2026-03-15'] = {
    type: 'bike',
    name: 'Long Bike - Race Simulation',
    duration: 110,
    zone: 2,
    distance: 32,
    description: 'Long ride with race pacing. 30min easy, 50min @ race effort (Zone 3), 30min easy.',
    status: 'pending',
  };
  plan['2026-03-16'] = {
    type: 'run',
    name: 'Easy Run - Recovery',
    duration: 35,
    zone: 2,
    description: 'Easy recovery run.',
    status: 'pending',
  };
  plan['2026-03-17'] = {
    type: 'swim',
    name: 'Swim - Drills + Speed',
    duration: 45,
    zone: 2,
    distance: 1.2,
    description: "200m warm-up. 4x50m drill. 8x75m fast with 20sec rest. 400m steady. 100m cool-down. Happy St. Patrick's Day!",
    drills: [SWIM_DRILLS.tarzan, SWIM_DRILLS.buildSwim],
    status: 'pending',
  };
  plan['2026-03-18'] = {
    type: 'run',
    name: 'Run - Hills',
    duration: 45,
    zone: 2,
    description: '15min warm-up. 6x2min uphill @ Zone 4 with jog down. 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-19'] = {
    type: 'strength',
    name: 'Full Body Strength',
    duration: 45,
    description: 'Maintaining strength through build phase.',
    strength: STRENGTH_WORKOUTS.fullBody,
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-20'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 16 - End of Build / Milestone (Mar 21-27)
  plan['2026-03-21'] = {
    type: 'run',
    name: 'Long Run - Build Finale',
    duration: 75,
    zone: 2,
    distance: 7.5,
    description: 'Longest run of build phase. Include 25min @ race pace.',
    status: 'pending',
  };
  plan['2026-03-22'] = {
    type: 'brick',
    name: 'Brick - Full Test',
    duration: 115,
    description: '80min bike @ race effort, then 30min run. Full race simulation!',
    status: 'pending',
  };
  plan['2026-03-23'] = {
    type: 'swim',
    name: 'Swim - Over Distance',
    duration: 55,
    zone: 2,
    distance: 1.6,
    description: '300m warm-up. 1600m continuous @ Zone 2-3. 200m cool-down. Over race distance!',
    status: 'pending',
  };
  plan['2026-03-24'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Recovery run.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-25'] = {
    type: 'bike',
    name: 'Easy Bike',
    duration: 40,
    zone: 1,
    description: 'Easy spin. Recovery before peak phase.',
    status: 'pending',
  };
  plan['2026-03-26'] = {
    type: 'strength',
    name: 'Light Strength',
    duration: 30,
    description: 'Light maintenance work. Reduce volume before peak phase.',
    strength: STRENGTH_WORKOUTS.light,
    mobility: true,
    status: 'pending',
  };
  plan['2026-03-27'] = {
    type: 'rest',
    name: 'Rest Day - End of Build',
    description: 'Build phase complete! Ready for peak training.',
    milestone: true,
    milestoneText: '📊 WEEK 16 MILESTONE: Build phase done! Feeling race-ready?',
    status: 'pending',
  };

  // PEAK PHASE - Weeks 17-24
  // Week 17 (Mar 28 - Apr 3)
  plan['2026-03-28'] = {
    type: 'swim',
    name: 'Swim - Race Prep',
    duration: 55,
    zone: 2,
    distance: 1.6,
    description: '300m warm-up. 2x600m @ race pace with 1min rest. 300m cool-down.',
    status: 'pending',
  };
  plan['2026-03-29'] = {
    type: 'bike',
    name: 'Long Bike - Peak Volume',
    duration: 120,
    zone: 2,
    distance: 35,
    description: '2-hour ride. First hour Zone 2, second hour include 30min @ race effort.',
    status: 'pending',
  };
  plan['2026-03-30'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 35,
    zone: 2,
    description: 'Recovery run.',
    status: 'pending',
  };
  plan['2026-03-31'] = {
    type: 'swim',
    name: 'Swim - Speed Intervals',
    duration: 45,
    zone: 2,
    distance: 1.3,
    description: '300m warm-up. 12x50m fast with 15sec rest. 600m steady. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-04-01'] = {
    type: 'run',
    name: 'Run - Race Pace',
    duration: 50,
    zone: 2,
    description: '15min warm-up. 30min @ race pace (Zone 3-4). 5min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-02'] = {
    type: 'strength',
    name: 'Maintenance Strength',
    duration: 35,
    description: "Light strength work. Maintain, don't build.",
    strength: STRENGTH_WORKOUTS.light,
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-03'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 18 (Apr 4-10)
  plan['2026-04-04'] = {
    type: 'run',
    name: 'Long Run - Peak Distance',
    duration: 85,
    zone: 2,
    distance: 9,
    description: 'Longest run of the plan! Include 30min @ race pace. Walk breaks OK.',
    status: 'pending',
  };
  plan['2026-04-05'] = {
    type: 'brick',
    name: 'Brick - Full Distance Simulation',
    duration: 130,
    description: '90min bike @ race effort, then 35min run. Dress rehearsal!',
    status: 'pending',
  };
  plan['2026-04-06'] = {
    type: 'swim',
    name: 'Swim - Endurance',
    duration: 55,
    zone: 2,
    distance: 1.7,
    description: '300m warm-up. 1700m continuous @ race effort. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-04-07'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Very easy recovery.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-08'] = {
    type: 'bike',
    name: 'Bike - Threshold',
    duration: 70,
    zone: 2,
    description: '20min warm-up. 35min @ Zone 3-4. 15min cool-down.',
    status: 'pending',
  };
  plan['2026-04-09'] = {
    type: 'swim',
    name: 'Swim - Technique Refresh',
    duration: 40,
    zone: 2,
    distance: 1.0,
    description: 'Drill-focused session. Keep technique sharp.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.tarzan],
    status: 'pending',
  };
  plan['2026-04-10'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 19 (Apr 11-17)
  plan['2026-04-11'] = {
    type: 'bike',
    name: 'Long Bike - Race Simulation',
    duration: 130,
    zone: 2,
    distance: 40,
    description: 'Big bike day! Practice race nutrition. 40min easy, 60min @ race effort, 30min easy.',
    status: 'pending',
  };
  plan['2026-04-12'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 35,
    zone: 2,
    description: 'Recovery run after big bike.',
    status: 'pending',
  };
  plan['2026-04-13'] = {
    type: 'swim',
    name: 'Swim - Race Pace Intervals',
    duration: 50,
    zone: 2,
    distance: 1.5,
    description: '300m warm-up. 5x200m @ race pace with 30sec rest. 400m cool-down.',
    status: 'pending',
  };
  plan['2026-04-14'] = {
    type: 'bike',
    name: 'Easy Bike',
    duration: 40,
    zone: 1,
    description: 'Easy recovery spin.',
    status: 'pending',
  };
  plan['2026-04-15'] = {
    type: 'run',
    name: 'Run - Tempo',
    duration: 50,
    zone: 2,
    description: '10min warm-up. 30min @ tempo (Zone 3). 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-16'] = {
    type: 'strength',
    name: 'Light Strength',
    duration: 30,
    description: 'Maintenance work only.',
    strength: STRENGTH_WORKOUTS.light,
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-17'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 20 - Milestone (Apr 18-24)
  plan['2026-04-18'] = {
    type: 'swim',
    name: 'Swim - Over Distance',
    duration: 60,
    zone: 2,
    distance: 1.8,
    description: '300m warm-up. 1800m continuous @ race effort. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-04-19'] = {
    type: 'brick',
    name: 'Brick - Peak Simulation',
    duration: 140,
    description: '100min bike, then 35min run. Practice race day transitions and nutrition.',
    status: 'pending',
  };
  plan['2026-04-20'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Recovery run.',
    status: 'pending',
  };
  plan['2026-04-21'] = {
    type: 'swim',
    name: 'Swim - Speed',
    duration: 45,
    zone: 2,
    distance: 1.2,
    description: '200m warm-up. 16x50m fast with 15sec rest. 400m cool-down.',
    status: 'pending',
  };
  plan['2026-04-22'] = {
    type: 'bike',
    name: 'Bike - Intervals',
    duration: 60,
    zone: 2,
    description: '15min warm-up. 4x8min @ Zone 4 with 4min recovery. 15min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-23'] = {
    type: 'run',
    name: 'Run - Race Pace',
    duration: 45,
    zone: 2,
    description: '10min warm-up. 25min @ race pace. 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-24'] = {
    type: 'rest',
    name: 'Rest Day - Week 20 Milestone',
    description: 'Peak training in full swing!',
    milestone: true,
    milestoneText: '📊 WEEK 20 MILESTONE: Confidence building? Any concerns?',
    status: 'pending',
  };

  // Week 21 (Apr 25 - May 1)
  plan['2026-04-25'] = {
    type: 'run',
    name: 'Long Run',
    duration: 90,
    zone: 2,
    distance: 10,
    description: 'Big run! Include 35min @ race pace. Practice race nutrition.',
    status: 'pending',
  };
  plan['2026-04-26'] = {
    type: 'bike',
    name: 'Long Bike - Peak',
    duration: 140,
    zone: 2,
    distance: 45,
    description: 'Longest ride of the plan! 45min easy, 70min race effort, 25min easy.',
    status: 'pending',
  };
  plan['2026-04-27'] = {
    type: 'swim',
    name: 'Swim - Endurance',
    duration: 55,
    zone: 2,
    distance: 1.6,
    description: '200m warm-up. 1600m @ race pace. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-04-28'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Recovery run.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-04-29'] = {
    type: 'bike',
    name: 'Easy Bike',
    duration: 40,
    zone: 1,
    description: 'Easy recovery spin.',
    status: 'pending',
  };
  plan['2026-04-30'] = {
    type: 'swim',
    name: 'Swim - Technique',
    duration: 40,
    zone: 2,
    distance: 1.0,
    description: 'Drill and technique focus. Stay sharp.',
    drills: [SWIM_DRILLS.catchUp, SWIM_DRILLS.fingertipDrag],
    status: 'pending',
  };
  plan['2026-05-01'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 22 (May 2-8)
  plan['2026-05-02'] = {
    type: 'brick',
    name: 'Brick - Race Dress Rehearsal',
    duration: 150,
    description: 'Full race simulation: 100min bike @ race effort, then 45min run @ race pace.',
    status: 'pending',
  };
  plan['2026-05-03'] = {
    type: 'swim',
    name: 'Swim - Race Distance',
    duration: 50,
    zone: 2,
    distance: 1.5,
    description: '200m warm-up. 1200m @ race pace (race distance!). 200m cool-down.',
    status: 'pending',
  };
  plan['2026-05-04'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Recovery run.',
    status: 'pending',
  };
  plan['2026-05-05'] = {
    type: 'bike',
    name: 'Bike - Tempo',
    duration: 60,
    zone: 2,
    description: '15min warm-up. 35min @ race effort. 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-06'] = {
    type: 'swim',
    name: 'Swim - Speed',
    duration: 40,
    zone: 2,
    distance: 1.1,
    description: '200m warm-up. 10x75m fast with 15sec rest. 350m cool-down.',
    status: 'pending',
  };
  plan['2026-05-07'] = {
    type: 'run',
    name: 'Run - Tempo',
    duration: 45,
    zone: 2,
    description: '10min warm-up. 25min @ race pace. 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-08'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 23 (May 9-15)
  plan['2026-05-09'] = {
    type: 'run',
    name: 'Long Run - Final Big One',
    duration: 95,
    zone: 2,
    distance: 11,
    description: "Final long run. Include 40min @ race pace. You've got this!",
    status: 'pending',
  };
  plan['2026-05-10'] = {
    type: 'bike',
    name: 'Long Bike - Final Peak',
    duration: 135,
    zone: 2,
    distance: 42,
    description: "Final peak ride. Happy Mother's Day! 40min easy, 70min @ race effort, 25min easy.",
    status: 'pending',
  };
  plan['2026-05-11'] = {
    type: 'swim',
    name: 'Swim - Confidence Builder',
    duration: 55,
    zone: 2,
    distance: 1.7,
    description: '200m warm-up. 1500m @ race pace. 200m cool-down. You can swim this distance!',
    status: 'pending',
  };
  plan['2026-05-12'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 30,
    zone: 1,
    description: 'Recovery run.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-13'] = {
    type: 'bike',
    name: 'Bike - Final Hard Session',
    duration: 55,
    zone: 2,
    description: '15min warm-up. 30min @ race effort. 10min cool-down. Last hard bike!',
    status: 'pending',
  };
  plan['2026-05-14'] = {
    type: 'swim',
    name: 'Swim - Easy',
    duration: 35,
    zone: 2,
    distance: 0.9,
    description: 'Easy swim. Focus on feeling smooth in the water.',
    status: 'pending',
  };
  plan['2026-05-15'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover.',
    status: 'pending',
  };

  // Week 24 - End of Peak / Milestone (May 16-22)
  plan['2026-05-16'] = {
    type: 'brick',
    name: 'Brick - Final Race Simulation',
    duration: 120,
    description: 'Final hard brick: 80min bike @ race effort, then 35min run @ race pace.',
    status: 'pending',
  };
  plan['2026-05-17'] = {
    type: 'swim',
    name: 'Swim - Race Pace',
    duration: 45,
    zone: 2,
    distance: 1.3,
    description: '200m warm-up. 1000m @ race pace. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-05-18'] = {
    type: 'run',
    name: 'Easy Run',
    duration: 25,
    zone: 1,
    description: 'Very easy recovery.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-19'] = {
    type: 'bike',
    name: 'Bike - Moderate',
    duration: 50,
    zone: 2,
    description: 'Moderate effort. Starting to taper down.',
    status: 'pending',
  };
  plan['2026-05-20'] = {
    type: 'swim',
    name: 'Swim - Easy',
    duration: 35,
    zone: 2,
    distance: 0.8,
    description: 'Easy swim. Stay loose.',
    status: 'pending',
  };
  plan['2026-05-21'] = {
    type: 'run',
    name: 'Run - Short Tempo',
    duration: 35,
    zone: 2,
    description: '10min warm-up. 15min @ race pace. 10min cool-down.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-22'] = {
    type: 'rest',
    name: 'Rest Day - End of Peak',
    description: 'Peak phase complete! Time to taper.',
    milestone: true,
    milestoneText: '📊 WEEK 24 MILESTONE: Peak training done! Ready to taper and race!',
    status: 'pending',
  };

  // TAPER PHASE - Weeks 25-27
  // Week 25 (May 23-29)
  plan['2026-05-23'] = {
    type: 'swim',
    name: 'Swim - Taper',
    duration: 40,
    zone: 2,
    distance: 1.0,
    description: '200m warm-up. 4x150m @ race pace with 30sec rest. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-05-24'] = {
    type: 'bike',
    name: 'Bike - Taper',
    duration: 60,
    zone: 2,
    distance: 18,
    description: 'Easy ride with 15min @ race effort. Stay fresh.',
    status: 'pending',
  };
  plan['2026-05-25'] = {
    type: 'run',
    name: 'Run - Taper',
    duration: 35,
    zone: 2,
    description: '10min warm-up. 15min @ race pace. 10min cool-down. Memorial Day!',
    status: 'pending',
  };
  plan['2026-05-26'] = {
    type: 'swim',
    name: 'Swim - Easy',
    duration: 30,
    zone: 2,
    distance: 0.7,
    description: 'Easy swim. Focus on technique.',
    status: 'pending',
  };
  plan['2026-05-27'] = {
    type: 'bike',
    name: 'Bike - Easy',
    duration: 40,
    zone: 1,
    description: 'Easy spin. Stay loose.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-28'] = {
    type: 'run',
    name: 'Run - Easy + Strides',
    duration: 25,
    zone: 2,
    description: '20min easy + 4x20sec strides.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-05-29'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Rest and recover. Trust your training!',
    status: 'pending',
  };

  // Week 26 (May 30 - Jun 5)
  plan['2026-05-30'] = {
    type: 'brick',
    name: 'Brick - Openers',
    duration: 50,
    description: '30min easy bike, then 15min run with a few strides. Keep legs fresh.',
    status: 'pending',
  };
  plan['2026-05-31'] = {
    type: 'swim',
    name: 'Swim - Race Prep',
    duration: 35,
    zone: 2,
    distance: 0.8,
    description: '200m warm-up. 4x100m @ race pace with 20sec rest. 200m cool-down.',
    status: 'pending',
  };
  plan['2026-06-01'] = {
    type: 'bike',
    name: 'Bike - Easy',
    duration: 35,
    zone: 1,
    description: 'Very easy spin. Stay loose.',
    status: 'pending',
  };
  plan['2026-06-02'] = {
    type: 'run',
    name: 'Run - Easy',
    duration: 20,
    zone: 2,
    description: 'Short easy run. Just stay loose.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-06-03'] = {
    type: 'swim',
    name: 'Swim - Easy',
    duration: 25,
    zone: 1,
    distance: 0.5,
    description: 'Easy swim. Feel the water. Stay relaxed.',
    status: 'pending',
  };
  plan['2026-06-04'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Complete rest. Save energy for race week!',
    status: 'pending',
  };
  plan['2026-06-05'] = {
    type: 'bike',
    name: 'Bike - Openers',
    duration: 25,
    zone: 1,
    description: 'Very short spin. Include 3x30sec @ race effort. Wake up the legs.',
    mobility: true,
    status: 'pending',
  };

  // Week 27 - RACE WEEK! (Jun 6-14)
  plan['2026-06-06'] = {
    type: 'swim',
    name: 'Swim - Final Prep',
    duration: 20,
    zone: 1,
    distance: 0.4,
    description: 'Easy swim. 200m warm-up, 4x50m @ race pace, 100m cool-down.',
    status: 'pending',
  };
  plan['2026-06-07'] = {
    type: 'run',
    name: 'Run - Shakeout',
    duration: 15,
    zone: 1,
    description: 'Very easy 15min jog. Just stay loose.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-06-08'] = {
    type: 'bike',
    name: 'Bike - Openers',
    duration: 20,
    zone: 1,
    description: 'Easy spin. 3x30sec @ race effort. Last hard effort before race!',
    status: 'pending',
  };
  plan['2026-06-09'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Complete rest. Start hydrating and carb-loading.',
    status: 'pending',
  };
  plan['2026-06-10'] = {
    type: 'swim',
    name: 'Swim - Final Swim',
    duration: 15,
    zone: 1,
    distance: 0.3,
    description: 'Very easy swim. Just get in the water and feel good.',
    status: 'pending',
  };
  plan['2026-06-11'] = {
    type: 'run',
    name: 'Run - Final Shakeout',
    duration: 10,
    zone: 1,
    description: '10min easy jog. Visualize the race.',
    mobility: true,
    status: 'pending',
  };
  plan['2026-06-12'] = {
    type: 'rest',
    name: 'Rest Day',
    description: 'Complete rest. Final prep day.',
    status: 'pending',
  };
  plan['2026-06-13'] = {
    type: 'rest',
    name: 'Rest Day - Day Before Race',
    description: "Complete rest. Prep your gear, eat well, sleep early. You're ready!",
    status: 'pending',
  };
  plan['2026-06-14'] = {
    type: 'race',
    name: '🏆 RACE DAY! Half-Ironman 70.3',
    description: "1.2mi swim, 56mi bike, 13.1mi run. You've trained for this. TRUST YOUR TRAINING. GO GET IT!",
    status: 'pending',
  };

  return plan;
}

export const TRAINING_PLAN = generateTrainingPlan();

// Helper to get phase for a date
export function getPhaseForDate(dateStr) {
  const date = new Date(dateStr);
  const startDate = new Date(TRAINING_START);
  const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7) + 1;

  if (weekNumber >= 1 && weekNumber <= 8) return TRAINING_PHASES.BASE;
  if (weekNumber >= 9 && weekNumber <= 16) return TRAINING_PHASES.BUILD;
  if (weekNumber >= 17 && weekNumber <= 24) return TRAINING_PHASES.PEAK;
  if (weekNumber >= 25 && weekNumber <= 27) return TRAINING_PHASES.TAPER;
  return null;
}

// Helper to get week number for a date
export function getWeekNumber(dateStr) {
  const date = new Date(dateStr);
  const startDate = new Date(TRAINING_START);
  const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  return Math.floor(daysDiff / 7) + 1;
}
