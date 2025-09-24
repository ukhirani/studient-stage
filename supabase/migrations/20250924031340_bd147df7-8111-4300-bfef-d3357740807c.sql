-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'placement_officer', 'faculty_mentor', 'recruiter');

-- Create enum for opportunity types
CREATE TYPE public.opportunity_type AS ENUM ('internship', 'full_time', 'part_time', 'placement');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('pending', 'under_review', 'shortlisted', 'selected', 'rejected');

-- Create profiles table for all users
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_profiles table for additional student information
CREATE TABLE public.student_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    roll_number TEXT UNIQUE,
    department TEXT,
    year_of_study INTEGER,
    cgpa DECIMAL(3,2),
    skills TEXT[],
    resume_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table
CREATE TABLE public.opportunities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    description TEXT NOT NULL,
    type opportunity_type NOT NULL DEFAULT 'internship',
    location TEXT,
    stipend_amount INTEGER,
    min_cgpa DECIMAL(3,2),
    deadline TIMESTAMP WITH TIME ZONE,
    departments TEXT[],
    required_skills TEXT[],
    posted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status application_status NOT NULL DEFAULT 'pending',
    cover_letter TEXT,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, opportunity_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Anyone can view student profiles" ON public.student_profiles
    FOR SELECT USING (true);

CREATE POLICY "Students can update their own profile" ON public.student_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile" ON public.student_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for opportunities
CREATE POLICY "Anyone can view active opportunities" ON public.opportunities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Placement officers and recruiters can create opportunities" ON public.opportunities
    FOR INSERT WITH CHECK (
        public.get_current_user_role() IN ('placement_officer', 'recruiter')
    );

CREATE POLICY "Posted by user can update opportunities" ON public.opportunities
    FOR UPDATE USING (auth.uid() = posted_by);

CREATE POLICY "Posted by user can delete opportunities" ON public.opportunities
    FOR DELETE USING (auth.uid() = posted_by);

-- RLS Policies for applications
CREATE POLICY "Students can view their own applications" ON public.applications
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Placement officers can view all applications" ON public.applications
    FOR SELECT USING (public.get_current_user_role() = 'placement_officer');

CREATE POLICY "Opportunity poster can view applications" ON public.applications
    FOR SELECT USING (
        auth.uid() IN (
            SELECT posted_by FROM public.opportunities WHERE id = opportunity_id
        )
    );

CREATE POLICY "Students can create applications" ON public.applications
    FOR INSERT WITH CHECK (
        auth.uid() = student_id AND 
        public.get_current_user_role() = 'student'
    );

CREATE POLICY "Placement officers can update application status" ON public.applications
    FOR UPDATE USING (public.get_current_user_role() = 'placement_officer');

CREATE POLICY "Opportunity poster can update application status" ON public.applications
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT posted_by FROM public.opportunities WHERE id = opportunity_id
        )
    );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX idx_student_profiles_department ON public.student_profiles(department);
CREATE INDEX idx_opportunities_posted_by ON public.opportunities(posted_by);
CREATE INDEX idx_opportunities_active ON public.opportunities(is_active);
CREATE INDEX idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX idx_applications_student_id ON public.applications(student_id);
CREATE INDEX idx_applications_opportunity_id ON public.applications(opportunity_id);
CREATE INDEX idx_applications_status ON public.applications(status);