// filepath: components/TourismCMS/atoms/CMSText.tsx
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export type CMSTextType =
  | 'default'
  | 'title'
  | 'subtitle'
  | 'headerTitle'
  | 'caption'
  | 'body'
  | 'label';

export interface CMSTextProps extends TextProps {
  /**
   * The visual style variant of the text
   */
  type?: CMSTextType;
  /**
   * Color to use in light theme
   */
  lightColor?: string;
  /**
   * Color to use in dark theme
   */
  darkColor?: string;
  /**
   * Text content
   */
  children: React.ReactNode;
}

/**
 * CMS Text Atom
 *
 * A typography component specific to the Tourism CMS.
 * Provides consistent text styling across the CMS interface.
 * Following Atomic Design principles as an atom (basic building block).
 *
 * @param type - The text style variant
 * @param lightColor - Color for light theme
 * @param darkColor - Color for dark theme
 * @param children - Text content
 * @param style - Additional styles
 */
const CMSText: React.FC<CMSTextProps> = React.memo(
  ({ type = 'default', lightColor, darkColor, children, style, ...rest }) => {
    const { theme } = useTheme();

    // Use provided colors or fallback to theme colors
    const color = lightColor || darkColor || theme.colors.text;

    const textStyle = [styles.base, styles[type], { color }, style];

    return (
      <Text style={textStyle} {...rest}>
        {children}
      </Text>
    );
  }
);

CMSText.displayName = 'CMSText';

export default CMSText;

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'System',
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
