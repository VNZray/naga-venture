// filepath: components/TourismCMS/organisms/CMSPlaceholderPage.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CMSText } from '../atoms';
import { CMSDashboardLayout, CMSRouteGuard } from '../organisms';

interface CMSPlaceholderPageProps {
  /**
   * The title of the page
   */
  title: string;

  /**
   * Subtitle or description for the page
   */
  subtitle?: string;

  /**
   * The route path for permission checking
   */
  routePath: string;

  /**
   * Optional content to display in the page
   */
  children?: React.ReactNode;

  /**
   * Whether this page is coming soon or under development
   */
  status?: 'coming-soon' | 'under-development' | 'placeholder';

  /**
   * Optional features list to display
   */
  features?: string[];

  /**
   * Phase information from the roadmap
   */
  phase?: {
    number: number;
    timeline: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

/**
 * CMSPlaceholderPage - Organism Component
 *
 * A reusable placeholder page component for Tourism CMS sections that are not yet implemented.
 * Provides consistent layout, proper route guarding, and development status information.
 *
 * Features:
 * - Consistent styling across all placeholder pages
 * - Route-based permission checking
 * - Development phase information
 * - Feature preview lists
 * - Professional placeholder content
 *
 * @param title - Page title
 * @param subtitle - Page description
 * @param routePath - Route for permission checking
 * @param children - Optional custom content
 * @param status - Development status
 * @param features - List of planned features
 * @param phase - Development phase information
 */
export const CMSPlaceholderPage: React.FC<CMSPlaceholderPageProps> = ({
  title,
  subtitle,
  routePath,
  children,
  status = 'placeholder',
  features = [],
  phase,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'coming-soon':
        return '#007AFF'; // Blue
      case 'under-development':
        return '#FF9500'; // Orange
      case 'placeholder':
      default:
        return '#8E8E93'; // Gray
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'coming-soon':
        return 'Coming Soon';
      case 'under-development':
        return 'Under Development';
      case 'placeholder':
      default:
        return 'Placeholder Page';
    }
  };

  const getPriorityColor = () => {
    if (!phase) return '#8E8E93';
    switch (phase.priority) {
      case 'HIGH':
        return '#FF3B30'; // Red
      case 'MEDIUM':
        return '#FF9500'; // Orange
      case 'LOW':
        return '#34C759'; // Green
      default:
        return '#8E8E93';
    }
  };

  const renderContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <CMSText
          type="caption"
          style={[styles.statusText, { color: '#FFFFFF' }]}
        >
          {getStatusText()}
        </CMSText>
      </View>

      {/* Phase Information */}
      {phase && (
        <View style={styles.phaseContainer}>
          <View style={styles.phaseHeader}>
            <CMSText type="subtitle" style={styles.phaseTitle}>
              Development Phase {phase.number}
            </CMSText>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor() },
              ]}
            >
              <CMSText
                type="caption"
                style={[styles.priorityText, { color: '#FFFFFF' }]}
              >
                {phase.priority} PRIORITY
              </CMSText>
            </View>
          </View>
          <CMSText type="body" style={styles.timeline}>
            Timeline: {phase.timeline}
          </CMSText>
        </View>
      )}

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <CMSText type="body" style={styles.description}>
          This page is part of the Tourism CMS system and will provide
          comprehensive tools for managing {title.toLowerCase()} functionality.
          The interface will include modern data tables, filtering options, and
          streamlined workflows designed for optimal user experience.
        </CMSText>
      </View>

      {/* Planned Features */}
      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          <CMSText type="subtitle" style={styles.featuresTitle}>
            Planned Features
          </CMSText>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <CMSText type="body" style={styles.featureText}>
                {feature}
              </CMSText>
            </View>
          ))}
        </View>
      )}

      {/* Custom Content */}
      {children && <View style={styles.customContent}>{children}</View>}

      {/* Technical Information */}
      <View style={styles.technicalContainer}>
        <CMSText type="caption" style={styles.technicalTitle}>
          Technical Details
        </CMSText>
        <CMSText type="caption" style={styles.technicalText}>
          • Route: {routePath}
        </CMSText>
        <CMSText type="caption" style={styles.technicalText}>
          • Component: CMSPlaceholderPage
        </CMSText>
        <CMSText type="caption" style={styles.technicalText}>
          • Permission-based access control
        </CMSText>
        <CMSText type="caption" style={styles.technicalText}>
          • Responsive design ready
        </CMSText>
      </View>
    </ScrollView>
  );

  return (
    <CMSRouteGuard routePath={routePath}>
      <CMSDashboardLayout
        title={title}
        subtitle={
          subtitle ||
          `Manage and monitor ${title.toLowerCase()} in the Tourism CMS`
        }
      >
        {renderContent()}
      </CMSDashboardLayout>
    </CMSRouteGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phaseContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseTitle: {
    fontWeight: '600',
    color: '#1D1D1F',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timeline: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    color: '#4B5563',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 8,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    color: '#4B5563',
    lineHeight: 22,
  },
  customContent: {
    marginBottom: 24,
  },
  technicalContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  technicalTitle: {
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  technicalText: {
    color: '#9CA3AF',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
