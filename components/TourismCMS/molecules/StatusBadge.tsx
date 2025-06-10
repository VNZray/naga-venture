// filepath: components/TourismCMS/molecules/StatusBadge.tsx
import { BusinessStatus } from '@/types/supabase';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * StatusBadge - Molecule Component
 *
 * A reusable status badge that displays business status with appropriate colors.
 * Following atomic design principles as a molecule (combination of atoms).
 */

interface StatusBadgeProps {
  status: BusinessStatus | string;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const StatusBadge: React.FC<StatusBadgeProps> = memo(
  ({ status, size = 'medium', style }) => {
    const getStatusConfig = (status: string) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return {
            label: 'Approved',
            backgroundColor: '#E7F5E7',
            textColor: '#1B5E1F',
            borderColor: '#34C759',
          };
        case 'pending':
          return {
            label: 'Pending',
            backgroundColor: '#FFF3CD',
            textColor: '#856404',
            borderColor: '#FFC107',
          };
        case 'rejected':
          return {
            label: 'Rejected',
            backgroundColor: '#F8D7DA',
            textColor: '#721C24',
            borderColor: '#DC3545',
          };
        case 'inactive':
          return {
            label: 'Inactive',
            backgroundColor: '#E2E3E5',
            textColor: '#495057',
            borderColor: '#6C757D',
          };
        default:
          return {
            label: status.charAt(0).toUpperCase() + status.slice(1),
            backgroundColor: '#E2E3E5',
            textColor: '#495057',
            borderColor: '#6C757D',
          };
      }
    };

    const getSizeStyles = (size: string) => {
      switch (size) {
        case 'small':
          return {
            container: styles.containerSmall,
            text: styles.textSmall,
          };
        case 'large':
          return {
            container: styles.containerLarge,
            text: styles.textLarge,
          };
        default:
          return {
            container: styles.containerMedium,
            text: styles.textMedium,
          };
      }
    };

    const config = getStatusConfig(status);
    const sizeStyles = getSizeStyles(size);

    return (
      <View
        style={[
          styles.container,
          sizeStyles.container,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
          style,
        ]}
      >
        <Text
          style={[styles.text, sizeStyles.text, { color: config.textColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {config.label}
        </Text>
      </View>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Size variations
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  containerMedium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  text: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Text size variations
  textSmall: {
    fontSize: 10,
    lineHeight: 12,
  },
  textMedium: {
    fontSize: 12,
    lineHeight: 14,
  },
  textLarge: {
    fontSize: 14,
    lineHeight: 16,
  },
});
