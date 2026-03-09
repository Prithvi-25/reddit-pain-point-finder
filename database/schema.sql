-- =====================================================
-- Reddit Pain Point Finder — Database Schema
-- Run this in Supabase SQL Editor to create all tables
-- =====================================================

-- Pain Points Table
CREATE TABLE pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  trending_score DECIMAL(10,2),
  mention_count INTEGER DEFAULT 1,
  avg_upvotes INTEGER,
  avg_comments INTEGER,
  subreddit TEXT,
  willingness_to_pay_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW(),
  source_links TEXT[]
);

-- Indexes for performance
CREATE INDEX idx_trending ON pain_points(trending_score DESC);
CREATE INDEX idx_category ON pain_points(category);
CREATE INDEX idx_created ON pain_points(created_at DESC);

-- Unique constraint for detecting duplicates during upsert
ALTER TABLE pain_points
ADD CONSTRAINT unique_pain_point UNIQUE (title, subreddit);

-- User Subreddits Table
CREATE TABLE user_subreddits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'default',
  subreddit_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  added_at TIMESTAMP DEFAULT NOW()
);

-- Insert default subreddits
INSERT INTO user_subreddits (subreddit_name) VALUES
  ('SaaS'),
  ('startups'),
  ('Entrepreneur'),
  ('aiautomation'),
  ('sidehustle'),
  ('realestate'),
  ('n8n_ai_agents'),
  ('homeowners'),
  ('businessowners');
