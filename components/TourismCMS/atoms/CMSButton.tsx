// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\TourismCMS\atoms\CMSButton.tsx
import { FontAwesome } from '@expo/vector-icons';
import React, { memo } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

/**
 * CMS Button Atom
 * Specialized button component for TourismCMS interface
 * Follows design system and provides consistent styling
 */

interface CMSButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconSize?: number;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export type { CMSButtonProps };

const CMSButton: React.FC<CMSButtonProps> = memo(
  ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    iconSize = 16,
    fullWidth = false,
    style,
  }) => {
    const buttonStyles = [
      styles.base,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabled,
      style,
    ];

    const textStyles = [
      styles.text,
      styles[`${variant}Text`],
      styles[`${size}Text`],
      (disabled || loading) && styles.disabledText,
    ];

    // Get icon color based on variant
    const getIconColor = () => {
      switch (variant) {
        case 'primary':
        case 'danger':
          return '#fff';
        case 'secondary':
          return '#007AFF';
        case 'tertiary':
          return '#495057';
        default:
          return '#007AFF';
      }
    };

    return (
      <Pressable
        style={({ pressed }) => [
          ...buttonStyles,
          pressed && !disabled && !loading && styles.pressed,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === 'primary' || variant === 'danger' ? '#fff' : '#007AFF'
            }
          />
        ) : (
          <>
            {icon && (
              <FontAwesome
                name={icon as any}
                size={iconSize}
                color={getIconColor()}
                style={styles.icon}
              />
            )}
            <Text style={textStyles}>{title}</Text>
          </>
        )}
      </Pressable>
    );
  }
);

CMSButton.displayName = 'CMSButton';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },

  // Variants
  primary: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: '#007AFF',
  },
  tertiary: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  danger: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },

  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // States
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
  },
  secondaryText: {
    color: '#007AFF',
    fontSize: 16,
  },
  tertiaryText: {
    color: '#495057',
    fontSize: 16,
  },
  dangerText: {
    color: '#fff',
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.7,
  },

  icon: {
    marginRight: 8,
  },
});

export default CMSButton;
