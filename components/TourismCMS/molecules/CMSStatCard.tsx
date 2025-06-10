// filepath: components/TourismCMS/molecules/CMSStatCard.tsx
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CMSText } from '../atoms';

export interface CMSStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  style?: ViewStyle;
}

/**
 * CMS Stat Card Molecule
 *
 * A statistics display card for the Tourism CMS dashboard.
 * Shows key metrics with consistent styling.
 * Following Atomic Design principles as a molecule.
 *
 * @param title - The metric title
 * @param value - The metric value to display
 * @param subtitle - Optional subtitle text
 * @param color - Color for the value text (defaults to primary)
 * @param style - Additional styles
 */
const CMSStatCard: React.FC<CMSStatCardProps> = React.memo(
  ({ title, value, subtitle, color = '#007AFF', style }) => {
    return (
      <View style={[styles.container, style]}>
        <CMSText type="subtitle" darkColor="#000" style={styles.title}>
          {title}
        </CMSText>
        <CMSText type="title" darkColor={color} style={styles.value}>
          {value}
        </CMSText>
        {subtitle && (
          <CMSText type="caption" darkColor="#666" style={styles.subtitle}>
            {subtitle}
          </CMSText>
        )}
      </View>
    );
  }
);

CMSStatCard.displayName = 'CMSStatCard';

export default CMSStatCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    marginBottom: 8,
  },
  value: {
    marginBottom: 4,
  },
  subtitle: {
    marginTop: 4,
  },
});
