/**
 * Enhanced Supabase type helpers for better developer experience
 * This file provides convenient type aliases and utility types
 * based on the generated database.ts file
 */

import { Database } from './database';

// Table types - convenient aliases for common use
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Business = Database['public']['Tables']['businesses']['Row'];
export type BusinessInsert =
  Database['public']['Tables']['businesses']['Insert'];
export type BusinessUpdate =
  Database['public']['Tables']['businesses']['Update'];

export type TouristSpot = Database['public']['Tables']['tourist_spots']['Row'];
export type TouristSpotInsert =
  Database['public']['Tables']['tourist_spots']['Insert'];
export type TouristSpotUpdate =
  Database['public']['Tables']['tourist_spots']['Update'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export type Booking = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export type RoomType = Database['public']['Tables']['room_types']['Row'];
export type RoomTypeInsert =
  Database['public']['Tables']['room_types']['Insert'];
export type RoomTypeUpdate =
  Database['public']['Tables']['room_types']['Update'];

// Enum types - convenient aliases
export type UserRole = Database['public']['Enums']['user_role'];
export type BusinessType = Database['public']['Enums']['business_type'];
export type BusinessStatus = Database['public']['Enums']['business_status'];
export type BookingStatus = Database['public']['Enums']['booking_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type PaymentMethod = Database['public']['Enums']['payment_method'];
export type EventStatus = Database['public']['Enums']['event_status'];
export type TouristSpotType = Database['public']['Enums']['tourist_spot_type'];
export type TouristSpotStatus =
  Database['public']['Enums']['tourist_spot_status'];
export type ReviewType = Database['public']['Enums']['review_type'];
export type ContentStatus = Database['public']['Enums']['content_status'];
export type ContentType = Database['public']['Enums']['content_type'];
export type PromotionStatus = Database['public']['Enums']['promotion_status'];
export type PageViewType = Database['public']['Enums']['page_view_type'];

// Utility types for common patterns
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? NonNullable<U>
  : never;
export type DbResultErr = { error: string };

// Helper type for Supabase queries
export type SupabaseQuery<T = any> = {
  data: T | null;
  error: any;
};

// Role-based access control types
export type AdminRoles = Extract<UserRole, 'tourism_admin'>;
export type StaffRoles = Extract<
  UserRole,
  | 'tourism_admin'
  | 'business_listing_manager'
  | 'tourism_content_manager'
  | 'business_registration_manager'
>;

export type ContentManagerRoles = Extract<
  UserRole,
  'tourism_admin' | 'tourism_content_manager'
>;

export type BusinessManagerRoles = Extract<
  UserRole,
  'tourism_admin' | 'business_listing_manager'
>;

// Business-related types with relationships
export type BusinessWithImages = Business & {
  business_images?: Database['public']['Tables']['business_images']['Row'][];
};

export type BusinessWithReviews = Business & {
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
};

// Profile with extended data
export type ProfileWithPermissions = Profile & {
  staff_permissions?: Database['public']['Tables']['staff_permissions']['Row'];
};

// Common query response patterns
export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Authentication context types
export type AuthUser = {
  profile: Profile | null;
  session: any; // Supabase Session type
  isLoading: boolean;
  error: Error | null;
};

// Permission checking utility types
export type Permission =
  | 'manage_users'
  | 'manage_businesses'
  | 'manage_content'
  | 'manage_events'
  | 'manage_bookings'
  | 'manage_reviews'
  | 'manage_categories'
  | 'view_analytics'
  | 'system_settings';

export type RolePermissions = {
  [K in UserRole]: Permission[];
};

// Constants for role-based access
export const ROLE_PERMISSIONS: RolePermissions = {
  tourism_admin: [
    'manage_users',
    'manage_businesses',
    'manage_content',
    'manage_events',
    'manage_bookings',
    'manage_reviews',
    'manage_categories',
    'view_analytics',
    'system_settings',
  ],
  business_listing_manager: [
    'manage_businesses',
    'manage_reviews',
    'manage_categories',
    'view_analytics',
  ],
  tourism_content_manager: [
    'manage_content',
    'manage_events',
    'manage_categories',
    'view_analytics',
  ],
  business_registration_manager: ['manage_businesses', 'view_analytics'],
  business_owner: [
    'manage_reviews', // Only for their own business
  ],
  tourist: [],
};

export default Database;
