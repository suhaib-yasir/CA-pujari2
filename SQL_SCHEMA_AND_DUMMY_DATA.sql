-- ============================================
-- CA Pujari Trading Platform - SQL Schema & Dummy Data
-- ============================================
-- Run this in Supabase SQL Editor to set up tables and seed data

-- ============================================
-- 1. COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  level TEXT DEFAULT 'Beginner',
  modules INTEGER DEFAULT 0,
  price TEXT,
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS if needed (optional for public read access during dev)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "Allow public read" ON courses
  FOR SELECT USING (true);

-- Create policy for authenticated inserts/updates/deletes  
CREATE POLICY "Allow authenticated inserts" ON courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON courses
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes" ON courses
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 2. WEBINARS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS webinars (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP,
  duration_minutes INTEGER DEFAULT 60,
  platform TEXT,
  price TEXT,
  seats INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS if needed (optional for public read access during dev)
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "Allow public read" ON webinars
  FOR SELECT USING (true);

-- Create policy for authenticated inserts/updates/deletes
CREATE POLICY "Allow authenticated inserts" ON webinars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON webinars
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes" ON webinars
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- 3. DUMMY DATA - COURSES
-- ============================================
INSERT INTO courses (title, description, duration, level, modules, price, students_count) VALUES
('Trading Fundamentals', 'Learn the foundations of stock market trading with clarity and confidence.', '4 weeks', 'Beginner', 12, '₹4,999', 2500),
('Technical Analysis Mastery', 'Read charts like a professional using proven technical frameworks.', '6 weeks', 'Beginner', 18, '₹7,999', 1800),
('Risk Management & Position Sizing', 'Protect your capital and trade with discipline, not emotion.', '3 weeks', 'Beginner', 8, '₹3,999', 1200),
('Market Psychology', 'Understand fear, greed, and mindset — the real edge in trading.', '4 weeks', 'Beginner', 10, '₹5,999', 950),
('Day Trading Strategies', 'Intraday frameworks designed for real-time market conditions.', '5 weeks', 'Beginner', 15, '₹6,999', 1400),
('Option Trading Basics', 'Understand options without confusion — calls, puts, and basics.', '6 weeks', 'Beginner', 16, '₹8,999', 850);

-- ============================================
-- 4. DUMMY DATA - WEBINARS
-- ============================================
INSERT INTO webinars (title, description, starts_at, duration_minutes, platform, price, seats) VALUES
('Stock Market Basics for Beginners', 'Introduction to how stock markets work and why they matter for wealth building.', '2026-04-15 19:00:00', 90, 'Zoom', 'Free', 500),
('Candlestick Patterns That Actually Work', 'Learn the most reliable candlestick patterns used by professional traders.', '2026-04-22 19:00:00', 120, 'Google Meet', '₹299', 300),
('Risk Management Strategies', 'How to protect your capital and size positions correctly.', '2026-05-05 18:30:00', 100, 'Zoom', '₹499', 400),
('Live Trading Session: Real Market Analysis', 'Watch real trades executed in real-time with live commentary.', '2026-05-12 09:00:00', 150, 'Zoom', '₹799', 200),
('Introduction to Options Trading', 'Demystify options — understand calls, puts, and basic strategies.', '2026-03-20 19:00:00', 90, 'Zoom', 'Free', 500),
('Market Psychology 101', 'The psychology behind trading decisions and how to manage emotions.', '2026-03-25 20:00:00', 75, 'Google Meet', '₹199', 350);

-- ============================================
-- 5. VERIFY DATA (Run after insert to check)
-- ============================================
-- SELECT * FROM courses;
-- SELECT * FROM webinars;
-- SELECT COUNT(*) FROM courses;
-- SELECT COUNT(*) FROM webinars;
