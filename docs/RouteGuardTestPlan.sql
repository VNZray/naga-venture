-- SQL script to create test users for RBAC testing
-- Run this in your Supabase SQL editor

-- Insert test users with different roles for RBAC testing
-- Note: You'll need to create actual auth users first through your signup process,
-- then update their profiles with these roles

-- Example: Update an existing user to be a business_listing_manager
-- UPDATE profiles 
-- SET role = 'business_listing_manager'
-- WHERE email = 'blmadmin@nagaventures.com';

-- Example: Update an existing user to be a tourism_content_manager
-- UPDATE profiles 
-- SET role = 'tourism_content_manager'
-- WHERE email = 'tcmadmin@nagaventures.com';

-- Example: Update an existing user to be a business_registration_manager
-- UPDATE profiles 
-- SET role = 'business_registration_manager'
-- WHERE email = 'brmadmin@nagaventures.com';

-- To check current users and their roles:
SELECT 
  email,
  role,
  first_name,
  last_name,
  is_verified,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- RBAC Test Scenarios:
-- 1. Login as blmadmin@nagaventures.com (business_listing_manager)
--    Should see: Dashboard, Business Listings, Categories, Reviews & Ratings, Content Approval, Analytics
--    Should NOT see: User Management, Tourism Content, Events, Bookings & Reservations, System Settings, Business Registrations, Business Owners

-- 2. Login as tcmadmin@nagaventures.com (tourism_content_manager) 
--    Should see: Dashboard, Tourism Content, Events, Categories, Reviews & Ratings, Analytics
--    Should NOT see: User Management, Business Listings, Bookings & Reservations, Content Approval, System Settings, Business Registrations, Business Owners

-- 3. Login as brmadmin@nagaventures.com (business_registration_manager)
--    Should see: Dashboard, Business Registrations, Business Owners, Analytics
--    Should NOT see: User Management, Business Listings, Tourism Content, Events, Categories, Bookings & Reservations, Reviews & Ratings, Content Approval, System Settings

-- 4. Try accessing /TourismCMS/(admin)/system-settings directly with non-admin users
--    Should redirect to unauthorized page
