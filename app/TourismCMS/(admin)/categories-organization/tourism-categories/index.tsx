// filepath: app/TourismCMS/(admin)/categories-organization/tourism-categories/index.tsx
import { CMSPlaceholderPage } from '@/components/TourismCMS/organisms';
import React from 'react';

export default function TourismCategoriesScreen() {
  const features = [
    'Tourism-specific category management',
    'Event and attraction categorization',
    'Tourism activity type management',
    'Seasonal category activation controls',
    'Tourism category analytics and trends',
    'Integration with tourism content',
    'Category-based filtering and search',
    'Tourism taxonomy standardization',
  ];

  const phase = { number: 3, timeline: '3-4 weeks', priority: 'HIGH' as const };

  return (
    <CMSPlaceholderPage
      title="Tourism Categories"
      subtitle="Manage tourism content categorization and taxonomy"
      routePath="/TourismCMS/(admin)/categories-organization/tourism-categories"
      status="coming-soon"
      features={features}
      phase={phase}
    />
  );
}
