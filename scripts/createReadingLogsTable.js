/**
 * One-time script to create/update the reading_logs table in Supabase
 *
 * Run with: node scripts/createReadingLogsTable.js
 *
 * Note: You'll need to run this SQL in the Supabase dashboard
 */

console.log(`
=====================================================
READING LOGS TABLE SETUP
=====================================================

Run this SQL in your Supabase Dashboard (SQL Editor):

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS reading_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  page_number INTEGER,
  start_page INTEGER,
  end_page INTEGER,
  notes TEXT,
  did_read BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if table already exists (migration)
ALTER TABLE reading_logs ADD COLUMN IF NOT EXISTS start_page INTEGER;
ALTER TABLE reading_logs ADD COLUMN IF NOT EXISTS end_page INTEGER;

CREATE INDEX IF NOT EXISTS idx_reading_logs_date ON reading_logs(date);
CREATE INDEX IF NOT EXISTS idx_reading_logs_book_id ON reading_logs(book_id);

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON reading_logs FOR ALL USING (true);

=====================================================
`);
