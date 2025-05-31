// Custom hook for shop component animations and transitions with performance optimizations
import { useCallback, useMemo, useRef } from 'react';

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface UseShopAnimationsReturn {
  fadeInAnimation: (config?: AnimationConfig) => any;
  slideInAnimation: (direction: 'left' | 'right' | 'up' | 'down', config?: AnimationConfig) => any;
  scaleAnimation: (config?: AnimationConfig) => any;
  bounceAnimation: (config?: AnimationConfig) => any;
  staggerAnimation: (items: any[], baseDelay?: number) => any[];
  createLoadingAnimation: () => any;
  createHoverAnimation: () => any;
  createPressAnimation: () => any;
}

export const useShopAnimations = (): UseShopAnimationsReturn => {
  const animationRef = useRef<Map<string, any>>(new Map());

  // Default animation configuration
  const defaultConfig: AnimationConfig = useMemo(() => ({
    duration: 300,
    delay: 0,
    easing: 'ease-out',
  }), []);

  // Fade in animation
  const fadeInAnimation = useCallback((config: AnimationConfig = {}) => {
    const finalConfig = { ...defaultConfig, ...config };
    return {
      opacity: {
        from: 0,
        to: 1,
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: finalConfig.easing,
      },
    };
  }, [defaultConfig]);

  // Slide in animation
  const slideInAnimation = useCallback((
    direction: 'left' | 'right' | 'up' | 'down',
    config: AnimationConfig = {}
  ) => {
    const finalConfig = { ...defaultConfig, ...config };
    const transforms = {
      left: { translateX: { from: -50, to: 0 } },
      right: { translateX: { from: 50, to: 0 } },
      up: { translateY: { from: -50, to: 0 } },
      down: { translateY: { from: 50, to: 0 } },
    };

    return {
      ...transforms[direction],
      opacity: { from: 0, to: 1 },
      duration: finalConfig.duration,
      delay: finalConfig.delay,
      easing: finalConfig.easing,
    };
  }, [defaultConfig]);

  // Scale animation
  const scaleAnimation = useCallback((config: AnimationConfig = {}) => {
    const finalConfig = { ...defaultConfig, ...config };
    return {
      scale: {
        from: 0.8,
        to: 1,
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: finalConfig.easing,
      },
      opacity: { from: 0, to: 1 },
    };
  }, [defaultConfig]);

  // Bounce animation
  const bounceAnimation = useCallback((config: AnimationConfig = {}) => {
    const finalConfig = { ...defaultConfig, ...config };
    return {
      scale: {
        from: 0,
        to: 1,
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      opacity: { from: 0, to: 1 },
    };
  }, [defaultConfig]);

  // Staggered animation for lists
  const staggerAnimation = useCallback((items: any[], baseDelay: number = 100) => {
    return items.map((item, index) => ({
      ...item,
      animationDelay: index * baseDelay,
      ...fadeInAnimation({ delay: index * baseDelay }),
    }));
  }, [fadeInAnimation]);

  // Loading animation (shimmer effect)
  const createLoadingAnimation = useCallback(() => ({
    opacity: {
      from: 0.3,
      to: 1,
      duration: 1000,
      repeat: -1,
      direction: 'alternate',
      easing: 'ease-in-out',
    },
  }), []);

  // Hover animation
  const createHoverAnimation = useCallback(() => ({
    scale: {
      from: 1,
      to: 1.05,
      duration: 200,
      easing: 'ease-out',
    },
    shadowOffset: {
      from: { width: 0, height: 2 },
      to: { width: 0, height: 4 },
    },
    shadowOpacity: {
      from: 0.1,
      to: 0.2,
    },
  }), []);

  // Press animation
  const createPressAnimation = useCallback(() => ({
    scale: {
      from: 1,
      to: 0.95,
      duration: 150,
      easing: 'ease-in',
    },
  }), []);

  return {
    fadeInAnimation,
    slideInAnimation,
    scaleAnimation,
    bounceAnimation,
    staggerAnimation,
    createLoadingAnimation,
    createHoverAnimation,
    createPressAnimation,
  };
};
