// filepath: app/TourismCMS/(admin)/business-management/business-listings/all-businesses/index.tsx
import { CMSPlaceholderPage } from '@/components/TourismCMS/organisms';
import React from 'react';

/**
 * All Businesses Page
 *
 * Comprehensive view and management of all business listings in the platform.
 */
export default function AllBusinessesScreen() {
  const features = [
    'Complete business directory with advanced filtering',
    'Bulk operations for business management',
    'Business status and verification controls',
    'Detailed business profile views and editing',
    'Business performance metrics and analytics',
    'Export and reporting capabilities',
    'Business categorization and tagging',
    'Integration with Google Maps and location services',
  ];

  const phase = {
    number: 2,
    timeline: '3-4 weeks',
    priority: 'HIGH' as const,
  };
  return (
    <CMSPlaceholderPage
      title="All Businesses"
      subtitle="Comprehensive management of all business listings in the tourism directory"
      routePath="/TourismCMS/(admin)/business-management/business-listings/all-businesses"
      status="under-development"
      features={features}
      phase={phase}
    />
  );
}
