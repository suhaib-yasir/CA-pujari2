-- ============================================
-- Community Posts Table for Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS community_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  author_name TEXT NOT NULL,
  author_email TEXT,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Allow public read" ON community_posts
  FOR SELECT USING (true);

-- Allow anyone to insert (anonymous posting)
CREATE POLICY "Allow anyone to create posts" ON community_posts
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update their own posts (by email if provided)
CREATE POLICY "Allow update own posts" ON community_posts
  FOR UPDATE USING (true);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at 
  ON community_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_category 
  ON community_posts(category);

-- Insert some sample posts
INSERT INTO community_posts (title, content, category, author_name, author_email) VALUES
('How to Read Candlestick Charts Like a Pro', 'Master the art of reading candlestick patterns and identify trading opportunities with confidence. Here are the key patterns you need to know...', 'Technical Analysis', 'Shobha Pujari', NULL),
('Overcoming Trading Fear: A Beginner''s Guide', 'Fear is natural in trading. Learn practical strategies to manage emotions and make rational decisions. The key is to start small and build confidence over time.', 'Market Psychology', 'Shobha Pujari', NULL),
('Why Most Beginners Fail in Trading', 'Common mistakes that prevent beginners from succeeding and how to avoid them in your trading journey. Understanding these will help you avoid costly errors.', 'Trading Basics', 'Shobha Pujari', NULL);
