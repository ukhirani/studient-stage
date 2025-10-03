-- Verification Script for Demo Data
-- Run this script to verify all demo data was loaded correctly
-- This script only performs SELECT queries and doesn't modify data

-- Check Companies
SELECT 
    '=== COMPANIES ===' as section,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified
FROM public.companies
WHERE name IN ('Google', 'Amazon', 'Microsoft');

SELECT 
    name, 
    industry, 
    status,
    created_at::date
FROM public.companies
WHERE name IN ('Google', 'Amazon', 'Microsoft')
ORDER BY name;

-- Check Profiles
SELECT 
    '=== PROFILES ===' as section,
    role,
    COUNT(*) as count
FROM public.profiles
WHERE email LIKE '%@college.edu' OR email LIKE '%@google.com'
GROUP BY role
ORDER BY role;

-- Check Student Profiles
SELECT 
    '=== STUDENT PROFILES ===' as section,
    COUNT(*) as total_students,
    ROUND(AVG(cgpa), 2) as avg_cgpa,
    MIN(cgpa) as min_cgpa,
    MAX(cgpa) as max_cgpa
FROM public.student_profiles sp
JOIN public.profiles p ON sp.user_id = p.user_id
WHERE p.email LIKE '%@college.edu';

-- Check Opportunities
SELECT 
    '=== OPPORTUNITIES ===' as section,
    company_name,
    title,
    stipend_amount,
    is_active,
    created_at::date
FROM public.opportunities
WHERE company_name IN ('Google', 'Amazon', 'Microsoft')
ORDER BY company_name, title;

-- Check Applications
SELECT 
    '=== APPLICATIONS ===' as section,
    status,
    COUNT(*) as count
FROM public.applications a
JOIN public.profiles p ON a.student_id = p.user_id
WHERE p.email LIKE '%@college.edu'
GROUP BY status
ORDER BY status;

-- Check Applications with Details
SELECT 
    p.full_name as student,
    o.company_name,
    o.title as role,
    a.status,
    CASE WHEN a.mentor_comments IS NOT NULL THEN 'Yes' ELSE 'No' END as mentor_feedback,
    CASE WHEN a.shortlisted_at IS NOT NULL THEN 'Yes' ELSE 'No' END as shortlisted
FROM public.applications a
JOIN public.profiles p ON a.student_id = p.user_id
JOIN public.opportunities o ON a.opportunity_id = o.id
WHERE p.email LIKE '%@college.edu'
ORDER BY p.full_name, o.company_name;

-- Check Interviews
SELECT 
    '=== INTERVIEWS ===' as section,
    status,
    COUNT(*) as count
FROM public.interviews i
JOIN public.applications a ON i.application_id = a.id
JOIN public.profiles p ON a.student_id = p.user_id
WHERE p.email LIKE '%@college.edu'
GROUP BY status
ORDER BY status;

-- Check Interviews with Details
SELECT 
    p.full_name as student,
    o.company_name,
    i.scheduled_date,
    i.round_number,
    i.status,
    i.mode
FROM public.interviews i
JOIN public.applications a ON i.application_id = a.id
JOIN public.profiles p ON a.student_id = p.user_id
JOIN public.opportunities o ON a.opportunity_id = o.id
WHERE p.email LIKE '%@college.edu'
ORDER BY i.scheduled_date, p.full_name;

-- Check Certificates
SELECT 
    '=== CERTIFICATES ===' as section,
    COUNT(*) as total_certificates
FROM public.certificates c
JOIN public.profiles p ON c.student_id = p.user_id
WHERE p.email LIKE '%@college.edu';

-- Check Certificates with Details
SELECT 
    p.full_name as student,
    co.name as company,
    c.certificate_type,
    c.title,
    c.issue_date
FROM public.certificates c
JOIN public.profiles p ON c.student_id = p.user_id
LEFT JOIN public.companies co ON c.company_id = co.id
WHERE p.email LIKE '%@college.edu'
ORDER BY c.issue_date DESC;

-- Check Career Logs
SELECT 
    '=== CAREER LOGS ===' as section,
    type,
    COUNT(*) as count
FROM public.career_log cl
JOIN public.profiles p ON cl.student_id = p.user_id
WHERE p.email LIKE '%@college.edu'
GROUP BY type
ORDER BY type;

-- Check Feedback
SELECT 
    '=== FEEDBACK ===' as section,
    COUNT(*) as total_feedback,
    AVG(rating) as avg_rating
FROM public.feedback f
JOIN public.profiles p ON f.to_user_id = p.user_id
WHERE p.email LIKE '%@college.edu';

