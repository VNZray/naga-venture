// filepath: hooks/useTheme.ts
/**
 * Tourism CMS Theme Hook
 * Based on ComprehensiveStyleGuide.md
 * Provides consistent color palette without light/dark mode switching
 */
export function useTheme() {
  // Fixed color palette based on ComprehensiveStyleGuide.md
  const theme = {
    colors: {
      // Primary Brand Colors
      primary: '#0A1B47', // Primary Color - Brand Headings, Navigation Backgrounds
      accent: '#2E5AA7', // Accent Color - Primary Buttons, Links, Interactive Elements
      active: '#1F4C85', // Active State Color - Selected Navigation Items
      complementary: '#D67F35', // Complementary Color - Alert Banners, Highlights

      // Text Colors
      text: '#0A1B47', // Primary text using brand color
      textSecondary: '#6C757D', // Neutral 500 - Secondary Text, Labels
      textMuted: '#6C757D', // Same as secondary for consistency

      // Background Colors
      background: '#FFFFFF', // Background - Main Content Background
      backgroundSecondary: '#F8F9FA', // Neutral 100 - Subtle Backgrounds
      backgroundCard: '#F8F8F8', // Card Background - Content Containers

      // UI Colors
      border: '#E9ECEF', // Neutral 200 - Borders, Input Fields
      borderLight: '#F8F9FA', // Neutral 100 - Subtle dividers

      // Interactive States
      hover: '#1A3F7A', // Hover Button - Primary Button Hover State
      primaryLight: '#E3F2FD', // Light variant for selected states

      // Semantic Colors
      success: '#2E7D32', // Success - Success Messages, Valid States
      warning: '#E58A3B', // Warning - Warnings, Non-Critical Alerts
      error: '#C62828', // Destructive - Error Messages, Critical Alerts
      info: '#2E5AA7', // Using accent color for info

      // Secondary Interactive
      secondaryButton: '#E3E6EB', // Secondary Button Background
      secondaryButtonHover: '#D1D5DB', // Secondary Button Hover
      disabled: 'rgba(151, 151, 151, 0.5)', // Disabled State

      // Neutral Variations
      neutral100: '#F8F9FA',
      neutral200: '#E9ECEF',
      neutral300: '#DEE2E6',
      neutral500: '#6C757D',

      // Icon colors
      icon: '#6C757D', // Default icon color
      iconActive: '#0A1B47', // Active icon color
    },

    // Font weights
    fontWeights: {
      light: '300' as const,
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },

    // Spacing scale
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },

    // Border radius scale
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 999,
    },

    // Shadow presets
    shadows: {
      sm: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    },
  };
  return {
    theme,
    // Fixed color scheme - no light/dark mode switching
    colorScheme: 'light' as const,
    isDark: false,
    isLight: true,
  };
}
