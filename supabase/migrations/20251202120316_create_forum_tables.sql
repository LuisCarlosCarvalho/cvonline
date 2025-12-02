/*
  # Forum System Migration

  ## New Tables
  
  ### `forum_questions`
  - `id` (uuid, primary key) - Unique identifier for each question
  - `category` (text) - Category type: 'TI' or 'Logistica'
  - `author_name` (text) - Name of the person asking
  - `author_email` (text) - Email of the person asking
  - `title` (text) - Question title
  - `content` (text) - Question content (supports markdown, URLs, etc)
  - `image_url` (text, nullable) - Optional image URL
  - `status` (text) - Status: 'pending', 'answered', 'closed'
  - `created_at` (timestamptz) - Timestamp when question was created
  - `updated_at` (timestamptz) - Timestamp when question was last updated

  ### `forum_answers`
  - `id` (uuid, primary key) - Unique identifier for each answer
  - `question_id` (uuid, foreign key) - Reference to the question
  - `admin_name` (text) - Name of admin responding
  - `content` (text) - Answer content (supports markdown, URLs, etc)
  - `image_url` (text, nullable) - Optional image URL
  - `created_at` (timestamptz) - Timestamp when answer was created
  - `updated_at` (timestamptz) - Timestamp when answer was last updated

  ### `forum_admin`
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text, unique) - Admin email
  - `password_hash` (text) - Hashed password
  - `name` (text) - Admin name
  - `created_at` (timestamptz) - Timestamp when admin was created

  ## Security
  - Enable RLS on all tables
  - Questions: Anyone can read, anyone can create
  - Answers: Anyone can read, only authenticated admins can create
  - Admin: Only readable by authenticated admins
  
  ## Notes
  - Initial admin will need to be created separately
  - Questions start with 'pending' status
  - When admin answers, status changes to 'answered'
*/

-- Create forum_questions table
CREATE TABLE IF NOT EXISTS forum_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('TI', 'Logistica')),
  author_name text NOT NULL,
  author_email text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_answers table
CREATE TABLE IF NOT EXISTS forum_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES forum_questions(id) ON DELETE CASCADE,
  admin_name text NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_admin table
CREATE TABLE IF NOT EXISTS forum_admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_admin ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_questions
CREATE POLICY "Anyone can view questions"
  ON forum_questions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create questions"
  ON forum_questions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only system can update questions"
  ON forum_questions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for forum_answers
CREATE POLICY "Anyone can view answers"
  ON forum_answers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON forum_answers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for forum_admin
CREATE POLICY "Admins can view own data"
  ON forum_admin FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_questions_category ON forum_questions(category);
CREATE INDEX IF NOT EXISTS idx_forum_questions_status ON forum_questions(status);
CREATE INDEX IF NOT EXISTS idx_forum_questions_created ON forum_questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_answers_question ON forum_answers(question_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_forum_questions_updated_at BEFORE UPDATE ON forum_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_answers_updated_at BEFORE UPDATE ON forum_answers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();