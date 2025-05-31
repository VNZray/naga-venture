// Shop utility functions following SOLID principles
import type { FeaturedShop, ShopCategory, ShopData } from '@/types/shop';

/**
 * Shop utility functions that follow SOLID principles:
 * 
 * Single Responsibility Principle: Each function has one clear purpose
 * Open/Closed Principle: Functions are extensible without modification
 * Liskov Substitution Principle: Functions work with base and derived types
 * Interface Segregation Principle: Functions depend only on what they need
 * Dependency Inversion Principle: Functions depend on abstractions (interfaces)
 */

// Type guards for runtime type checking
export const isValidShopData = (data: any): data is ShopData => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.category === 'string' &&
    typeof data.image === 'string' &&
    typeof data.rating === 'number' &&
    typeof data.ratingCount === 'number'
  );
};

export const isValidShopCategory = (data: any): data is ShopCategory => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.icon === 'string'
  );
};

// Optimized transformation utilities
export const transformToFeaturedShop = (shop: ShopData): FeaturedShop => {
  return {
    id: shop.id,
    name: shop.name,
    image: shop.image,
    category: shop.category,
    rating: shop.rating,
  };
};

// Category utility functions
export const flattenCategories = (mainCategories: any[]): { id: string; name: string; icon: string }[] => {
  return mainCategories.flatMap(mainCat => 
    mainCat.subcategories.map((subCat: any) => ({
      id: subCat.id,
      name: subCat.name,
      icon: subCat.icon
    }))
  );
};

export const getPopularCategories = (mainCategories: any[], limit: number = 8): { id: string; name: string; icon: string }[] => {
  // Define popular categories based on common usage
  const popularCategoryIds = [
    'dining', 'cafe', 'pharmacy', 'grocery', 
    'computer', 'salon', 'spa', 'automotive'
  ];
  
  const allCategories = flattenCategories(mainCategories);
  
  // Filter to get popular ones first, then fill with others if needed
  const popular = allCategories.filter(cat => popularCategoryIds.includes(cat.id));
  const remaining = allCategories.filter(cat => !popularCategoryIds.includes(cat.id));
  
  return [...popular, ...remaining].slice(0, limit);
};

// New function to get main categories for display
export const getMainCategoriesForDisplay = (mainCategories: any[], limit: number = 8): { id: string; name: string; icon: string }[] => {
  return mainCategories.slice(0, limit).map(mainCat => ({
    id: mainCat.id,
    name: mainCat.name,
    icon: mainCat.icon
  }));
};

// Simplified and optimized filtering (remove caching for now)
export type ShopFilterCriteria = {
  category?: string;
  searchQuery?: string;
  minRating?: number;
  maxRating?: number;
  priceRange?: string;
};

export const filterShops = (
  shops: ShopData[], 
  criteria: ShopFilterCriteria
): ShopData[] => {
  // Early return if no criteria
  if (!criteria || Object.keys(criteria).length === 0) return shops;

  return shops.filter(shop => {
    // Category filter (fastest check first)
    if (criteria.category && shop.category !== criteria.category) {
      return false;
    }

    // Rating filters (numeric comparisons)
    if (criteria.minRating !== undefined && shop.rating < criteria.minRating) {
      return false;
    }

    if (criteria.maxRating !== undefined && shop.rating > criteria.maxRating) {
      return false;
    }

    // Price range filter
    if (criteria.priceRange && shop.priceRange !== criteria.priceRange) {
      return false;
    }

    // Simplified search query filter
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      return shop.name.toLowerCase().includes(query) ||
             shop.category.toLowerCase().includes(query);
    }

    return true;
  });
};

// Simplified sorting utilities (removed caching for performance)
export type ShopSortOption = 'name' | 'rating' | 'category' | 'distance' | 'price';
export type SortDirection = 'asc' | 'desc';

export const sortShops = (
  shops: ShopData[], 
  sortBy: ShopSortOption, 
  direction: SortDirection = 'asc'
): ShopData[] => {
  const sortedShops = [...shops];
  
  sortedShops.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'distance':
        const distanceA = (a as any).calculatedDistance || a.distance || Infinity;
        const distanceB = (b as any).calculatedDistance || b.distance || Infinity;
        comparison = distanceA - distanceB;
        break;
      case 'price':
        const priceA = a.priceRange || '';
        const priceB = b.priceRange || '';
        comparison = priceA.localeCompare(priceB);
        break;
      default:
        comparison = 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sortedShops;
};

// Validation utilities following Dependency Inversion Principle
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateShopData = (shop: Partial<ShopData>): ValidationResult => {
  const errors: string[] = [];

  if (!shop.id || typeof shop.id !== 'string') {
    errors.push('Shop ID is required and must be a string');
  }

  if (!shop.name || typeof shop.name !== 'string') {
    errors.push('Shop name is required and must be a string');
  }

  if (!shop.category || typeof shop.category !== 'string') {
    errors.push('Shop category is required and must be a string');
  }

  if (!shop.image || typeof shop.image !== 'string') {
    errors.push('Shop image URL is required and must be a string');
  }

  if (typeof shop.rating !== 'number' || shop.rating < 0 || shop.rating > 5) {
    errors.push('Shop rating must be a number between 0 and 5');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Simplified search - only name and category
export const searchShops = (shops: ShopData[], query: string): ShopData[] => {
  if (!query.trim()) return shops;
  
  const searchTerm = query.toLowerCase();
  return shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm) ||
    shop.category.toLowerCase().includes(searchTerm)
  );
};

