// filepath: app/TourismCMS/(admin)/bookings-finance/financial-overview/index.tsx
import { CMSPlaceholderPage } from '@/components/TourismCMS/organisms';
import React from 'react';

export default function FinancialOverviewScreen() {
  const features = [
    'Revenue tracking and financial dashboards',
    'Commission management and calculations',
    'Payment analytics and transaction monitoring',
    'Financial reporting and export capabilities',
    'Invoice generation and management',
    'Tax calculation and compliance tools',
    'Financial dispute resolution tracking',
    'Integration with payment gateways and accounting systems',
  ];

  const phase = {
    number: 6,
    timeline: '3-4 weeks',
    priority: 'MEDIUM' as const,
  };

  return (
    <CMSPlaceholderPage
      title="Financial Overview"
      subtitle="Revenue tracking, commission management, and financial analytics"
      routePath="/TourismCMS/(admin)/bookings-finance/financial-overview"
      status="coming-soon"
      features={features}
      phase={phase}
    />
  );
}
