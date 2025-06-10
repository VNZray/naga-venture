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

  // TOURISM ADMIN ONLY SECTIONS
  // User Management - Only Tourism Admin
  {
    path: '/TourismCMS/(admin)/user-management',
    allowedRoles: ['tourism_admin'],
  },

  // Bookings & Reservations - Only Tourism Admin
  {
    path: '/TourismCMS/(admin)/bookings-reservations',
    allowedRoles: ['tourism_admin'],
  },

  // System Settings - Only Tourism Admin
  {
    path: '/TourismCMS/(admin)/system-settings',
    allowedRoles: ['tourism_admin'],
  },

  // BUSINESS LISTING MANAGER SECTIONS
  // Business Listings - Tourism Admin + Business Listing Manager
  {
    path: '/TourismCMS/(admin)/business-listings',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },

  // TOURISM CONTENT MANAGER SECTIONS
  // Tourism Content - Tourism Admin + Tourism Content Manager
  {
    path: '/TourismCMS/(admin)/tourism-content',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },

  // Events - Tourism Admin + Tourism Content Manager (part of Tourism Content)
  {
    path: '/TourismCMS/(admin)/events',
    allowedRoles: ['tourism_admin', 'tourism_content_manager'],
  },

  // BUSINESS REGISTRATION MANAGER SECTIONS
  // Business Registrations - Tourism Admin + Business Registration Manager
  {
    path: '/TourismCMS/(admin)/business-registrations',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },

  // Business Owners - Tourism Admin + Business Registration Manager
  {
    path: '/TourismCMS/(admin)/business-owners',
    allowedRoles: ['tourism_admin', 'business_registration_manager'],
  },

  // SHARED SECTIONS (multiple roles)
  // Categories - Tourism Admin + Business Listing Manager + Tourism Content Manager
  {
    path: '/TourismCMS/(admin)/categories',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },

  // Reviews & Ratings - Tourism Admin + Business Listing Manager + Tourism Content Manager
  {
    path: '/TourismCMS/(admin)/reviews-ratings',
    allowedRoles: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
  },

  // Content Approval - Tourism Admin + Business Listing Manager (NOT Tourism Content Manager per RBAC doc)
  {
    path: '/TourismCMS/(admin)/content-approval',
    allowedRoles: ['tourism_admin', 'business_listing_manager'],
  },

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
