-- Enforce data integrity and align policies with application behavior
-- 1) Strengthen INSERT policy on opportunities: enforce posted_by = auth.uid()
DROP POLICY IF EXISTS "Placement officers and recruiters can create opportunities" ON public.opportunities;
CREATE POLICY "Placement officers and recruiters can create opportunities"
ON public.opportunities
FOR INSERT
WITH CHECK (
  public.get_current_user_role() IN ('placement_officer', 'recruiter')
  AND auth.uid() = posted_by
);

-- 2) Add CHECK constraints for data integrity (using ALTER TABLE ADD CONSTRAINT syntax)
ALTER TABLE public.opportunities
  ADD CONSTRAINT chk_opportunities_stipend_non_negative
    CHECK (stipend_amount IS NULL OR stipend_amount >= 0);

ALTER TABLE public.opportunities
  ADD CONSTRAINT chk_opportunities_min_cgpa_bounds
    CHECK (min_cgpa IS NULL OR (min_cgpa >= 0 AND min_cgpa <= 10));

ALTER TABLE public.opportunities
  ADD CONSTRAINT chk_opportunities_title_not_blank
    CHECK (char_length(btrim(title)) > 0);

ALTER TABLE public.opportunities
  ADD CONSTRAINT chk_opportunities_company_not_blank
    CHECK (char_length(btrim(company_name)) > 0);

ALTER TABLE public.opportunities
  ADD CONSTRAINT chk_opportunities_description_not_blank
    CHECK (char_length(btrim(description)) > 0);

-- 3) Validation triggers for time-based rules (use triggers instead of CHECK)
-- 3a) Opportunities: deadline must be in the future when provided
CREATE OR REPLACE FUNCTION public.validate_opportunity_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deadline IS NOT NULL AND NEW.deadline <= now() THEN
    RAISE EXCEPTION 'deadline must be in the future';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS validate_opportunity_deadline_before_ins ON public.opportunities;
DROP TRIGGER IF EXISTS validate_opportunity_deadline_before_upd ON public.opportunities;
CREATE TRIGGER validate_opportunity_deadline_before_ins
  BEFORE INSERT ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_opportunity_deadline();
CREATE TRIGGER validate_opportunity_deadline_before_upd
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_opportunity_deadline();

-- 3b) Applications: can only apply to active opportunities that are not expired
CREATE OR REPLACE FUNCTION public.validate_application()
RETURNS TRIGGER AS $$
DECLARE
  opp RECORD;
BEGIN
  SELECT is_active, deadline INTO opp
  FROM public.opportunities
  WHERE id = NEW.opportunity_id;

  IF opp IS NULL THEN
    RAISE EXCEPTION 'opportunity not found';
  END IF;

  IF opp.is_active = false THEN
    RAISE EXCEPTION 'cannot apply to an inactive opportunity';
  END IF;

  IF opp.deadline IS NOT NULL AND opp.deadline <= now() THEN
    RAISE EXCEPTION 'cannot apply after the application deadline';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS validate_application_before_ins ON public.applications;
CREATE TRIGGER validate_application_before_ins
  BEFORE INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_application();