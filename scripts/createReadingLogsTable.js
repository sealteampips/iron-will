/**
 * One-time script to create the reading_logs table in Supabase
 *
 * Run with: node scripts/createReadingLogsTable.js
 *
 * Note: You'll need to run this SQL in the Supabase dashboard:
 *
 * CREATE TABLE reading_logs (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   date DATE NOT NULL UNIQUE,
 *   book_id UUID REFERENCES books(id) ON DELETE SET NULL,
 *   page_number INTEGER,
 *   notes TEXT,
 *   did_read BOOLEAN DEFAULT true,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE INDEX idx_reading_logs_date ON reading_logs(date);
 * CREATE INDEX idx_reading_logs_book_id ON reading_logs(book_id);
 */

console.log(`
=====================================================
READING LOGS TABLE SETUP
=====================================================

Run this SQL in your Supabase Dashboard (SQL Editor):

CREATE TABLE IF NOT EXISTS reading_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  page_number INTEGER,
  notes TEXT,
  did_read BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_logs_date ON reading_logs(date);
CREATE INDEX IF NOT EXISTS idx_reading_logs_book_id ON reading_logs(book_id);

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON reading_logs FOR ALL USING (true);

=====================================================
`);
