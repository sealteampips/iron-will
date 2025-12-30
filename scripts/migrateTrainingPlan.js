/**
 * One-time migration script to export the training plan to Supabase
 *
 * This script:
 * 1. Reads the complete training plan from trainingPlan.js
 * 2. Transforms each workout to the Supabase schema
 * 3. Upserts workouts to Supabase, preserving existing completed/modified/missed workouts
 *
 * Run with: node scripts/migrateTrainingPlan.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import the training plan
import { TRAINING_PLAN, getPhaseForDate } from '../src/data/trainingPlan.js';

// Transform workout to Supabase schema
function transformWorkout(date, workout) {
  const phase = getPhaseForDate(date);

  return {
    date: date,
    workout_type: workout.type,
    planned_duration: workout.duration || null,
    planned_distance: workout.distance || null,
    actual_duration: null,
    actual_distance: null,
    heart_rate_avg: null,
    // Store the full description in the notes field
    notes: buildDescription(workout),
    status: workout.status === 'completed' ? 'completed' : 'pending',
    phase: phase?.name || null,
  };
}

// Build a description string from workout data
function buildDescription(workout) {
  let parts = [];

  // Add workout name
  if (workout.name) {
    parts.push(workout.name);
  }

  // Add zone info
  if (workout.zone) {
    parts.push(`[Zone ${workout.zone}]`);
  }

  // Add main description
  if (workout.description) {
    parts.push(workout.description);
  }

  let desc = parts.join('\n');

  // Add drills for swim workouts
  if (workout.drills && workout.drills.length > 0) {
    desc += '\n\nDrills: ' + workout.drills.join(' | ');
  }

  // Add strength details
  if (workout.strength) {
    desc += '\n\n--- GYM VERSION ---\n' + workout.strength.gymVersion.join('\n');
    desc += '\n\n--- HOME VERSION ---\n' + workout.strength.homeVersion.join('\n');
  }

  // Add milestone info
  if (workout.milestone) {
    desc += '\n\n' + workout.milestoneText;
  }

  return desc;
}

async function migrateTrainingPlan() {
  console.log('Starting training plan migration to Supabase...\n');

  const workouts = Object.entries(TRAINING_PLAN);
  console.log(`Found ${workouts.length} workouts in training plan\n`);

  // First, get existing workouts that we should NOT overwrite
  const { data: existingWorkouts, error: fetchError } = await supabase
    .from('workouts')
    .select('date, status')
    .in('status', ['completed', 'modified', 'missed']);

  if (fetchError) {
    console.error('Error fetching existing workouts:', fetchError);
    process.exit(1);
  }

  const protectedDates = new Set(existingWorkouts?.map(w => w.date) || []);
  console.log(`Found ${protectedDates.size} workouts with completed/modified/missed status (will preserve)\n`);

  // Prepare workouts for upsert (excluding protected ones)
  const workoutsToUpsert = [];
  const skippedWorkouts = [];

  for (const [date, workout] of workouts) {
    if (protectedDates.has(date)) {
      skippedWorkouts.push(date);
      continue;
    }

    workoutsToUpsert.push(transformWorkout(date, workout));
  }

  console.log(`Workouts to insert/update: ${workoutsToUpsert.length}`);
  console.log(`Workouts skipped (already completed/modified/missed): ${skippedWorkouts.length}\n`);

  if (skippedWorkouts.length > 0) {
    console.log('Skipped dates:', skippedWorkouts.slice(0, 10).join(', '),
      skippedWorkouts.length > 10 ? `... and ${skippedWorkouts.length - 10} more` : '');
    console.log('');
  }

  // Batch upsert in chunks to avoid hitting limits
  const BATCH_SIZE = 50;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < workoutsToUpsert.length; i += BATCH_SIZE) {
    const batch = workoutsToUpsert.slice(i, i + BATCH_SIZE);

    const { data, error } = await supabase
      .from('workouts')
      .upsert(batch, {
        onConflict: 'date',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error(`Error upserting batch ${i / BATCH_SIZE + 1}:`, error);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      process.stdout.write(`Progress: ${successCount}/${workoutsToUpsert.length} workouts migrated\r`);
    }
  }

  console.log('\n\n--- Migration Complete ---');
  console.log(`Successfully migrated: ${successCount} workouts`);
  console.log(`Preserved (not overwritten): ${skippedWorkouts.length} workouts`);
  console.log(`Errors: ${errorCount} workouts`);
  console.log(`Total in training plan: ${workouts.length} workouts`);
}

// Run the migration
migrateTrainingPlan()
  .then(() => {
    console.log('\nMigration finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
