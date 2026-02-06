-- Simplified fixtures table (works with existing picks table)
CREATE TABLE IF NOT EXISTS fixtures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team text NOT NULL,
  away_team text NOT NULL,
  kickoff_time timestamp with time zone NOT NULL,
  gameweek integer NOT NULL,
  status text DEFAULT 'SCHEDULED', -- SCHEDULED, LIVE, FINISHED
  home_score integer DEFAULT 0,
  away_score integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for quick gameweek lookups
CREATE INDEX IF NOT EXISTS idx_fixtures_gameweek ON fixtures(gameweek);
CREATE INDEX IF NOT EXISTS idx_fixtures_kickoff ON fixtures(kickoff_time);

-- Enable RLS
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read fixtures
DROP POLICY IF EXISTS "Anyone can view fixtures" ON fixtures;
CREATE POLICY "Anyone can view fixtures" ON fixtures FOR SELECT USING (true);

-- Only authenticated users can modify
DROP POLICY IF EXISTS "Authenticated users can modify fixtures" ON fixtures;
CREATE POLICY "Authenticated users can modify fixtures" 
ON fixtures FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert mock Gameweek 4 fixtures (current gameweek)
INSERT INTO fixtures (home_team, away_team, kickoff_time, gameweek, status) VALUES
  ('Liverpool', 'Manchester United', NOW() + INTERVAL '2 days', 4, 'SCHEDULED'),
  ('Manchester City', 'Arsenal', NOW() + INTERVAL '2 days 2 hours', 4, 'SCHEDULED'),
  ('Chelsea', 'Tottenham', NOW() + INTERVAL '2 days 4 hours', 4, 'SCHEDULED'),
  ('Newcastle', 'Brighton', NOW() + INTERVAL '3 days', 4, 'SCHEDULED'),
  ('Aston Villa', 'West Ham', NOW() + INTERVAL '3 days 2 hours', 4, 'SCHEDULED'),
  ('Brentford', 'Fulham', NOW() + INTERVAL '3 days 2 hours', 4, 'SCHEDULED'),
  ('Crystal Palace', 'Everton', NOW() + INTERVAL '3 days 4 hours', 4, 'SCHEDULED'),
  ('Nottingham Forest', 'Bournemouth', NOW() + INTERVAL '3 days 4 hours', 4, 'SCHEDULED'),
  ('Wolves', 'Southampton', NOW() + INTERVAL '4 days', 4, 'SCHEDULED'),
  ('Leicester', 'Ipswich', NOW() + INTERVAL '4 days 2 hours', 4, 'SCHEDULED')
ON CONFLICT DO NOTHING;

-- Insert mock Gameweek 5 fixtures (next gameweek)
INSERT INTO fixtures (home_team, away_team, kickoff_time, gameweek, status) VALUES
  ('Arsenal', 'Liverpool', NOW() + INTERVAL '9 days', 5, 'SCHEDULED'),
  ('Manchester United', 'Manchester City', NOW() + INTERVAL '9 days 2 hours', 5, 'SCHEDULED'),
  ('Tottenham', 'Newcastle', NOW() + INTERVAL '9 days 4 hours', 5, 'SCHEDULED'),
  ('Brighton', 'Chelsea', NOW() + INTERVAL '10 days', 5, 'SCHEDULED'),
  ('West Ham', 'Brentford', NOW() + INTERVAL '10 days 2 hours', 5, 'SCHEDULED'),
  ('Fulham', 'Aston Villa', NOW() + INTERVAL '10 days 2 hours', 5, 'SCHEDULED'),
  ('Everton', 'Wolves', NOW() + INTERVAL '10 days 4 hours', 5, 'SCHEDULED'),
  ('Bournemouth', 'Crystal Palace', NOW() + INTERVAL '10 days 4 hours', 5, 'SCHEDULED'),
  ('Southampton', 'Nottingham Forest', NOW() + INTERVAL '11 days', 5, 'SCHEDULED'),
  ('Ipswich', 'Leicester', NOW() + INTERVAL '11 days 2 hours', 5, 'SCHEDULED')
ON CONFLICT DO NOTHING;
