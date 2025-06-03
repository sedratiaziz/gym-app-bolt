/*
  # Initial Schema Setup for Fitness App

  1. New Tables
    - users: Core user data and profile information
    - workouts: User workout records
    - exercises: Exercise definitions
    - workout_exercises: Junction table for workout-exercise relationships
    - meals: User meal tracking
    - weight_logs: User weight history
    - supplements: Supplement catalog

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure data privacy and access control
*/

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  day text NOT NULL,
  reps integer,
  image text,
  date timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_template boolean DEFAULT false,
  muscle_groups text[] DEFAULT '{}'::text[]
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE,
  name text NOT NULL,
  weights numeric[] DEFAULT '{}'::numeric[],
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  calories integer NOT NULL,
  time timestamptz NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create weight_logs table
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  value numeric NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create supplements table
CREATE TABLE IF NOT EXISTS supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  shop text,
  price numeric,
  image text,
  tag text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own workouts" 
  ON workouts FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage exercises in own workouts" 
  ON exercises FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM workouts 
    WHERE workouts.id = exercises.workout_id 
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own meals" 
  ON meals FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own weight logs" 
  ON weight_logs FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view supplements" 
  ON supplements FOR SELECT 
  USING (true);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();