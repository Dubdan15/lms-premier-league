-- Database updates for Season-Long Auto-Pilot

-- 1. Update fixtures table with match_id for API syncing
ALTER TABLE fixtures ADD COLUMN IF NOT EXISTS match_id integer UNIQUE;

-- 2. Create system_config table for global application state
CREATE TABLE IF NOT EXISTS system_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Set initial current_gameweek
INSERT INTO system_config (key, value) 
VALUES ('app_state', '{"current_gameweek": 21}') 
ON CONFLICT (key) DO UPDATE 
SET value = excluded.value, updated_at = now();

-- Enable RLS for system_config
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read config
DROP POLICY IF EXISTS "Anyone can view system_config" ON system_config;
CREATE POLICY "Anyone can view system_config" ON system_config FOR SELECT USING (true);

-- Only authenticated users can update (though normally handled by edge functions / service role)
DROP POLICY IF EXISTS "Authenticated users can update system_config" ON system_config;
CREATE POLICY "Authenticated users can update system_config" 
ON system_config FOR UPDATE 
USING (auth.role() = 'authenticated');
