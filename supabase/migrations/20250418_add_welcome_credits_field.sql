
-- Add welcome_credits_seen field to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS welcome_credits_seen BOOLEAN DEFAULT FALSE;

-- Add fee_acknowledged field to the campaigns table
ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS fee_acknowledged BOOLEAN DEFAULT FALSE;
