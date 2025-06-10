// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\hooks\useRouteGuard.ts
import { useAuth } from '@/context/AuthContext';
import type { Database } from '@/types/database';
import { router } from 'expo-router';
import { useEffect } from 'react';

type UserRole = Database['public']['Enums']['user_role'];

interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
}

// Route permissions configuration following NAGA VENTURE RBAC Documentation exactly
const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Dashboard - All admin roles have access
  {
    path: '/TourismCMS/(admin)/dashboard',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
  },

  // ========== USER MANAGEMENT SECTION ==========
  // User Management Parent - Only Tourism Admin
  {
    path: '/TourismCMS/(admin)/user-management',
    allowedRoles: ['tourism_admin'],
  },
  // Staff Management
  {
    path: '/TourismCMS/(admin)/user-management/staff-management',
    allowedRoles: ['tourism_admin'],
  },
  // Business Owners
  {
    path: '/TourismCMS/(admin)/user-management/business-owners',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },
  // Tourist Accounts
  {
    path: '/TourismCMS/(admin)/user-management/tourist-accounts',
    allowedRoles: ['tourism_admin'],
  },

  // ========== BUSINESS MANAGEMENT SECTION ==========
  // Business Management Parent
  {
    path: '/TourismCMS/(admin)/business-management',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'business_registration_manager',
    ],
  },
  // Business Listings
  {
    path: '/TourismCMS/(admin)/business-management/business-listings/all-businesses',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },
  {
    path: '/TourismCMS/(admin)/business-management/business-listings/accommodations',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },
  {
    path: '/TourismCMS/(admin)/business-management/business-listings/shops-services',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },
  {
    path: '/TourismCMS/(admin)/business-management/business-listings/featured-businesses',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },
  // Business Registrations
  {
    path: '/TourismCMS/(admin)/business-management/business-registrations/pending-approvals',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },
  {
    path: '/TourismCMS/(admin)/business-management/business-registrations/registration-history',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },
  {
    path: '/TourismCMS/(admin)/business-management/business-registrations/rejected-applications',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },
  // Business Analytics
  {
    path: '/TourismCMS/(admin)/business-management/business-analytics',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },

  // ========== TOURISM CONTENT SECTION ==========
  // Tourism Content Parent
  {
    path: '/TourismCMS/(admin)/tourism-content',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },
  // Tourist Spots
  {
    path: '/TourismCMS/(admin)/tourism-content/tourist-spots',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },
  // Events Management
  {
    path: '/TourismCMS/(admin)/tourism-content/events-management',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },
  // Promotions
  {
    path: '/TourismCMS/(admin)/tourism-content/promotions',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },

  // ========== CONTENT MANAGEMENT SECTION ==========
  // Content Management Parent
  {
    path: '/TourismCMS/(admin)/content-management',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },
  // Content Approval
  {
    path: '/TourismCMS/(admin)/content-management/content-approval',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },
  // Reviews & Ratings
  {
    path: '/TourismCMS/(admin)/content-management/reviews-ratings',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },

  // ========== CATEGORIES & ORGANIZATION SECTION ==========
  // Categories Parent
  {
    path: '/TourismCMS/(admin)/categories-organization',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },
  // Business Categories
  {
    path: '/TourismCMS/(admin)/categories-organization/business-categories',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },
  // Tourism Categories
  {
    path: '/TourismCMS/(admin)/categories-organization/tourism-categories',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },

  // ========== BOOKINGS & FINANCE SECTION ==========
  // Bookings & Finance Parent
  {
    path: '/TourismCMS/(admin)/bookings-finance',
    allowedRoles: ['tourism_admin'],
  },
  // Booking Management
  {
    path: '/TourismCMS/(admin)/bookings-finance/booking-management',
    allowedRoles: ['tourism_admin'],
  },
  // Financial Overview
  {
    path: '/TourismCMS/(admin)/bookings-finance/financial-overview',
    allowedRoles: ['tourism_admin'],
  },

  // ========== ANALYTICS & REPORTING SECTION ==========
  // Analytics Parent
  {
    path: '/TourismCMS/(admin)/analytics-reporting',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
  },
  // Platform Analytics
  {
    path: '/TourismCMS/(admin)/analytics-reporting/platform-analytics',
    allowedRoles: ['tourism_admin'],
  },
  // Business Analytics Detail
  {
    path: '/TourismCMS/(admin)/analytics-reporting/business-analytics-detail',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },
  // Tourism Analytics
  {
    path: '/TourismCMS/(admin)/analytics-reporting/tourism-analytics',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },
  // Registration Analytics
  {
    path: '/TourismCMS/(admin)/analytics-reporting/registration-analytics',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },

  // ========== SYSTEM ADMINISTRATION SECTION ==========
  // System Administration Parent
  {
    path: '/TourismCMS/(admin)/system-administration',
    allowedRoles: ['tourism_admin'],
  },
  // System Settings
  {
    path: '/TourismCMS/(admin)/system-administration/system-settings',
    allowedRoles: ['tourism_admin'],
  },
  // API Management
  {
    path: '/TourismCMS/(admin)/system-administration/api-management',
    allowedRoles: ['tourism_admin'],
  },
  // Security & Backup
  {
    path: '/TourismCMS/(admin)/system-administration/security-backup',
    allowedRoles: ['tourism_admin'],
  },

  // ========== LEGACY ROUTES (for backward compatibility) ==========
  // Analytics - All admin roles (but content varies by role)
  {
    path: '/TourismCMS/(admin)/analytics',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
  },
  // System Settings (legacy)
  {
    path: '/TourismCMS/(admin)/system-settings',
    allowedRoles: ['tourism_admin'],
  },
  // API Management (legacy)
  {
    path: '/TourismCMS/(admin)/api-management',
    allowedRoles: ['tourism_admin'],
  },
  // Security & Backup (legacy)
  {
    path: '/TourismCMS/(admin)/security-backup',
    allowedRoles: ['tourism_admin'],
  },
];

