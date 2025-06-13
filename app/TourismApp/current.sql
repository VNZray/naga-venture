-- NAGA VENTURE Database Schema for Supabase
-- Created: June 8, 2025 (Updated)
-- Description: Complete SQL schema for NAGA VENTURE tourism platform with critical fixes
-- Enable necessary extensions
create extension IF not exists "uuid-ossp";

create extension IF not exists "postgis";

-- =================================================================
-- AUTHENTICATION & USER MANAGEMENT
-- =================================================================
-- User Roles Enum
create type user_role as ENUM(
  'tourism_admin',
  'business_listing_manager',
  'tourism_content_manager',
  'business_registration_manager',
  'business_owner',
  'tourist'
);

-- Profiles Table (extends Supabase auth.users)
create table profiles (
  id UUID primary key references auth.users (id) on delete CASCADE,
  email TEXT unique not null,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  profile_image_url TEXT,
  role user_role not null default 'tourist',
  is_verified BOOLEAN not null default false,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

COMMENT on table profiles is 'User profiles for all system users, linked to Supabase auth';

-- CRITICAL FIX: Auth-Profile Trigger
-- This function runs automatically when a new user signs up
create or replace function handle_new_user () RETURNS TRIGGER as $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger connects the function to the auth system
create trigger on_auth_user_created
after INSERT on auth.users for EACH row
execute PROCEDURE handle_new_user ();

-- Staff Permissions Table (for admin and manager roles)
create table staff_permissions (
  id UUID primary key default uuid_generate_v4 (),
  profile_id UUID not null references profiles (id) on delete CASCADE,
  can_manage_users BOOLEAN not null default false,
  can_manage_businesses BOOLEAN not null default false,
  can_manage_tourist_spots BOOLEAN not null default false,
  can_manage_events BOOLEAN not null default false,
  can_approve_content BOOLEAN not null default false,
  can_manage_categories BOOLEAN not null default false,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

COMMENT on table staff_permissions is 'Detailed permissions for staff members (admins and managers)';

-- =================================================================
-- CATEGORIES
-- =================================================================
-- Main Categories Table
create table main_categories (
  id UUID primary key default uuid_generate_v4 (),
  name TEXT not null unique,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN not null default true,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  created_by UUID references profiles (id) on delete set null,
  updated_by UUID references profiles (id) on delete set null
);

COMMENT on table main_categories is 'Main categories for businesses and tourist spots';

-- Sub Categories Table
create table sub_categories (
  id UUID primary key default uuid_generate_v4 (),
  main_category_id UUID not null references main_categories (id) on delete CASCADE,
  name TEXT not null,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN not null default true,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  created_by UUID references profiles (id) on delete set null,
  updated_by UUID references profiles (id) on delete set null,
  unique (main_category_id, name)
);

COMMENT on table sub_categories is 'Sub-categories that belong to main categories';

-- =================================================================
-- BUSINESS LISTINGS
-- =================================================================
-- Business Types Enum
create type business_type as ENUM('accommodation', 'shop', 'service');

-- Business Status Enum
create type business_status as ENUM('pending', 'approved', 'rejected', 'inactive');

-- Businesses Table
create table businesses (
  id UUID primary key default uuid_generate_v4 (),
  owner_id UUID references profiles (id) on delete set null,
  business_name TEXT not null,
  business_type business_type not null,
  description TEXT not null,
  address TEXT not null,
  city TEXT not null default 'Naga City',
  province TEXT not null default 'Camarines Sur',
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  location GEOGRAPHY (POINT) not null,
  google_maps_place_id TEXT,
  status business_status not null default 'pending',
  is_claimed BOOLEAN not null default false,
  is_featured BOOLEAN not null default false,
  average_rating NUMERIC(3, 2),
  review_count INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID references profiles (id) on delete set null,
  rejection_reason TEXT,
  constraint description_min_length check (LENGTH(description) >= 200)
);

create index idx_businesses_location on businesses using GIST (location);

create index idx_businesses_business_type on businesses (business_type);

create index idx_businesses_status on businesses (status);

COMMENT on table businesses is 'All business listings including accommodations, shops, and services';

COMMENT on column businesses.location is 'Geographic point location. Insert using ST_Point(longitude, latitude)';

-- Business Categories Junction Table
create table business_categories (
  id UUID primary key default uuid_generate_v4 (),
  business_id UUID not null references businesses (id) on delete CASCADE,
  sub_category_id UUID not null references sub_categories (id) on delete CASCADE,
  created_at TIMESTAMPTZ not null default NOW(),
  unique (business_id, sub_category_id)
);

COMMENT on table business_categories is 'Junction table linking businesses to their categories';

-- Business Images Table
create table business_images (
  id UUID primary key default uuid_generate_v4 (),
  business_id UUID not null references businesses (id) on delete CASCADE,
  image_url TEXT not null,
  caption TEXT,
  is_primary BOOLEAN not null default false,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

create index idx_business_images_business_id on business_images (business_id);

COMMENT on table business_images is 'Images for business listings (up to 10 per business)';

-- Business Hours Table
create table business_hours (
  id UUID primary key default uuid_generate_v4 (),
  business_id UUID not null references businesses (id) on delete CASCADE,
  day_of_week INTEGER not null check (day_of_week between 0 and 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN not null default false,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  unique (business_id, day_of_week)
);

COMMENT on table business_hours is 'Operating hours for businesses';

-- Business Amenities Table
create table amenities (
  id UUID primary key default uuid_generate_v4 (),
  name TEXT not null unique,
  icon_url TEXT,
  created_at TIMESTAMPTZ not null default NOW()
);

COMMENT on table amenities is 'List of possible amenities for businesses';

-- Business Amenities Junction Table
create table business_amenities (
  id UUID primary key default uuid_generate_v4 (),
  business_id UUID not null references businesses (id) on delete CASCADE,
  amenity_id UUID not null references amenities (id) on delete CASCADE,
  created_at TIMESTAMPTZ not null default NOW(),
  unique (business_id, amenity_id)
);

COMMENT on table business_amenities is 'Junction table linking businesses to their amenities';

-- =================================================================
-- ACCOMMODATION-SPECIFIC TABLES
-- =================================================================
-- Room Types Table
CREATE TABLE room_types (
  id UUID primary key default uuid_generate_v4 (),
  business_id UUID not null references businesses (id) on delete CASCADE,
  name TEXT not null,
  description TEXT not null,
  capacity INTEGER not null,
  price_per_night NUMERIC(10, 2) not null,
  quantity INTEGER not null default 1,
  is_available BOOLEAN not null default true,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

-- Function Trigger for rooms
CREATE OR REPLACE FUNCTION check_business_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM businesses
    WHERE id = NEW.business_id
      AND business_type = 'accommodation'
  ) THEN
    RAISE EXCEPTION 'Business must be of type accommodation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_business_type
BEFORE INSERT OR UPDATE ON room_types
FOR EACH ROW EXECUTE FUNCTION check_business_type();

create index idx_room_types_business_id on room_types (business_id);

COMMENT on table room_types is 'Room types available for accommodation businesses';

-- Room Images Table
create table room_images (
  id UUID primary key default uuid_generate_v4 (),
  room_type_id UUID not null references room_types (id) on delete CASCADE,
  image_url TEXT not null,
  caption TEXT,
  is_primary BOOLEAN not null default false,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW()
);

create index idx_room_images_room_type_id on room_images (room_type_id);

COMMENT on table room_images is 'Images for specific room types';

-- Room Amenities Junction Table
create table room_amenities (
  id UUID primary key default uuid_generate_v4 (),
  room_type_id UUID not null references room_types (id) on delete CASCADE,
  amenity_id UUID not null references amenities (id) on delete CASCADE,
  created_at TIMESTAMPTZ not null default NOW(),
  unique (room_type_id, amenity_id)
);

COMMENT on table room_amenities is 'Junction table linking room types to their amenities';

-- =================================================================
-- BOOKING SYSTEM
-- =================================================================
-- Booking Status Enum
create type booking_status as ENUM(
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

-- Payment Status Enum
create type payment_status as ENUM(
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded'
);

-- Payment Method Enum
create type payment_method as ENUM(
  'gcash',
  'paypal',
  'xendit',
  'credit_card',
  'cash'
);

-- Bookings Table
CREATE TABLE bookings (
  id UUID primary key default uuid_generate_v4 (),
  booking_number TEXT not null unique,
  guest_id UUID not null references profiles (id) on delete CASCADE,
  business_id UUID not null references businesses (id) on delete CASCADE,
  room_type_id UUID references room_types (id) on delete set null,
  check_in_date DATE not null,
  check_out_date DATE not null,
  number_of_guests INTEGER not null,
  special_requests TEXT,
  total_amount NUMERIC(10, 2) not null,
  status booking_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  payment_method payment_method,
  payment_reference TEXT,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  constraint valid_date_range check (check_out_date > check_in_date)
);

CREATE OR REPLACE FUNCTION check_business_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM businesses
    WHERE id = NEW.business_id
      AND business_type = 'accommodation'
  ) THEN
    RAISE EXCEPTION 'Business must be of type accommodation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_business_type
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION check_business_type();

CREATE INDEX idx_bookings_guest_id ON bookings (guest_id);
CREATE INDEX idx_bookings_business_id ON bookings (business_id);
CREATE INDEX idx_bookings_date_range ON bookings (check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings (status);

COMMENT ON TABLE bookings IS 'Accommodation bookings made through the platform';

-- Payment Transactions Table
create table payment_transactions (
  id UUID primary key default uuid_generate_v4 (),
  booking_id UUID not null references bookings (id) on delete CASCADE,
  amount NUMERIC(10, 2) not null,
  payment_method payment_method not null,
  transaction_id TEXT,
  payment_status payment_status not null,
  payment_gateway TEXT not null,
  gateway_response JSONB,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

create index idx_payment_transactions_booking_id on payment_transactions (booking_id);

COMMENT on table payment_transactions is 'Payment transaction records for bookings';

-- =================================================================
-- TOURIST SPOTS
-- =================================================================
-- Tourist Spot Status Enum
create type tourist_spot_status as ENUM(
  'pending',
  'active',
  'inactive',
  'under_maintenance',
  'coming_soon'
);

-- Tourist Spot Type Enum
create type tourist_spot_type as ENUM(
  'natural',
  'cultural',
  'historical',
  'religious',
  'recreational',
  'other'
);

-- Tourist Spots Table
create table tourist_spots (
  id UUID primary key default uuid_generate_v4 (),
  name TEXT not null,
  description TEXT not null,
  spot_type tourist_spot_type not null,
  address TEXT not null,
  city TEXT not null default 'Naga City',
  province TEXT not null default 'Camarines Sur',
  location GEOGRAPHY (POINT) not null,
  google_maps_place_id TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  opening_time TIME,
  closing_time TIME,
  entry_fee NUMERIC(10, 2),
  status tourist_spot_status not null default 'active',
  is_featured BOOLEAN not null default false,
  average_rating NUMERIC(3, 2),
  review_count INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  created_by UUID references profiles (id) on delete set null,
  updated_by UUID references profiles (id) on delete set null
);

create index idx_tourist_spots_location on tourist_spots using GIST (location);

create index idx_tourist_spots_status on tourist_spots (status);

create index idx_tourist_spots_type on tourist_spots (spot_type);

COMMENT on table tourist_spots is 'Tourist attractions and points of interest';

COMMENT on column tourist_spots.location is 'Geographic point location. Insert using ST_Point(longitude, latitude)';

-- Tourist Spot Categories Junction Table
create table tourist_spot_categories (
  id UUID primary key default uuid_generate_v4 (),
  tourist_spot_id UUID not null references tourist_spots (id) on delete CASCADE,
  sub_category_id UUID not null references sub_categories (id) on delete CASCADE,
  created_at TIMESTAMPTZ not null default NOW(),
  unique (tourist_spot_id, sub_category_id)
);

COMMENT on table tourist_spot_categories is 'Junction table linking tourist spots to their categories';

-- Tourist Spot Images Table
create table tourist_spot_images (
  id UUID primary key default uuid_generate_v4 (),
  tourist_spot_id UUID not null references tourist_spots (id) on delete CASCADE,
  image_url TEXT not null,
  caption TEXT,
  is_primary BOOLEAN not null default false,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

create index idx_tourist_spot_images_spot_id on tourist_spot_images (tourist_spot_id);

COMMENT on table tourist_spot_images is 'Images for tourist spots';

-- =================================================================
-- EVENTS
-- =================================================================
-- Event Status Enum
create type event_status as ENUM('upcoming', 'ongoing', 'completed', 'cancelled');

-- Events Table
create table events (
  id UUID primary key default uuid_generate_v4 (),
  name TEXT not null,
  description TEXT not null,
  start_date DATE not null,
  end_date DATE not null,
  start_time TIME,
  end_time TIME,
  venue_name TEXT not null,
  address TEXT not null,
  city TEXT not null default 'Naga City',
  province TEXT not null default 'Camarines Sur',
  location GEOGRAPHY (POINT) not null,
  tourist_spot_id UUID references tourist_spots (id) on delete set null,
  business_id UUID references businesses (id) on delete set null,
  entry_fee NUMERIC(10, 2),
  organizer_name TEXT,
  organizer_contact TEXT,
  organizer_email TEXT,
  website TEXT,
  status event_status not null default 'upcoming',
  is_featured BOOLEAN not null default false,
  average_rating NUMERIC(3, 2),
  review_count INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  created_by UUID references profiles (id) on delete set null,
  updated_by UUID references profiles (id) on delete set null,
  constraint valid_date_range check (end_date >= start_date)
);

create index idx_events_location on events using GIST (location);

create index idx_events_date_range on events (start_date, end_date);

create index idx_events_status on events (status);

COMMENT on table events is 'Events and activities happening in Naga City';

COMMENT on column events.location is 'Geographic point location. Insert using ST_Point(longitude, latitude)';

-- Event Categories Junction Table
create table event_categories (
  id UUID primary key default uuid_generate_v4 (),
  event_id UUID not null references events (id) on delete CASCADE,
  sub_category_id UUID not null references sub_categories (id) on delete CASCADE,
  created_at TIMESTAMPTZ not null default NOW(),
  unique (event_id, sub_category_id)
);

COMMENT on table event_categories is 'Junction table linking events to their categories';

-- Event Images Table
create table event_images (
  id UUID primary key default uuid_generate_v4 (),
  event_id UUID not null references events (id) on delete CASCADE,
  image_url TEXT not null,
  caption TEXT,
  is_primary BOOLEAN not null default false,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

create index idx_event_images_event_id on event_images (event_id);

COMMENT on table event_images is 'Images for events';

-- =================================================================
-- REVIEWS & RATINGS
-- =================================================================
-- Review Type Enum
create type review_type as ENUM('business', 'tourist_spot', 'event');

-- Reviews Table
create table reviews (
  id UUID primary key default uuid_generate_v4 (),
  reviewer_id UUID not null references profiles (id) on delete CASCADE,
  review_type review_type not null,
  business_id UUID references businesses (id) on delete CASCADE,
  tourist_spot_id UUID references tourist_spots (id) on delete CASCADE,
  event_id UUID references events (id) on delete CASCADE,
  rating INTEGER not null check (rating between 1 and 5),
  comment TEXT,
  is_approved BOOLEAN not null default false,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  constraint one_entity_only check (
    (
      business_id is not null
      and tourist_spot_id is null
      and event_id is null
    )
    or (
      business_id is null
      and tourist_spot_id is not null
      and event_id is null
    )
    or (
      business_id is null
      and tourist_spot_id is null
      and event_id is not null
    )
  ),
  constraint matching_review_type check (
    (
      review_type = 'business'
      and business_id is not null
    )
    or (
      review_type = 'tourist_spot'
      and tourist_spot_id is not null
    )
    or (
      review_type = 'event'
      and event_id is not null
    )
  )
);

create index idx_reviews_reviewer_id on reviews (reviewer_id);

create index idx_reviews_business_id on reviews (business_id)
where
  business_id is not null;

create index idx_reviews_tourist_spot_id on reviews (tourist_spot_id)
where
  tourist_spot_id is not null;

create index idx_reviews_event_id on reviews (event_id)
where
  event_id is not null;

COMMENT on table reviews is 'User reviews and ratings for businesses, tourist spots, and events';

-- Review Responses Table
create table review_responses (
  id UUID primary key default uuid_generate_v4 (),
  review_id UUID not null references reviews (id) on delete CASCADE,
  responder_id UUID not null references profiles (id) on delete CASCADE,
  response TEXT not null,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

create index idx_review_responses_review_id on review_responses (review_id);

COMMENT on table review_responses is 'Responses from business owners or admins to user reviews';

-- Review Images Table
create table review_images (
  id UUID primary key default uuid_generate_v4 (),
  review_id UUID not null references reviews (id) on delete CASCADE,
  image_url TEXT not null,
  created_at TIMESTAMPTZ not null default NOW()
);

create index idx_review_images_review_id on review_images (review_id);

COMMENT on table review_images is 'Images attached to user reviews';

-- =================================================================
-- PROMOTIONS & SPECIAL OFFERS
-- =================================================================
-- Promotion Status Enum
create type promotion_status as ENUM('active', 'scheduled', 'expired', 'cancelled');

-- Promotions Table
create table promotions (
  id UUID primary key default uuid_generate_v4 (),
  title TEXT not null,
  description TEXT not null,
  start_date DATE not null,
  end_date DATE not null,
  business_id UUID references businesses (id) on delete CASCADE,
  is_platform_wide BOOLEAN not null default false,
  discount_percentage INTEGER,
  discount_amount NUMERIC(10, 2),
  promo_code TEXT,
  terms_conditions TEXT,
  status promotion_status not null default 'scheduled',
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  created_by UUID references profiles (id) on delete set null,
  updated_by UUID references profiles (id) on delete set null,
  constraint valid_date_range check (end_date >= start_date),
  constraint business_or_platform check (
    (
      business_id is not null
      and is_platform_wide = false
    )
    or (
      business_id is null
      and is_platform_wide = true
    )
  )
);

create index idx_promotions_date_range on promotions (start_date, end_date);

create index idx_promotions_business_id on promotions (business_id)
where
  business_id is not null;

create index idx_promotions_status on promotions (status);

COMMENT on table promotions is 'Promotions and special offers from businesses or platform-wide';

-- Promotion Images Table
create table promotion_images (
  id UUID primary key default uuid_generate_v4 (),
  promotion_id UUID not null references promotions (id) on delete CASCADE,
  image_url TEXT not null,
  is_primary BOOLEAN not null default false,
  display_order INTEGER not null default 0,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW()
);

create index idx_promotion_images_promotion_id on promotion_images (promotion_id);

COMMENT on table promotion_images is 'Images for promotions and special offers';

-- =================================================================
-- CONTENT APPROVAL WORKFLOW
-- =================================================================
-- Content Type Enum
create type content_type as ENUM(
  'business_profile',
  'tourist_spot',
  'event',
  'promotion'
);

-- Content Status Enum
create type content_status as ENUM('pending', 'approved', 'rejected');

-- Content Approval Requests Table
create table content_approval_requests (
  id UUID primary key default uuid_generate_v4 (),
  content_type content_type not null,
  content_id UUID not null,
  submitter_id UUID not null references profiles (id) on delete CASCADE,
  status content_status not null default 'pending',
  submission_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID references profiles (id) on delete set null
);

create index idx_content_approval_requests_content on content_approval_requests (content_type, content_id);

create index idx_content_approval_requests_submitter on content_approval_requests (submitter_id);

create index idx_content_approval_requests_status on content_approval_requests (status);

COMMENT on table content_approval_requests is 'Requests for content approval in the workflow';

-- Content Change History Table
create table content_change_history (
  id UUID primary key default uuid_generate_v4 (),
  content_type content_type not null,
  content_id UUID not null,
  changed_by UUID not null references profiles (id) on delete set null,
  previous_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ not null default NOW()
);

create index idx_content_change_history_content on content_change_history (content_type, content_id);

COMMENT on table content_change_history is 'History of changes made to content for auditing purposes';

-- =================================================================
-- API INTEGRATION
-- =================================================================
-- API Integration Table
create table api_integrations (
  id UUID primary key default uuid_generate_v4 (),
  name TEXT not null unique,
  api_key TEXT,
  api_secret TEXT,
  config JSONB not null default '{}'::jsonb,
  is_active BOOLEAN not null default true,
  created_at TIMESTAMPTZ not null default NOW(),
  updated_at TIMESTAMPTZ not null default NOW(),
  created_by UUID references profiles (id) on delete set null,
  updated_by UUID references profiles (id) on delete set null
);

COMMENT on table api_integrations is 'Configuration for external API integrations';

-- =================================================================
-- ANALYTICS & LOGGING
-- =================================================================
-- Page View Types Enum
create type page_view_type as ENUM('business', 'tourist_spot', 'event', 'promotion');

-- Page Views Table
create table page_views (
  id UUID primary key default uuid_generate_v4 (),
  view_type page_view_type not null,
  content_id UUID not null,
  viewer_id UUID references profiles (id) on delete set null,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ not null default NOW()
);

create index idx_page_views_content on page_views (view_type, content_id);

create index idx_page_views_viewer on page_views (viewer_id)
where
  viewer_id is not null;

create index idx_page_views_created_at on page_views (created_at);

COMMENT on table page_views is 'Analytics for page views of different content types';

-- System Logs Table
create table system_logs (
  id UUID primary key default uuid_generate_v4 (),
  action TEXT not null,
  entity_type TEXT,
  entity_id UUID,
  user_id UUID references profiles (id) on delete set null,
  ip_address TEXT,
  details JSONB,
  created_at TIMESTAMPTZ not null default NOW()
);

create index idx_system_logs_action on system_logs (action);

create index idx_system_logs_entity on system_logs (entity_type, entity_id)
where
  entity_type is not null;

create index idx_system_logs_user_id on system_logs (user_id)
where
  user_id is not null;

create index idx_system_logs_created_at on system_logs (created_at);

COMMENT on table system_logs is 'System-wide logging for auditing and debugging';

-- =================================================================
-- ROW LEVEL SECURITY POLICIES
-- =================================================================
-- Enable RLS on all tables
alter table profiles ENABLE row LEVEL SECURITY;

alter table staff_permissions ENABLE row LEVEL SECURITY;

alter table main_categories ENABLE row LEVEL SECURITY;

alter table sub_categories ENABLE row LEVEL SECURITY;

alter table businesses ENABLE row LEVEL SECURITY;

alter table business_categories ENABLE row LEVEL SECURITY;

alter table business_images ENABLE row LEVEL SECURITY;

alter table business_hours ENABLE row LEVEL SECURITY;

alter table amenities ENABLE row LEVEL SECURITY;

alter table business_amenities ENABLE row LEVEL SECURITY;

alter table room_types ENABLE row LEVEL SECURITY;

alter table room_images ENABLE row LEVEL SECURITY;

alter table room_amenities ENABLE row LEVEL SECURITY;

alter table bookings ENABLE row LEVEL SECURITY;

alter table payment_transactions ENABLE row LEVEL SECURITY;

alter table tourist_spots ENABLE row LEVEL SECURITY;

alter table tourist_spot_categories ENABLE row LEVEL SECURITY;

alter table tourist_spot_images ENABLE row LEVEL SECURITY;

alter table events ENABLE row LEVEL SECURITY;

alter table event_categories ENABLE row LEVEL SECURITY;

alter table event_images ENABLE row LEVEL SECURITY;

alter table reviews ENABLE row LEVEL SECURITY;

alter table review_responses ENABLE row LEVEL SECURITY;

alter table review_images ENABLE row LEVEL SECURITY;

alter table promotions ENABLE row LEVEL SECURITY;

alter table promotion_images ENABLE row LEVEL SECURITY;

alter table content_approval_requests ENABLE row LEVEL SECURITY;

alter table content_change_history ENABLE row LEVEL SECURITY;

alter table api_integrations ENABLE row LEVEL SECURITY;

alter table page_views ENABLE row LEVEL SECURITY;

alter table system_logs ENABLE row LEVEL SECURITY;

-- Example RLS policies (to be expanded based on specific requirements)
-- Profiles: Users can read all profiles but only update their own
create policy profiles_select_all on profiles for
select
  using (true);

create policy profiles_update_own on profiles
for update
  using (auth.uid () = id);

-- Businesses: Public can view approved businesses, owners can manage their own
create policy businesses_select_public on businesses for
select
  using (status = 'approved');

create policy businesses_manage_own on businesses for all using (owner_id = auth.uid ());

create policy businesses_manage_admin on businesses for all using (
  exists (
    select
      1
    from
      profiles
    where
      profiles.id = auth.uid ()
      and (
        profiles.role = 'tourism_admin'
        or profiles.role = 'business_listing_manager'
      )
  )
);

-- Bookings: Guests can see their own bookings, business owners can see bookings for their business
create policy bookings_select_guest on bookings for
select
  using (guest_id = auth.uid ());

create policy bookings_select_business on bookings for
select
  using (
    exists (
      select
        1
      from
        businesses
      where
        businesses.id = business_id
        and businesses.owner_id = auth.uid ()
    )
  );

create policy bookings_select_admin on bookings for
select
  using (
    exists (
      select
        1
      from
        profiles
      where
        profiles.id = auth.uid ()
        and profiles.role = 'tourism_admin'
    )
  );

-- Reviews: Public can view approved reviews, users can manage their own
create policy reviews_select_public on reviews for
select
  using (is_approved = true);

create policy reviews_manage_own on reviews for all using (reviewer_id = auth.uid ());

create policy reviews_manage_admin on reviews for all using (
  exists (
    select
      1
    from
      profiles
    where
      profiles.id = auth.uid ()
      and profiles.role = 'tourism_admin'
  )
);

-- =================================================================
-- FUNCTIONS & TRIGGERS
-- =================================================================
-- Function to update average rating for businesses
create or replace function update_business_rating () RETURNS TRIGGER as $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.review_type = 'business' AND NEW.business_id IS NOT NULL THEN
    UPDATE businesses
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE business_id = NEW.business_id
        AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE business_id = NEW.business_id
        AND is_approved = true
      )
    WHERE id = NEW.business_id;
  ELSIF TG_OP = 'DELETE' AND OLD.review_type = 'business' AND OLD.business_id IS NOT NULL THEN
    UPDATE businesses
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE business_id = OLD.business_id
        AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE business_id = OLD.business_id
        AND is_approved = true
      )
    WHERE id = OLD.business_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for business rating updates
create trigger update_business_rating_trigger
after INSERT
or
update
or DELETE on reviews for EACH row
execute FUNCTION update_business_rating ();

-- Function to update average rating for tourist spots
create or replace function update_tourist_spot_rating () RETURNS TRIGGER as $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.review_type = 'tourist_spot' AND NEW.tourist_spot_id IS NOT NULL THEN
    UPDATE tourist_spots
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE tourist_spot_id = NEW.tourist_spot_id
        AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE tourist_spot_id = NEW.tourist_spot_id
        AND is_approved = true
      )
    WHERE id = NEW.tourist_spot_id;
  ELSIF TG_OP = 'DELETE' AND OLD.review_type = 'tourist_spot' AND OLD.tourist_spot_id IS NOT NULL THEN
    UPDATE tourist_spots
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE tourist_spot_id = OLD.tourist_spot_id
        AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE tourist_spot_id = OLD.tourist_spot_id
        AND is_approved = true
      )
    WHERE id = OLD.tourist_spot_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tourist spot rating updates
create trigger update_tourist_spot_rating_trigger
after INSERT
or
update
or DELETE on reviews for EACH row
execute FUNCTION update_tourist_spot_rating ();

-- Function to update average rating for events
create or replace function update_event_rating () RETURNS TRIGGER as $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.review_type = 'event' AND NEW.event_id IS NOT NULL THEN
    UPDATE events
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE event_id = NEW.event_id
        AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE event_id = NEW.event_id
        AND is_approved = true
      )
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' AND OLD.review_type = 'event' AND OLD.event_id IS NOT NULL THEN
    UPDATE events
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE event_id = OLD.event_id
        AND is_approved = true
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE event_id = OLD.event_id
        AND is_approved = true
      )
    WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event rating updates
create trigger update_event_rating_trigger
after INSERT
or
update
or DELETE on reviews for EACH row
execute FUNCTION update_event_rating ();

-- Function to update promotion status based on dates
create or replace function update_promotion_status () RETURNS TRIGGER as $$
BEGIN
  IF NEW.start_date <= CURRENT_DATE AND NEW.end_date >= CURRENT_DATE THEN
    NEW.status := 'active';
  ELSIF NEW.start_date > CURRENT_DATE THEN
    NEW.status := 'scheduled';
  ELSIF NEW.end_date < CURRENT_DATE THEN
    NEW.status := 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for promotion status updates
create trigger update_promotion_status_trigger BEFORE INSERT
or
update on promotions for EACH row
execute FUNCTION update_promotion_status ();

-- Function to generate booking number
create or replace function generate_booking_number () RETURNS TRIGGER as $$
BEGIN
  NEW.booking_number := 'BK-' || to_char(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(CAST(floor(random() * 10000) AS TEXT), 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking number generation
create trigger generate_booking_number_trigger BEFORE INSERT on bookings for EACH row
execute FUNCTION generate_booking_number ();

-- Function to update timestamps
create or replace function update_timestamp () RETURNS TRIGGER as $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_timestamp trigger to all tables with updated_at column
create trigger update_timestamp_trigger BEFORE
update on profiles for EACH row
execute FUNCTION update_timestamp ();

-- Add similar triggers for all other tables with updated_at column