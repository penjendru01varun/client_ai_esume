-- Create table for storing resumes
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for storing ATS scores and analysis
CREATE TABLE ats_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  overall_score INTEGER NOT NULL,
  keyword_score INTEGER NOT NULL,
  formatting_score INTEGER NOT NULL,
  experience_score INTEGER NOT NULL,
  skills_score INTEGER NOT NULL,
  feedback JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for chat history
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for resume builder data
CREATE TABLE resume_builder_data (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_builder_data ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes
CREATE POLICY "Users can insert their own resumes"
ON resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resumes"
ON resumes FOR SELECT
USING (auth.uid() = user_id);

-- Create policies for ats_scores
CREATE POLICY "Users can insert their own scores"
ON ats_scores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own scores"
ON ats_scores FOR SELECT
USING (auth.uid() = user_id);

-- Create policies for chat_history
CREATE POLICY "Users can insert their own chat history"
ON chat_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat history"
ON chat_history FOR SELECT
USING (auth.uid() = user_id);

-- Create policies for resume_builder_data
CREATE POLICY "Users can insert their own resume data"
ON resume_builder_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume data"
ON resume_builder_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own resume data"
ON resume_builder_data FOR SELECT
USING (auth.uid() = user_id);
