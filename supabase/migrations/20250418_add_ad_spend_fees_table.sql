
-- Create table to track ad spend fees
CREATE TABLE IF NOT EXISTS public.ad_spend_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) NOT NULL,
  spend_amount NUMERIC NOT NULL,
  fee_amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  stripe_usage_record_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for ad_spend_fees
ALTER TABLE public.ad_spend_fees ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own ad spend fees
CREATE POLICY "Users can view their own ad spend fees" 
    ON public.ad_spend_fees
    FOR SELECT
    USING (auth.uid() = user_id);

-- Add profile column for Stripe customer ID if not exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
