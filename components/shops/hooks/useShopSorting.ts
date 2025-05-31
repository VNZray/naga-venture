// Custom hook for shop sorting logic
import type { ShopData } from '@/types/shop';
import { useMemo } from 'react';

export type SortOption = 
  | 'rating-desc'
  | 'rating-asc'
  | 'distance-asc'
  | 'distance-desc'
  | 'name-asc'
  | 'name-desc'
  | 'trending'
  | 'popularity';

export const useShopSorting = (shops: ShopData[], sortBy: SortOption = 'rating-desc') => {
  return useMemo(() => {
    const sortedShops = [...shops];

    switch (sortBy) {
      case 'rating-desc':
        return sortedShops.sort((a, b) => b.rating - a.rating);
      
      case 'rating-asc':
        return sortedShops.sort((a, b) => a.rating - b.rating);
      
      case 'distance-asc':
        return sortedShops.sort((a, b) => {
          const distanceA = (a as any).calculatedDistance || Infinity;
          const distanceB = (b as any).calculatedDistance || Infinity;
          return distanceA - distanceB;
        });
      
      case 'distance-desc':
        return sortedShops.sort((a, b) => {
          const distanceA = (a as any).calculatedDistance || 0;
          const distanceB = (b as any).calculatedDistance || 0;
          return distanceB - distanceA;
        });
      
      case 'name-asc':
        return sortedShops.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'name-desc':
        return sortedShops.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'trending':
        return sortedShops.sort((a, b) => {
          // Trending score based on rating and review count
          const scoreA = a.rating * Math.log(a.ratingCount + 1);
          const scoreB = b.rating * Math.log(b.ratingCount + 1);
          return scoreB - scoreA;
        });
      
      case 'popularity':
        return sortedShops.sort((a, b) => b.ratingCount - a.ratingCount);
      
      default:
        return sortedShops;
    }
  }, [shops, sortBy]);
};
