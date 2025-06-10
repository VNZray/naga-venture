// filepath: components/TourismCMS/organisms/CMSDashboardLayout.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { CMSText } from '../atoms';
import { CMSStatCard } from '../molecules';

export interface StatData {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export interface CMSDashboardLayoutProps {
  title: string;
  subtitle?: string;
  stats?: StatData[];
  children?: React.ReactNode;
  actions?: React.ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * CMS Dashboard Layout Organism
 *
 * A standardized layout for TourismCMS dashboard pages.
 * Provides consistent structure with header, stats, and content areas.
 * Following Atomic Design principles as an organism.
 *
 * @param title - Main page title
 * @param subtitle - Optional page subtitle/description
 * @param stats - Array of statistics to display
 * @param children - Main content area
 * @param actions - Action buttons/controls
 * @param containerStyle - Additional container styling
 */
const CMSDashboardLayout: React.FC<CMSDashboardLayoutProps> = React.memo(
  ({ title, subtitle, stats = [], children, actions, containerStyle }) => {
    return (
      <ScrollView style={[styles.container, containerStyle]}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <CMSText type="title" darkColor="#000" style={styles.title}>
              {title}
            </CMSText>
            {subtitle && (
              <CMSText type="body" darkColor="#666" style={styles.subtitle}>
                {subtitle}
              </CMSText>
            )}
          </View>

          {actions && <View style={styles.headerActions}>{actions}</View>}
        </View>

        {/* Statistics Section */}
        {stats.length > 0 && (
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <CMSStatCard
                  key={`stat-${index}`}
                  title={stat.title}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  color={stat.color}
                  style={styles.statCard}
                />
              ))}
            </View>
          </View>
        )}

        {/* Content Section */}
        {children && <View style={styles.content}>{children}</View>}
      </ScrollView>
    );
  }
);

CMSDashboardLayout.displayName = 'CMSDashboardLayout';

export default CMSDashboardLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerText: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginTop: 4,
  },
  headerActions: {
    marginLeft: 16,
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 200,
  },
  content: {
    padding: 20,
  },
});
