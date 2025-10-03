-- Create storage bucket for student resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create RLS policies for resume uploads
CREATE POLICY "Students can upload their own resumes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'student'
);

CREATE POLICY "Students can update their own resumes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Recruiters and placement officers can view all resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('recruiter', 'placement_officer')
  )
);

CREATE POLICY "Students can delete their own resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add interview rounds to opportunities table
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS interview_rounds JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.opportunities.interview_rounds IS 'Array of interview rounds with details: [{"round_number": 1, "round_name": "Technical Round", "description": "Coding assessment"}]';

-- Add current round tracking to applications
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS current_round INTEGER DEFAULT 0;

COMMENT ON COLUMN public.applications.current_round IS 'Current interview round number (0 = initial screening, 1+ = interview rounds)';

-- Create function to update updated_at on student_profiles
CREATE OR REPLACE FUNCTION public.update_student_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for student_profiles
DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_student_profile_updated_at();