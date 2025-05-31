// Custom hook for shop navigation and interaction logic
import { router } from 'expo-router';
import { useCallback } from 'react';

export const useShopNavigation = () => {
  // Navigate to shop details
  const navigateToShop = useCallback((shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/${shopId}`);
  }, []);

  // Navigate to shops list with category filter
  const navigateToCategory = useCallback((category: string) => {
    router.push({
      pathname: '/(tabs)/(home)/(shops)',
      params: { category }
    });
  }, []);

  // Navigate to nearby shops
  const navigateToNearbyShops = useCallback(() => {
    router.push('/(tabs)/(home)/(shops)/near-you');
  }, []);
  // Navigate to shop search
  const navigateToSearch = useCallback((query?: string) => {
    router.push({
      pathname: '/(tabs)/(home)/(shops)',
      params: query ? { q: query } : undefined
    });
  }, []);

  // Navigate to offers page
  const navigateToOffers = useCallback(() => {
    router.push('/(tabs)/(home)/(shops)/offers');
  }, []);

  return {
    navigateToShop,
    navigateToCategory,
    navigateToNearbyShops,
    navigateToSearch,
    navigateToOffers,
  };
};
