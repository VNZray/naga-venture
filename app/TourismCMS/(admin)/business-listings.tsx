import {
  CMSButton,
  CMSDashboardLayout,
  CMSRouteGuard,
  CMSText,
  StatData,
} from '@/components/TourismCMS';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function BusinessListingsScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');

  const businessStats: StatData[] = [
    {
      title: 'Total Businesses',
      value: '156',
      subtitle: 'Registered listings',
      color: '#007AFF',
    },
    {
      title: 'Pending Approval',
      value: '12',
      subtitle: 'Awaiting review',
      color: '#FF9500',
    },
    {
      title: 'Active Listings',
      value: '144',
      subtitle: 'Currently published',
      color: '#34C759',
    },
    {
      title: 'Inactive',
      value: '8',
      subtitle: 'Temporarily disabled',
      color: '#8E8E93',
    },
  ];

  const headerActions = (
    <View style={styles.tabContainer}>
      <CMSButton
        title="Overview"
        variant={activeTab === 'overview' ? 'primary' : 'secondary'}
        size="medium"
        onPress={() => setActiveTab('overview')}
        style={styles.tabButton}
      />
      <CMSButton
        title="Manage"
        variant={activeTab === 'manage' ? 'primary' : 'secondary'}
        size="medium"
        onPress={() => setActiveTab('manage')}
        style={styles.tabButton}
      />
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'manage') {
      return (
        <View style={styles.manageContent}>
          <CMSText type="subtitle" style={styles.sectionTitle}>
            Recent Business Applications
          </CMSText>
          <CMSText
            type="body"
            darkColor="#666"
            style={styles.sectionDescription}
          >
            Review and approve new business registrations
          </CMSText>

          <View style={styles.actionButtons}>
            <CMSButton
              title="Review Applications"
              variant="primary"
              onPress={() => console.log('Review applications')}
              style={styles.actionButton}
            />
            <CMSButton
              title="Export Data"
              variant="secondary"
              onPress={() => console.log('Export data')}
              style={styles.actionButton}
            />
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/business-listings">
      <CMSDashboardLayout
        title="Business Listings"
        subtitle="Manage and monitor all business listings in the tourism directory"
        stats={activeTab === 'overview' ? businessStats : []}
        actions={headerActions}
      >
        {renderContent()}
      </CMSDashboardLayout>
    </CMSRouteGuard>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tabButton: {
    minWidth: 100,
  },
  manageContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
});
