// filepath: constants/NavigationConfig.ts
import { NavigationItem } from '@/types/navigation';

/**
 * Tourism CMS Navigation Configuration
 * Based on NAGA VENTURE RBAC Documentation
 * Implements hierarchical sidebar with expandable sections
 */
export const tourismAdminNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    type: 'single',
    path: '/TourismCMS/(admin)/dashboard',
    permissions: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: 'users',
    type: 'dropdown',
    permissions: ['tourism_admin'],
    subsections: [
      {
        id: 'staff-management',
        label: 'Staff Management',
        icon: 'user-shield',
        type: 'single',
        path: '/TourismCMS/(admin)/user-management/staff-management',
        permissions: ['tourism_admin'],
      },
      {
        id: 'business-owners',
        label: 'Business Owners',
        icon: 'briefcase',
        type: 'single',
        path: '/TourismCMS/(admin)/user-management/business-owners',
        permissions: ['tourism_admin', 'business_registration_manager'],
      },
      {
        id: 'tourist-accounts',
        label: 'Tourist Accounts',
        icon: 'user',
        type: 'single',
        path: '/TourismCMS/(admin)/user-management/tourist-accounts',
        permissions: ['tourism_admin'],
      },
    ],
  },
  {
    id: 'business-management',
    label: 'Business Management',
    icon: 'building',
    type: 'dropdown',
    permissions: [
      'tourism_admin',
      'business_listing_manager',
      'business_registration_manager',
    ],
    subsections: [
      {
        id: 'business-listings',
        label: 'Business Listings',
        icon: 'list',
        type: 'dropdown',
        permissions: ['tourism_admin', 'business_listing_manager'],
        subsections: [
          {
            id: 'all-businesses',
            label: 'All Businesses',
            icon: 'building',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-listings/all-businesses',
            permissions: ['tourism_admin', 'business_listing_manager'],
          },
          {
            id: 'accommodations',
            label: 'Accommodations',
            icon: 'bed',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-listings/accommodations',
            permissions: ['tourism_admin', 'business_listing_manager'],
          },
          {
            id: 'shops-services',
            label: 'Shops & Services',
            icon: 'shopping-bag',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-listings/shops-services',
            permissions: ['tourism_admin', 'business_listing_manager'],
          },
          {
            id: 'featured-businesses',
            label: 'Featured Businesses',
            icon: 'star',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-listings/featured-businesses',
            permissions: ['tourism_admin', 'business_listing_manager'],
          },
        ],
      },
      {
        id: 'business-registrations',
        label: 'Business Registrations',
        icon: 'file-plus',
        type: 'dropdown',
        permissions: ['tourism_admin', 'business_registration_manager'],
        badge: { count: 8, type: 'warning' },
        subsections: [
          {
            id: 'pending-registrations',
            label: 'Pending Approvals',
            icon: 'clock',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-registrations/pending-approvals',
            permissions: ['tourism_admin', 'business_registration_manager'],
            badge: { count: 8, type: 'warning' },
          },
          {
            id: 'registration-history',
            label: 'Registration History',
            icon: 'history',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-registrations/registration-history',
            permissions: ['tourism_admin', 'business_registration_manager'],
          },
          {
            id: 'rejected-applications',
            label: 'Rejected Applications',
            icon: 'x-circle',
            type: 'single',
            path: '/TourismCMS/(admin)/business-management/business-registrations/rejected-applications',
            permissions: ['tourism_admin', 'business_registration_manager'],
          },
        ],
      },
      {
        id: 'business-analytics',
        label: 'Business Analytics',
        icon: 'trending-up',
        type: 'single',
        path: '/TourismCMS/(admin)/business-management/business-analytics',
        permissions: ['tourism_admin', 'business_listing_manager'],
      },
    ],
  },
  {
    id: 'tourism-content',
    label: 'Tourism Content',
    icon: 'map',
    type: 'dropdown',
    permissions: ['tourism_admin', 'tourism_content_manager'],
    subsections: [
      {
        id: 'tourist-spots',
        label: 'Tourist Spots',
        icon: 'map-pin',
        type: 'single',
        path: '/TourismCMS/(admin)/tourism-content/tourist-spots',
        permissions: ['tourism_admin', 'tourism_content_manager'],
      },
      {
        id: 'events-management',
        label: 'Events Management',
        icon: 'calendar',
        type: 'single',
        path: '/TourismCMS/(admin)/tourism-content/events-management',
        permissions: ['tourism_admin', 'tourism_content_manager'],
      },
      {
        id: 'promotions',
        label: 'Promotions',
        icon: 'gift',
        type: 'single',
        path: '/TourismCMS/(admin)/tourism-content/promotions',
        permissions: ['tourism_admin', 'tourism_content_manager'],
      },
    ],
  },
  {
    id: 'content-management',
    label: 'Content Management',
    icon: 'file-text',
    type: 'dropdown',
    permissions: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
    subsections: [
      {
        id: 'content-approval',
        label: 'Content Approval',
        icon: 'check-circle',
        type: 'single',
        path: '/TourismCMS/(admin)/content-management/content-approval',
        permissions: [
          'tourism_admin',
          'business_listing_manager',
          'tourism_content_manager',
        ],
        badge: { count: 12, type: 'info' },
      },
      {
        id: 'reviews-ratings',
        label: 'Reviews & Ratings',
        icon: 'star',
        type: 'single',
        path: '/TourismCMS/(admin)/content-management/reviews-ratings',
        permissions: [
          'tourism_admin',
          'business_listing_manager',
          'tourism_content_manager',
        ],
        badge: { count: 4, type: 'error' },
      },
    ],
  },
  {
    id: 'categories',
    label: 'Categories & Organization',
    icon: 'folder',
    type: 'dropdown',
    permissions: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
    ],
    subsections: [
      {
        id: 'business-categories',
        label: 'Business Categories',
        icon: 'tag',
        type: 'single',
        path: '/TourismCMS/(admin)/categories-organization/business-categories',
        permissions: ['tourism_admin', 'business_listing_manager'],
      },
      {
        id: 'tourism-categories',
        label: 'Tourism Categories',
        icon: 'compass',
        type: 'single',
        path: '/TourismCMS/(admin)/categories-organization/tourism-categories',
        permissions: ['tourism_admin', 'tourism_content_manager'],
      },
    ],
  },
  {
    id: 'bookings-finance',
    label: 'Bookings & Finance',
    icon: 'credit-card',
    type: 'dropdown',
    permissions: ['tourism_admin'],
    subsections: [
      {
        id: 'booking-management',
        label: 'Booking Management',
        icon: 'calendar-check',
        type: 'single',
        path: '/TourismCMS/(admin)/bookings-finance/booking-management',
        permissions: ['tourism_admin'],
      },
      {
        id: 'financial-overview',
        label: 'Financial Overview',
        icon: 'dollar-sign',
        type: 'single',
        path: '/TourismCMS/(admin)/bookings-finance/financial-overview',
        permissions: ['tourism_admin'],
      },
    ],
  },
  {
    id: 'analytics-reporting',
    label: 'Analytics & Reporting',
    icon: 'bar-chart',
    type: 'dropdown',
    permissions: [
      'tourism_admin',
      'business_listing_manager',
      'tourism_content_manager',
      'business_registration_manager',
    ],
    subsections: [
      {
        id: 'platform-analytics',
        label: 'Platform Analytics',
        icon: 'activity',
        type: 'single',
        path: '/TourismCMS/(admin)/analytics-reporting/platform-analytics',
        permissions: ['tourism_admin'],
      },
      {
        id: 'business-analytics-detail',
        label: 'Business Performance',
        icon: 'trending-up',
        type: 'single',
        path: '/TourismCMS/(admin)/analytics-reporting/business-analytics-detail',
        permissions: ['tourism_admin', 'business_listing_manager'],
      },
      {
        id: 'tourism-analytics',
        label: 'Tourism Analytics',
        icon: 'map',
        type: 'single',
        path: '/TourismCMS/(admin)/analytics-reporting/tourism-analytics',
        permissions: ['tourism_admin', 'tourism_content_manager'],
      },
      {
        id: 'registration-analytics',
        label: 'Registration Metrics',
        icon: 'user-plus',
        type: 'single',
        path: '/TourismCMS/(admin)/analytics-reporting/registration-analytics',
        permissions: ['tourism_admin', 'business_registration_manager'],
      },
    ],
  },
  {
    id: 'system-administration',
    label: 'System Administration',
    icon: 'settings',
    type: 'dropdown',
    permissions: ['tourism_admin'],
    subsections: [
      {
        id: 'system-settings',
        label: 'System Settings',
        icon: 'sliders',
        type: 'single',
        path: '/TourismCMS/(admin)/system-administration/system-settings',
        permissions: ['tourism_admin'],
      },
      {
        id: 'api-management',
        label: 'API Management',
        icon: 'link',
        type: 'single',
        path: '/TourismCMS/(admin)/system-administration/api-management',
        permissions: ['tourism_admin'],
      },
      {
        id: 'security-backup',
        label: 'Security & Backup',
        icon: 'shield',
        type: 'single',
        path: '/TourismCMS/(admin)/system-administration/security-backup',
        permissions: ['tourism_admin'],
      },
    ],
  },
];

// Navigation configurations for other roles
export const businessListingManagerNavigation: NavigationItem[] =
  tourismAdminNavigation.filter((item) =>
    item.permissions.includes('business_listing_manager')
  );

export const tourismContentManagerNavigation: NavigationItem[] =
  tourismAdminNavigation.filter((item) =>
    item.permissions.includes('tourism_content_manager')
  );

export const businessRegistrationManagerNavigation: NavigationItem[] =
  tourismAdminNavigation.filter((item) =>
    item.permissions.includes('business_registration_manager')
  );
