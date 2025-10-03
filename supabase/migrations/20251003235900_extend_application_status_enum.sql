-- Extend application_status enum to include mentor and interview states
-- This migration adds new status values that are used in the application workflow

-- Add new status values to the application_status enum
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'mentor_pending';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'mentor_approved';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'mentor_rejected';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'interview_scheduled';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'interview_completed';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'offer_extended';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'offer_accepted';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'offer_rejected';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'internship_completed';
ALTER TYPE public.application_status ADD VALUE IF NOT EXISTS 'placed';

-- These values support the complete placement workflow:
-- pending -> mentor_pending -> mentor_approved -> shortlisted -> 
-- interview_scheduled -> interview_completed -> offer_extended -> 
-- offer_accepted -> internship_completed/placed
