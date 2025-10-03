# Setting Up Demo Users

This guide explains how to create the demo users needed for the realistic data demo.

## Option 1: Use Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** for each demo user
4. Use the following credentials:

### Admin User
- **Email:** admin@college.edu
- **Password:** Admin@123
- **Confirm Password:** YES
- **Auto Confirm:** YES
- After creating, note the User ID

### Recruiter User
- **Email:** recruiter@google.com
- **Password:** Recruiter@123
- **Confirm Password:** YES
- **Auto Confirm:** YES
- After creating, note the User ID

### Mentor User
- **Email:** mentor@college.edu
- **Password:** Mentor@123
- **Confirm Password:** YES
- **Auto Confirm:** YES
- After creating, note the User ID

### Student Users
Create each of these:

1. **Email:** priya.sharma@college.edu | **Password:** Student@123
2. **Email:** rahul.verma@college.edu | **Password:** Student@123
3. **Email:** ananya.patel@college.edu | **Password:** Student@123
4. **Email:** arjun.kumar@college.edu | **Password:** Student@123
5. **Email:** sneha.reddy@college.edu | **Password:** Student@123

**Important:** Set "Auto Confirm" to YES for all users so they can login immediately.

## Option 2: Use Application Signup (Alternative)

Instead of creating users manually, you can use the application's signup flow:

1. Start the application: `npm run dev`
2. Go to the signup page
3. For each user:
   - Enter their email
   - Enter their password
   - Select their role
   - Fill in required information
   - For recruiter, add: Company Name = "Google", Industry = "Technology"
   - Submit signup

4. After all users are created:
   - Login as Admin (admin@college.edu)
   - Navigate to **Verify Recruiters**
   - Verify the recruiter account (recruiter@google.com)

This method is more time-consuming but doesn't require Supabase dashboard access.

## Option 3: SQL Script for User Creation

If you have SQL access to your Supabase database, you can run this script:

```sql
-- Note: This requires auth.users INSERT permission
-- May not work with standard RLS policies

-- Admin User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'admin@college.edu',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Dr. Rajesh Kulkarni","role":"placement_officer"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Similar INSERTs for other users...
-- (See full script in migration file for reference)
```

**Warning:** Direct auth.users manipulation is not recommended and may not work due to RLS policies.

## Verifying User Creation

After creating users:

1. Try logging in with each account
2. Check that the role is correct on the dashboard
3. Verify that profile data is visible

If profile data is missing:
- The `handle_new_user()` trigger should have created it automatically
- If not, run the seed migration: `20251004000000_seed_realistic_demo_data.sql`
- This will populate profile and related data

## Updating User IDs in Seed Data

If your created user IDs don't match the hardcoded UUIDs in the seed migration:

1. Note the actual User IDs from Supabase Dashboard
2. Edit `supabase/migrations/20251004000000_seed_realistic_demo_data.sql`
3. Replace the hardcoded UUIDs with your actual User IDs:

```sql
-- Example: Change this
'a0000000-0000-0000-0000-000000000001'
-- To your actual admin user ID
'abc12345-6789-0abc-def0-123456789abc'
```

4. Re-run the migration

## Quick Start (Easiest Method)

**For fastest setup:**

1. Use Application Signup (Option 2) for all 8 users
2. This automatically creates both auth users and profiles
3. Then manually run seed data to add:
   - Companies
   - Opportunities
   - Applications
   - Interviews
   - Certificates

The seed data will link to your created user profiles.

## Troubleshooting

### "Email already exists" error
- The user has been created, proceed with login

### Profile not created after signup
- Check if `handle_new_user()` trigger exists
- Check trigger logs in Supabase Dashboard
- Manually run seed migration

### Wrong role assigned
- Update via SQL: `UPDATE profiles SET role = 'correct_role' WHERE email = 'user@email.com'`
- For recruiter, also update: `UPDATE profiles SET is_verified = true WHERE email = 'recruiter@google.com'`

### Cannot see applications/data
- Verify seed migration has been applied
- Check that User IDs match between auth.users and profiles
- Review RLS policies for the user's role

## Next Steps

After user creation:
1. ✅ Verify all 8 users can login
2. ✅ Check each user sees appropriate dashboard for their role
3. ✅ Run seed migration to populate demo data
4. ✅ Follow [DEMO_GUIDE.md](./DEMO_GUIDE.md) for complete walkthrough