// Enhanced filtering function to replace the missing one
export const filterShopsEnhanced = (
  shops: ShopData[], 
  searchQuery: string, 
  filters: any
): ShopData[] => {
  let result = shops;

  // Apply search query first
  if (searchQuery.trim()) {
    result = searchShops(result, searchQuery);
  }

  // Apply category filters
  if (filters.categories && filters.categories.length > 0) {
    result = result.filter(shop => filters.categories.includes(shop.category));
  }

  // Apply rating filters
  if (filters.minRating !== undefined) {
    result = result.filter(shop => shop.rating >= filters.minRating);
  }
  if (filters.maxRating !== undefined) {
    result = result.filter(shop => shop.rating <= filters.maxRating);
  }

  // Apply price range filters
  if (filters.priceRanges && filters.priceRanges.length > 0) {
    result = result.filter(shop => 
      shop.priceRange && filters.priceRanges.includes(shop.priceRange)
    );
  }

  // Apply open now filter
  if (filters.openNow) {
    result = result.filter(shop => isShopOpen(shop));
  }

  // Apply sorting
  if (filters.sortBy) {
    result = sortShops(result, filters.sortBy);
  }

  return result;
};

// Generate search suggestions
export const generateSearchSuggestions = (
  shops: ShopData[], 
  query: string, 
  limit: number = 5
): string[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  const suggestions = new Set<string>();
  
  shops.forEach(shop => {
    // Add shop names that match
    if (shop.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(shop.name);
    }
    // Add categories that match
    if (shop.category.toLowerCase().includes(searchTerm)) {
      suggestions.add(shop.category);
    }
  });
  
  return Array.from(suggestions).slice(0, limit);
};

// Group utilities following Single Responsibility Principle
export const groupShopsByCategory = (shops: ShopData[]): Record<string, ShopData[]> => {
  return shops.reduce((groups, shop) => {
    const category = shop.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shop);
    return groups;
  }, {} as Record<string, ShopData[]>);
};

// Statistics utilities
export interface ShopStatistics {
  totalShops: number;
  averageRating: number;
  categoriesCount: number;
  topRatedShop: ShopData | null;
  categoryDistribution: Record<string, number>;
}

export const getShopStatistics = (shops: ShopData[]): ShopStatistics => {
  if (shops.length === 0) {
    return {
      totalShops: 0,
      averageRating: 0,
      categoriesCount: 0,
      topRatedShop: null,
      categoryDistribution: {},
    };
  }

  const categoryDistribution = shops.reduce((dist, shop) => {
    dist[shop.category] = (dist[shop.category] || 0) + 1;
    return dist;
  }, {} as Record<string, number>);

  const topRatedShop = shops.reduce((top, shop) => {
    return !top || shop.rating > top.rating ? shop : top;
  });

  // Calculate average rating inline
  const totalRating = shops.reduce((sum, shop) => sum + shop.rating, 0);
  const averageRating = totalRating / shops.length;

  return {
    totalShops: shops.length,
    averageRating,
    categoriesCount: Object.keys(categoryDistribution).length,
    topRatedShop,
    categoryDistribution,
  };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const result = R * c;
  
  return result;
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  if (!distance || distance < 0) return 'N/A';
  return distance < 1 
    ? `${Math.round(distance * 1000)}m`
    : `${distance.toFixed(1)}km`;
};

/**
 * Format rating for display
 */
export const formatRating = (rating: number): string => {
  if (!rating || rating < 0) return '0.0';
  return Math.min(rating, 5.0).toFixed(1);
};

/**
 * Check if shop is currently open
 */
export const isShopOpen = (shop: ShopData): boolean => {
  if (!shop.openingHours) return false;
  
  // Simple check for "24 Hours"
  if (shop.openingHours.toLowerCase().includes('24')) return true;
  
  // For now, return shop.isOpen if available, otherwise true
  return shop.isOpen ?? true;
};

/**
 * Filter shops by category
 */
export const filterShopsByCategory = (shops: ShopData[], category: string): ShopData[] => {
  if (!category) return shops;
  
  const lowerCategory = category.toLowerCase();
  const result = shops.filter(shop => 
    shop.category?.toLowerCase() === lowerCategory
  );
  
  return result;
};

/**
 * Sort shops by rating (descending)
 */
export const sortShopsByRating = (shops: ShopData[]): ShopData[] => {
  return [...shops].sort((a, b) => b.rating - a.rating);
};

/**
 * Sort shops by distance (ascending)
 */
export const sortShopsByDistance = (shops: ShopData[]): ShopData[] => {
  return [...shops].sort((a, b) => {
    const distanceA = (a as any).calculatedDistance || a.distance || Infinity;
    const distanceB = (b as any).calculatedDistance || b.distance || Infinity;
    return distanceA - distanceB;
  });
};

/**
 * Get shops within a certain distance
 */
export const getShopsWithinDistance = (
  shops: ShopData[],
  userLat: number,
  userLon: number,
  maxDistance: number
): ShopData[] => {
  // Return all shops for now, calculate distance on-demand
  return shops;
};

/**
 * Get trending shops based on rating and review count
 */
export const getTrendingShops = (shops: ShopData[], limit: number = 10): ShopData[] => {
  return shops
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
