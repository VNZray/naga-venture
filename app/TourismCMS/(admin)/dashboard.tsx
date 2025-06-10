import {
  CMSDashboardLayout,
  CMSRouteGuard,
  StatData,
} from '@/components/TourismCMS';
import React from 'react';

const Dashboard = () => {
  const dashboardStats: StatData[] = [
    {
      title: 'Total Accommodations',
      value: '12',
      subtitle: 'Active listings',
      color: '#007AFF',
    },
    {
      title: 'Tourist Spots',
      value: '25',
      subtitle: 'Published attractions',
      color: '#34C759',
    },
    {
      title: 'Events',
      value: '8',
      subtitle: 'Upcoming events',
      color: '#FF9500',
    },
    {
      title: 'Shops',
      value: '45',
      subtitle: 'Registered businesses',
      color: '#AF52DE',
    },
  ];

  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/dashboard">
      <CMSDashboardLayout
        title="Tourism CMS Dashboard"
        subtitle="Welcome to the Tourism Content Management System"
        stats={dashboardStats}
      />
    </CMSRouteGuard>
  );
};

export default Dashboard;
