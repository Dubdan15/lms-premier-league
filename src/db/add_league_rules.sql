-- Add custom league rule columns to leagues table

-- Add game mode column (classic or pro)
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS game_mode text DEFAULT 'classic' CHECK (game_mode IN ('classic', 'pro'));

-- Add custom rule toggles
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS has_graveyard boolean DEFAULT false;
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS has_shadow_picks boolean DEFAULT false;
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS has_boosts boolean DEFAULT false;

-- Add created_at if not exists (for consistency)
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Update existing leagues to have default values
UPDATE leagues SET game_mode = 'classic' WHERE game_mode IS NULL;
UPDATE leagues SET has_graveyard = false WHERE has_graveyard IS NULL;
UPDATE leagues SET has_shadow_picks = false WHERE has_shadow_picks IS NULL;
UPDATE leagues SET has_boosts = false WHERE has_boosts IS NULL;

-- Verify columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'leagues' 
AND column_name IN ('game_mode', 'has_graveyard', 'has_shadow_picks', 'has_boosts');
