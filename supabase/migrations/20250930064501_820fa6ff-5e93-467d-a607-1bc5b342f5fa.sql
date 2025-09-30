-- Update the handle_new_user function to include company details for recruiters
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email, role, company_name, industry)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
        COALESCE(NEW.raw_user_meta_data->>'company_name', NULL),
        COALESCE(NEW.raw_user_meta_data->>'industry', NULL)
    );
    RETURN NEW;
END;
$function$;