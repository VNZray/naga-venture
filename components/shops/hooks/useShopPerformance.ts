// Enhanced custom hook for shop performance optimization utilities with advanced monitoring
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ColorScheme } from '../core/BaseShopSection';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

export const useShopPerformance = () => {
  const colorScheme = useColorScheme();
  const renderMetrics = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    renderMetrics.current.renderCount++;
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderMetrics.current.lastRenderTime = renderTime;
      
      // Calculate moving average
      const { renderCount, averageRenderTime } = renderMetrics.current;
      renderMetrics.current.averageRenderTime = 
        (averageRenderTime * (renderCount - 1) + renderTime) / renderCount;
    };
  });

  // Memoized color scheme for consistency across components
  const colors: ColorScheme = useMemo(() => ({
    textColor: colorScheme === 'dark' ? '#ffffff' : '#1A1A1A',
    subtextColor: colorScheme === 'dark' ? '#94A3B8' : '#6B7280',
    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
    cardBackground: colorScheme === 'dark' ? '#334155' : '#F8FAFB',
    borderColor: colorScheme === 'dark' ? '#475569' : '#E5E7EB',
  }), [colorScheme]);

  // Optimized shop card key extractor with performance tracking
  const getShopKey = useCallback((shop: any, index: number) => {
    return shop.id || shop.name || `shop-${index}`;
  }, []);

  // Optimized distance formatter
  const formatDistance = useCallback((distance: number) => {
    if (!distance || distance < 0) return 'N/A';
    return distance < 1 
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  }, []);

  // Optimized rating formatter
  const formatRating = useCallback((rating: number) => {
    if (!rating || rating < 0) return '0.0';
    return Math.min(rating, 5.0).toFixed(1);
  }, []);
  // Enhanced debounced search handler with cleanup
  const createDebouncedHandler = useCallback((handler: Function, delay: number = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedFn = (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(...args), delay);
    };
    
    // Add cleanup method
    debouncedFn.cancel = () => clearTimeout(timeoutId);
    return debouncedFn;
  }, []);

  // Throttled scroll handler for performance
  const createThrottledHandler = useCallback((handler: Function, limit: number = 100) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        handler(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Memory-efficient list item renderer
  const createOptimizedRenderer = useCallback((renderItem: Function) => {
    const renderedItems = new Map();
    
    return (item: any, index: number) => {
      const key = getShopKey(item, index);
      if (!renderedItems.has(key)) {
        renderedItems.set(key, renderItem(item, index));
      }
      return renderedItems.get(key);
    };
  }, [getShopKey]);

  // Performance metrics getter
  const getPerformanceMetrics = useCallback(() => ({
    ...renderMetrics.current,
  }), []);

  // Cleanup function for performance optimization
  const cleanup = useCallback(() => {
    renderMetrics.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
    };
  }, []);

  return {
    colors,
    getShopKey,
    formatDistance,
    formatRating,
    createDebouncedHandler,
    createThrottledHandler,
    createOptimizedRenderer,
    getPerformanceMetrics,
    cleanup,
  };
};
