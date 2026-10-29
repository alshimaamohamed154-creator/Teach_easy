-- Teach Easy (تيتش إيزي) - Initial Schema & Row Level Security (RLS)
-- Multi-Tenant Educational Collaborative Learning Platform

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  school_name TEXT DEFAULT 'مدرسة ثانوية',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2026/2027',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Students Table (Minimal PII)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  student_code TEXT,
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Class Enrollments Join Table
CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_class_student UNIQUE (class_id, student_id)
);

-- 5. Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  activity_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, in_progress, completed, cancelled
  grouping_strategy TEXT NOT NULL DEFAULT 'balanced', -- balanced, random, manual
  current_step_index INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Session Participants (Attendance)
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  is_present BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT unique_session_student UNIQUE (session_id, student_id)
);

-- 7. Session Groups
CREATE TABLE IF NOT EXISTS public.session_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  group_number INTEGER NOT NULL,
  group_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Session Group Members & Assigned Roles
CREATE TABLE IF NOT EXISTS public.session_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.session_groups(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.session_participants(id) ON DELETE CASCADE,
  role_title TEXT,
  role_description TEXT,
  CONSTRAINT unique_group_participant UNIQUE (group_id, participant_id)
);

-- 9. Session Responses (Interactive Classroom Submissions)
CREATE TABLE IF NOT EXISTS public.session_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.session_groups(id) ON DELETE SET NULL,
  step_id TEXT NOT NULL,
  response_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Student Competency Observations
CREATE TABLE IF NOT EXISTS public.student_competency_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL,
  level INTEGER, -- 1=مبتدئ, 2=نامٍ, 3=متمكن, 4=متقدم, NULL=غير ملحوظ
  evidence_note TEXT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Session Assessments (Teacher Wrap-up & Reflection)
CREATE TABLE IF NOT EXISTS public.session_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.session_groups(id) ON DELETE CASCADE,
  understanding_level INTEGER,
  collaboration_quality INTEGER,
  teacher_reflection TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_teacher ON public.students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON public.class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.class_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON public.sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_class ON public.sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_participants_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_groups_session ON public.session_groups(session_id);
CREATE INDEX IF NOT EXISTS idx_observations_student ON public.student_competency_observations(student_id);
CREATE INDEX IF NOT EXISTS idx_observations_teacher ON public.student_competency_observations(teacher_id);

-- Trigger to automatically create teacher profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, school_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'school_name', 'مدرسة ثانوية')
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_competency_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_assessments ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 2. Classes
CREATE POLICY "classes_select" ON public.classes FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "classes_insert" ON public.classes FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "classes_update" ON public.classes FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "classes_delete" ON public.classes FOR DELETE USING (teacher_id = auth.uid());

-- 3. Students
CREATE POLICY "students_select" ON public.students FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "students_insert" ON public.students FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "students_update" ON public.students FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "students_delete" ON public.students FOR DELETE USING (teacher_id = auth.uid());

-- 4. Class Enrollments
CREATE POLICY "enrollments_select" ON public.class_enrollments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid()));
CREATE POLICY "enrollments_insert" ON public.class_enrollments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid()));
CREATE POLICY "enrollments_delete" ON public.class_enrollments FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid()));

-- 5. Sessions
CREATE POLICY "sessions_select" ON public.sessions FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "sessions_insert" ON public.sessions FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "sessions_update" ON public.sessions FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "sessions_delete" ON public.sessions FOR DELETE USING (teacher_id = auth.uid());

-- 6. Session Participants
CREATE POLICY "participants_select" ON public.session_participants FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "participants_insert" ON public.session_participants FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "participants_update" ON public.session_participants FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "participants_delete" ON public.session_participants FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));

-- 7. Session Groups
CREATE POLICY "groups_select" ON public.session_groups FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "groups_insert" ON public.session_groups FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "groups_update" ON public.session_groups FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "groups_delete" ON public.session_groups FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));

-- 8. Session Group Members
CREATE POLICY "group_members_select" ON public.session_group_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.session_groups g
    JOIN public.sessions s ON s.id = g.session_id
    WHERE g.id = group_id AND s.teacher_id = auth.uid()
  ));
CREATE POLICY "group_members_insert" ON public.session_group_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.session_groups g
    JOIN public.sessions s ON s.id = g.session_id
    WHERE g.id = group_id AND s.teacher_id = auth.uid()
  ));
CREATE POLICY "group_members_delete" ON public.session_group_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.session_groups g
    JOIN public.sessions s ON s.id = g.session_id
    WHERE g.id = group_id AND s.teacher_id = auth.uid()
  ));

-- 9. Session Responses
CREATE POLICY "responses_select" ON public.session_responses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "responses_insert" ON public.session_responses FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "responses_update" ON public.session_responses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "responses_delete" ON public.session_responses FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));

-- 10. Student Competency Observations
CREATE POLICY "observations_select" ON public.student_competency_observations FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "observations_insert" ON public.student_competency_observations FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "observations_update" ON public.student_competency_observations FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "observations_delete" ON public.student_competency_observations FOR DELETE USING (teacher_id = auth.uid());

-- 11. Session Assessments
CREATE POLICY "assessments_select" ON public.session_assessments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "assessments_insert" ON public.session_assessments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "assessments_update" ON public.session_assessments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
CREATE POLICY "assessments_delete" ON public.session_assessments FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.teacher_id = auth.uid()));
