
-- Add the is_active field to app_prompts table
ALTER TABLE app_prompts 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add the metadata JSONB field to app_prompts table
ALTER TABLE app_prompts
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update existing prompts to be active
UPDATE app_prompts
SET is_active = TRUE
WHERE is_active IS NULL;

-- Insert the enhanced image generator prompt if it doesn't exist
INSERT INTO app_prompts (key, prompt, description, version, read_only, is_active)
SELECT 
  'openai_image_generator', 
  'Generate a cinematic, high-end advertising image for an {{platform}} campaign targeting {{targetAudience}} in {{industry}}. The visual must evoke {{mindTrigger}} and drive conversions, styled like a top-tier NYC creative agency''s work. Use photorealistic rendering with soft lighting, shallow depth of field, and a clean, persuasive composition. Reflect {{companyName}}''s value through a central subject. Incorporate modern branding with clean, bold visuals. Format: 1080x1080px for Instagram, 1200x627px for LinkedIn. Ensure mobile-friendly visuals with no text overlay.',
  'Enhanced prompt template for generating ad images across platforms',
  1,
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM app_prompts WHERE key = 'openai_image_generator'
);
