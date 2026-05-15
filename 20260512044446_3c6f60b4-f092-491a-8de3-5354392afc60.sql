-- Journals
CREATE TABLE public.journals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood TEXT,
  prompt TEXT,
  content TEXT NOT NULL,
  ai_emotion TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own journals" ON public.journals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own journals" ON public.journals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own journals" ON public.journals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own journals" ON public.journals FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_journals_user_created ON public.journals(user_id, created_at DESC);

-- Completed experiences
CREATE TABLE public.completed_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  experience_slug TEXT NOT NULL,
  mood_before TEXT,
  mood_after TEXT,
  photo_url TEXT,
  note TEXT,
  duration_min INT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.completed_experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own completed_exp" ON public.completed_experiences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own completed_exp" ON public.completed_experiences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own completed_exp" ON public.completed_experiences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own completed_exp" ON public.completed_experiences FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_completed_exp_user ON public.completed_experiences(user_id, completed_at DESC);

-- Completed creativity
CREATE TABLE public.completed_creativity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT,
  photo_url TEXT,
  reflection TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.completed_creativity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own creativity" ON public.completed_creativity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own creativity" ON public.completed_creativity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own creativity" ON public.completed_creativity FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own creativity" ON public.completed_creativity FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_creativity_user ON public.completed_creativity(user_id, completed_at DESC);

-- Mood logs
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood TEXT NOT NULL,
  energy INT,
  note TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own mood_logs" ON public.mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own mood_logs" ON public.mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own mood_logs" ON public.mood_logs FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_mood_logs_user ON public.mood_logs(user_id, logged_at DESC);

-- User preferences (key-value)
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, key)
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own prefs" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own prefs" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own prefs" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own prefs" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for memory photos
INSERT INTO storage.buckets (id, name, public) VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "memories public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'memories');
CREATE POLICY "memories user upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "memories user delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);