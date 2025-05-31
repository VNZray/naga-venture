// Enhanced custom hook for shop filtering and search logic with performance optimizations
import type { ShopData } from '@/types/shop';
import { useCallback, useMemo, useState } from 'react';

export interface FilterOptions {
  category?: string;
  minRating?: number;
  maxDistance?: number;
  priceRange?: string;
  searchQuery?: string;
  isOpen?: boolean;
}

interface UseShopFilteringReturn {
  filteredShops: ShopData[];
  searchQuery: string;
  filters: Omit<FilterOptions, 'searchQuery'>;
  handleSearch: (query: string) => void;
  setFilter: (key: keyof Omit<FilterOptions, 'searchQuery'>, value: any) => void;
  clearFilters: () => void;
  removeFilter: (key: keyof Omit<FilterOptions, 'searchQuery'>) => void;
  getFilterOptions: () => {
    categories: string[];
    ratings: number[];
    distances: number[];
    priceRanges: string[];
  };
  stats: {
    total: number;
    filtered: number;
    hasActiveFilters: boolean;
  };
}

export const useShopFiltering = (shops: ShopData[] = []): UseShopFilteringReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Omit<FilterOptions, 'searchQuery'>>({});

  // Memoized search logic
  const searchShops = useMemo(() => {
    if (!searchQuery.trim()) return shops;
    
    const query = searchQuery.toLowerCase();
    return shops.filter(shop =>
      shop.name?.toLowerCase().includes(query) ||
      shop.description?.toLowerCase().includes(query) ||
      shop.category?.toLowerCase().includes(query) ||
      shop.location?.toLowerCase().includes(query)
    );
  }, [shops, searchQuery]);

  // Enhanced filter logic with performance optimizations
  const filteredShops = useMemo(() => {
    let result = searchShops;

    // Filter by category
    if (filters.category) {
      result = result.filter(shop => 
        shop.category?.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Filter by minimum rating
    if (filters.minRating) {
      result = result.filter(shop => 
        (shop.rating || 0) >= filters.minRating!
      );
    }

    // Filter by maximum distance
    if (filters.maxDistance) {
      result = result.filter(shop => {
        const distance = (shop as any).calculatedDistance || shop.distance;
        return distance !== undefined && distance <= filters.maxDistance!;
      });
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter(shop => 
        shop.priceRange === filters.priceRange
      );
    }

    // Filter by open status
    if (filters.isOpen !== undefined) {
      result = result.filter(shop => 
        shop.isOpen === filters.isOpen
      );
    }

    return result;
  }, [searchShops, filters]);

  // Optimized search handler
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Optimized filter handlers
  const setFilter = useCallback((key: keyof Omit<FilterOptions, 'searchQuery'>, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const removeFilter = useCallback((key: keyof Omit<FilterOptions, 'searchQuery'>) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Get unique values for filter options with memoization
  const getFilterOptions = useCallback(() => ({
    categories: [...new Set(shops.map(shop => shop.category).filter(Boolean))],
    ratings: [1, 2, 3, 4, 5],
    distances: [1, 2, 5, 10, 20],
    priceRanges: [...new Set(shops.map(shop => shop.priceRange).filter(Boolean))],
  }), [shops]);

  // Performance statistics
  const stats = useMemo(() => ({
    total: shops.length,
    filtered: filteredShops.length,
    hasActiveFilters: Object.keys(filters).length > 0 || searchQuery.length > 0,
  }), [shops.length, filteredShops.length, filters, searchQuery]);

  return {
    filteredShops,
    searchQuery,
    filters,
    handleSearch,
    setFilter,
    clearFilters,
    removeFilter,
    getFilterOptions,
    stats,
  };
};
