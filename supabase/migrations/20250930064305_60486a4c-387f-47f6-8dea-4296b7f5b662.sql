-- Add company fields and verification status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN company_name text,
ADD COLUMN industry text,
ADD COLUMN is_verified boolean DEFAULT false;

-- Create an index for faster queries on verification status
CREATE INDEX idx_profiles_verification ON public.profiles(is_verified, role);

-- Create a security definer function to check if user is verified recruiter
CREATE OR REPLACE FUNCTION public.is_verified_recruiter(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id 
    AND role = 'recruiter' 
    AND is_verified = true
  )
$$;

-- Update RLS policies to handle verification for recruiters
CREATE POLICY "Only verified recruiters can post opportunities" 
ON public.opportunities 
FOR INSERT 
WITH CHECK (
  (get_current_user_role() = 'placement_officer') OR 
  (get_current_user_role() = 'recruiter' AND public.is_verified_recruiter(auth.uid()))
);

-- Drop the old policy for recruiters posting opportunities
DROP POLICY IF EXISTS "Placement officers and recruiters can create opportunities" ON public.opportunities;