/**
 * Hook to check if the current user has permission to access a specific route
 * @param routePath - The route path to check
 * @returns Object containing hasAccess boolean and redirect function
 */
export function useRoutePermission(routePath: string) {
  const { userProfile } = useAuth();

  const hasAccess = () => {
    if (!userProfile?.role) return false;

    const routePermission = ROUTE_PERMISSIONS.find(
      (permission) => permission.path === routePath
    );

    if (!routePermission) {
      // If route is not in permissions config, deny access by default
      console.warn(`Route ${routePath} not found in ROUTE_PERMISSIONS config`);
      return false;
    }

    return routePermission.allowedRoles.includes(userProfile.role);
  };

  return {
    hasAccess: hasAccess(),
    userRole: userProfile?.role || null,
    redirectToUnauthorized: () =>
      router.replace('/TourismCMS/(admin)/unauthorized'),
  };
}

/**
 * Hook that automatically redirects unauthorized users
 * Use this in components that need route protection
 * @param routePath - The route path to protect
 */
export function useRouteGuard(routePath: string) {
  const { user, userProfile, isLoading, isUserProfileLoading } = useAuth();
  const { hasAccess, redirectToUnauthorized } = useRoutePermission(routePath);

  useEffect(() => {
    // Wait for auth to complete loading
    if (isLoading || isUserProfileLoading) return;

    // If no user, redirect to login
    if (!user) {
      router.replace('/TourismCMS/login');
      return;
    }

    // If user but no profile or no access, redirect to unauthorized
    if (!userProfile || !hasAccess) {
      redirectToUnauthorized();
      return;
    }
  }, [
    user,
    userProfile,
    isLoading,
    isUserProfileLoading,
    hasAccess,
    redirectToUnauthorized,
  ]);

  return {
    isLoading: isLoading || isUserProfileLoading,
    hasAccess,
    user,
    userProfile,
  };
}

/**
 * Utility function to check if a user role has access to a specific route
 * Useful for conditional rendering in UI
 * @param userRole - The user role to check
 * @param routePath - The route path to check
 * @returns boolean indicating if the role has access
 */
export function checkRouteAccess(
  userRole: UserRole | null,
  routePath: string
): boolean {
  if (!userRole) return false;

  const routePermission = ROUTE_PERMISSIONS.find(
    (permission) => permission.path === routePath
  );

  if (!routePermission) return false;

  return routePermission.allowedRoles.includes(userRole);
}

export { ROUTE_PERMISSIONS };
export type { RoutePermission, UserRole };
