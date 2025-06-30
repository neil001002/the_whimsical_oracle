/*
  # Enhanced User Data Synchronization

  1. Schema Updates
    - Add language preferences to profiles
    - Add subscription tracking
    - Add user settings and preferences
    - Add indexes for better performance
    
  2. Security
    - Update RLS policies for new fields
    - Ensure proper access control
    
  3. Functions
    - Add trigger functions for automatic updates
    - Add subscription status tracking
*/

-- Add language and enhanced preferences to profiles
DO $$
BEGIN
  -- Add language preference column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN language text DEFAULT 'en';
  END IF;

  -- Add subscription status tracking columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status jsonb DEFAULT '{
      "tier": "free",
      "isActive": false,
      "expirationDate": null,
      "willRenew": false,
      "lastUpdated": null
    }'::jsonb;
  END IF;

  -- Add user activity tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_active timestamptz DEFAULT now();
  END IF;

  -- Add user settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'settings'
  ) THEN
    ALTER TABLE profiles ADD COLUMN settings jsonb DEFAULT '{
      "notifications": {
        "email": true,
        "push": true,
        "dailyReminder": false,
        "reminderTime": "09:00"
      },
      "privacy": {
        "profileVisible": false,
        "shareReadings": false
      },
      "accessibility": {
        "highContrast": false,
        "largeText": false,
        "reduceMotion": false
      }
    }'::jsonb;
  END IF;
END $$;

-- Create subscription_events table for tracking subscription changes
CREATE TABLE IF NOT EXISTS subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'purchase', 'renewal', 'cancellation', 'expiration', 'upgrade', 'downgrade'
  from_tier text,
  to_tier text NOT NULL,
  provider text, -- 'revenuecat', 'stripe', 'manual'
  provider_transaction_id text,
  amount_cents integer,
  currency text DEFAULT 'USD',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_sessions table for tracking user activity
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_start timestamptz DEFAULT now(),
  session_end timestamptz,
  platform text, -- 'web', 'ios', 'android'
  app_version text,
  device_info jsonb DEFAULT '{}',
  activities jsonb DEFAULT '[]', -- Array of activities during session
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table for detailed preference tracking
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'voice', 'display', 'notifications', 'privacy'
  preference_key text NOT NULL,
  preference_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category, preference_key)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_language ON profiles(language);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at ON subscription_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_category ON user_preferences(category);

-- Enable RLS on new tables
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_events
CREATE POLICY "Users can view own subscription events"
  ON subscription_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription events"
  ON subscription_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update last_active timestamp
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_active = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_active when user creates an omen
CREATE TRIGGER update_last_active_on_omen
  AFTER INSERT ON omens
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_active();

-- Function to track subscription changes
CREATE OR REPLACE FUNCTION track_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if subscription_tier actually changed
  IF OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier THEN
    INSERT INTO subscription_events (
      user_id,
      event_type,
      from_tier,
      to_tier,
      provider,
      metadata
    ) VALUES (
      NEW.id,
      CASE 
        WHEN OLD.subscription_tier = 'free' AND NEW.subscription_tier != 'free' THEN 'purchase'
        WHEN OLD.subscription_tier != 'free' AND NEW.subscription_tier = 'free' THEN 'cancellation'
        WHEN OLD.subscription_tier != NEW.subscription_tier THEN 'upgrade'
        ELSE 'change'
      END,
      OLD.subscription_tier,
      NEW.subscription_tier,
      'system',
      jsonb_build_object(
        'old_status', OLD.subscription_status,
        'new_status', NEW.subscription_status,
        'updated_at', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track subscription changes
CREATE TRIGGER track_subscription_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION track_subscription_change();

-- Function to clean up old sessions (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions 
  WHERE created_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old sessions (if pg_cron is available)
-- This would typically be set up separately in production
-- SELECT cron.schedule('cleanup-old-sessions', '0 2 * * *', 'SELECT cleanup_old_sessions();');