-- Check Mentor-Student Assignments
SELECT 
    '=== MENTOR ASSIGNMENTS ===' as section,
    COUNT(*) as total_assignments,
    COUNT(CASE WHEN is_active THEN 1 END) as active_assignments
FROM public.mentor_student_assignments msa
JOIN public.profiles p ON msa.student_id = p.user_id
WHERE p.email LIKE '%@college.edu';

-- Check Offer Letters
SELECT 
    '=== OFFER LETTERS ===' as section,
    COUNT(*) as total_offers,
    COUNT(CASE WHEN offer_status = 'accepted' THEN 1 END) as accepted_offers
FROM public.offer_letters ol
JOIN public.profiles p ON ol.student_id = p.user_id
WHERE p.email LIKE '%@college.edu';

-- Offer Letters with Details
SELECT 
    p.full_name as student,
    co.name as company,
    ol.position_title,
    ol.offered_salary,
    ol.offer_status,
    ol.joining_date
FROM public.offer_letters ol
JOIN public.profiles p ON ol.student_id = p.user_id
JOIN public.companies co ON ol.company_id = co.id
WHERE p.email LIKE '%@college.edu'
ORDER BY ol.offered_at DESC;

-- Summary Statistics
SELECT 
    '=== SUMMARY ===' as section,
    (SELECT COUNT(*) FROM public.companies WHERE name IN ('Google', 'Amazon', 'Microsoft')) as companies,
    (SELECT COUNT(*) FROM public.opportunities WHERE company_name IN ('Google', 'Amazon', 'Microsoft')) as opportunities,
    (SELECT COUNT(*) FROM public.profiles WHERE email LIKE '%@college.edu' AND role = 'student') as students,
    (SELECT COUNT(*) FROM public.applications a JOIN public.profiles p ON a.student_id = p.user_id WHERE p.email LIKE '%@college.edu') as applications,
    (SELECT COUNT(*) FROM public.interviews i JOIN public.applications a ON i.application_id = a.id JOIN public.profiles p ON a.student_id = p.user_id WHERE p.email LIKE '%@college.edu') as interviews,
    (SELECT COUNT(*) FROM public.certificates c JOIN public.profiles p ON c.student_id = p.user_id WHERE p.email LIKE '%@college.edu') as certificates,
    (SELECT COUNT(*) FROM public.offer_letters ol JOIN public.profiles p ON ol.student_id = p.user_id WHERE p.email LIKE '%@college.edu') as offers;

-- Success Rate Analysis
SELECT 
    '=== SUCCESS METRICS ===' as section,
    ROUND(100.0 * COUNT(CASE WHEN a.status = 'selected' THEN 1 END) / NULLIF(COUNT(*), 0), 1) as placement_rate,
    ROUND(100.0 * COUNT(CASE WHEN a.mentor_comments IS NOT NULL THEN 1 END) / NULLIF(COUNT(*), 0), 1) as mentor_review_rate,
    ROUND(100.0 * COUNT(CASE WHEN a.shortlisted_at IS NOT NULL THEN 1 END) / NULLIF(COUNT(*), 0), 1) as shortlist_rate
FROM public.applications a
JOIN public.profiles p ON a.student_id = p.user_id
WHERE p.email LIKE '%@college.edu';

-- Data Quality Checks
SELECT '=== DATA QUALITY CHECKS ===' as section;

SELECT 
    'Applications without opportunities' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS ✓' ELSE 'FAIL ✗' END as status
FROM public.applications a
LEFT JOIN public.opportunities o ON a.opportunity_id = o.id
WHERE o.id IS NULL;

SELECT 
    'Applications without student profiles' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS ✓' ELSE 'FAIL ✗' END as status
FROM public.applications a
LEFT JOIN public.profiles p ON a.student_id = p.user_id
WHERE p.id IS NULL;

SELECT 
    'Interviews without applications' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS ✓' ELSE 'FAIL ✗' END as status
FROM public.interviews i
LEFT JOIN public.applications a ON i.application_id = a.id
WHERE a.id IS NULL;

SELECT 
    'Certificates without applications' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS ✓' ELSE 'FAIL ✗' END as status
FROM public.certificates c
LEFT JOIN public.applications a ON c.application_id = a.id
WHERE c.application_id IS NOT NULL AND a.id IS NULL;

-- Expected Results:
-- Companies: 3 (all verified)
-- Opportunities: 3 (all active)
-- Students: 5 (with profiles)
-- Applications: 11 (various statuses)
-- Interviews: 7 (scheduled/completed)
-- Certificates: 2 (for placed students)
-- Offer Letters: 2 (both accepted)
-- Mentor Assignments: 5 (all active)
-- Feedback: 5 entries
-- Career Logs: 5+ entries
-- All data quality checks should PASS ✓
