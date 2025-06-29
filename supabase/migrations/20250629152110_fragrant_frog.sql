/*
  # Initial Schema for The Whimsical Oracle

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `avatar_url` (text, nullable)
      - `bio` (text, nullable)
      - `subscription_tier` (enum: free, premium, mystic)
      - `preferences` (jsonb for user preferences)
      - `stats` (jsonb for user statistics)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `omens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `symbol` (text)
      - `cryptic_phrase` (text)
      - `interpretation` (text)
      - `advice` (text)
      - `confidence` (numeric)
      - `category` (text)
      - `persona` (text)
      - `rating` (integer, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'mystic');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  subscription_tier subscription_tier DEFAULT 'free',
  preferences jsonb DEFAULT '{}',
  stats jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create omens table
CREATE TABLE IF NOT EXISTS omens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  cryptic_phrase text NOT NULL,
  interpretation text NOT NULL,
  advice text NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  category text NOT NULL,
  persona text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE omens ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for omens
CREATE POLICY "Users can view own omens"
  ON omens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own omens"
  ON omens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own omens"
  ON omens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own omens"
  ON omens
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS omens_user_id_idx ON omens(user_id);
CREATE INDEX IF NOT EXISTS omens_created_at_idx ON omens(created_at DESC);
CREATE INDEX IF NOT EXISTS omens_category_idx ON omens(category);
CREATE INDEX IF NOT EXISTS omens_persona_idx ON omens(persona);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();