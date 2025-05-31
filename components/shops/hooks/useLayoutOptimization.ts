// Shared layout optimization hook for shop components
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCallback, useMemo } from 'react';

// Layout types
export type ShopLayoutType = 'list' | 'grid' | 'carousel' | 'compact';
export type CategoryLayoutType = 'horizontal' | 'grid' | 'hierarchical' | 'vertical';

// Color scheme interface for shop layouts
export interface ShopColorScheme {
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  borderColor: string;
  accentColor: string;
  mutedTextColor: string;
  shadowColor: string;
}

// Category color scheme interface
export interface CategoryColorScheme {
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  iconColor: string;
  shadowColor: string;
  headerTextColor: string;
  viewAllColor: string;
}

// Content color scheme interface
export interface ContentColorScheme {
  backgroundColor: string;
  textColor: string;
  sectionBackgroundColor: string;
  borderColor: string;
  accentColor: string;
  mutedTextColor: string;
  emptyStateColor: string;
  shadowColor: string;
}

/**
 * Hook for optimized color schemes across all shop components
 * Returns memoized color schemes to prevent unnecessary re-renders
 */
export const useShopColorScheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const shopColors: ShopColorScheme = useMemo(() => ({
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    textColor: isDark ? "#ffffff" : "#1f2937",
    cardBackground: isDark ? "#2a2a2a" : "#f8f9fa",
    borderColor: isDark ? "#404040" : "#e9ecef",
    accentColor: isDark ? "#60a5fa" : "#3b82f6",
    mutedTextColor: isDark ? "#9ca3af" : "#6b7280",
    shadowColor: isDark ? "#000000" : "#6b7280",
  }), [isDark]);
  
  const categoryColors: CategoryColorScheme = useMemo(() => ({
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    textColor: isDark ? "#ffffff" : "#1f2937",
    cardBackgroundColor: isDark ? "#2a2a2a" : "#f8f9fa",
    cardBorderColor: isDark ? "#404040" : "#e9ecef",
    iconColor: isDark ? "#60a5fa" : "#3b82f6",
    shadowColor: isDark ? "#000000" : "#6b7280",
    headerTextColor: isDark ? "#ffffff" : "#000000",
    viewAllColor: "#2E5AA7",
  }), [isDark]);
    const contentColors: ContentColorScheme = useMemo(() => ({
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    textColor: isDark ? "#ffffff" : "#1f2937",
    sectionBackgroundColor: isDark ? "#2a2a2a" : "#f8f9fa",
    borderColor: isDark ? "#404040" : "#e9ecef",
    accentColor: isDark ? "#60a5fa" : "#3b82f6",
    mutedTextColor: isDark ? "#9ca3af" : "#6b7280",
    emptyStateColor: isDark ? "#6b7280" : "#9ca3af",
    shadowColor: isDark ? "#000000" : "#6b7280",
  }), [isDark]);
  
  return {
    shopColors,
    categoryColors,
    contentColors,
    isDark,
  };
};

/**
 * Hook for optimized layout calculations
 * Returns memoized layout configurations based on screen dimensions
 */
export const useLayoutCalculations = (
  screenWidth: number,
  layoutType: ShopLayoutType | CategoryLayoutType
) => {
  const calculations = useMemo(() => {
    switch (layoutType) {
      case 'grid':
        // Calculate optimal grid columns based on screen width
        const minItemWidth = 150;
        const padding = 32; // 16px on each side
        const gap = 12;
        const availableWidth = screenWidth - padding;
        const maxColumns = Math.floor((availableWidth + gap) / (minItemWidth + gap));
        const columns = Math.max(2, Math.min(4, maxColumns));
        const itemWidth = (availableWidth - (gap * (columns - 1))) / columns;
        
        return {
          columns,
          itemWidth,
          gap,
          containerPadding: padding / 2,
        };
      
      case 'horizontal':
      case 'carousel':
        return {
          itemWidth: 120,
          gap: 12,
          containerPadding: 16,
          snapToInterval: 132, // itemWidth + gap
        };
      
      case 'hierarchical':
      case 'vertical':
      case 'list':
        return {
          itemWidth: screenWidth - 32,
          gap: 8,
          containerPadding: 16,
        };
      
      case 'compact':
        return {
          itemWidth: 100,
          gap: 8,
          containerPadding: 16,
        };
      
      default:
        return {
          itemWidth: screenWidth - 32,
          gap: 8,
          containerPadding: 16,
        };
    }
  }, [screenWidth, layoutType]);
  
  return calculations;
};

/**
 * Hook for optimized style generation
 * Returns memoized style objects based on layout type and colors
 */
export const useOptimizedStyles = (
  layoutType: ShopLayoutType | CategoryLayoutType,
  colors: ShopColorScheme | CategoryColorScheme | ContentColorScheme,
  customStyles: any = {}
) => {
  const styles = useMemo(() => ({
    container: [
      {
        backgroundColor: colors.backgroundColor,
        flex: 1,
      },
      customStyles.container,
    ],
    item: [
      {
        backgroundColor: (colors as any).cardBackground || (colors as any).cardBackgroundColor || colors.backgroundColor,
        borderColor: (colors as any).borderColor || (colors as any).cardBorderColor,
        shadowColor: colors.shadowColor,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      layoutType === 'grid' && {
        borderRadius: 12,
        padding: 12,
      },
      layoutType === 'horizontal' && {
        borderRadius: 12,
        padding: 12,
        width: 120,
      },
      layoutType === 'list' && {
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
      },
      customStyles.item,
    ],
    text: [
      {
        color: colors.textColor,
        fontSize: 14,
        fontWeight: '500',
      },
      customStyles.text,
    ],
    title: [
      {
        color: colors.textColor,
        fontSize: 18,
        fontWeight: '600',
      },
      customStyles.title,
    ],
  }), [layoutType, colors, customStyles]);
  
  return styles;
};

/**
 * Hook for performance monitoring and optimization
 * Tracks render counts and provides optimization suggestions
 */
export const usePerformanceOptimization = (componentName: string) => {
  const renderCount = useMemo(() => {
    const count = (global as any).__renderCounts?.[componentName] || 0;
    if (!(global as any).__renderCounts) {
      (global as any).__renderCounts = {};
    }
    (global as any).__renderCounts[componentName] = count + 1;
    return count + 1;
  }, [componentName]);
  
  const logRender = useCallback((extraInfo?: string) => {
    if (__DEV__) {
      console.log(`[${componentName}] Render #${renderCount}${extraInfo ? ` - ${extraInfo}` : ''}`);
    }
  }, [componentName, renderCount]);
    const createStableCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
  ) => {
    // Return the callback directly with the provided dependencies
    return callback;
  }, []);
  
  return {
    renderCount,
    logRender,
    createStableCallback,
  };
};

/**
 * Hook for shared layout animation configurations
 * Returns consistent animation timings and configurations
 */
export const useLayoutAnimations = () => {
  const animations = useMemo(() => ({
    fadeIn: {
      opacity: 0,
      duration: 200,
      useNativeDriver: true,
    },
    slideUp: {
      transform: [{ translateY: 20 }],
      opacity: 0,
      duration: 300,
      useNativeDriver: true,
    },
    scaleIn: {
      transform: [{ scale: 0.9 }],
      opacity: 0,
      duration: 250,
      useNativeDriver: true,
    },
    spring: {
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    },
  }), []);
  
  return animations;
};

// Export all hooks for easy import
export default {
  useShopColorScheme,
  useLayoutCalculations,
  useOptimizedStyles,
  usePerformanceOptimization,
  useLayoutAnimations,
};
