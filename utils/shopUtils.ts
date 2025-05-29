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

// Transformation utilities following Single Responsibility Principle
export const transformToFeaturedShop = (shop: ShopData): FeaturedShop => {
  return {
    id: shop.id,
    name: shop.name,
    image: shop.image,
    category: shop.category,
    rating: shop.rating,
  };
};

export const calculateAverageRating = (shops: ShopData[]): number => {
  if (shops.length === 0) return 0;
  const totalRating = shops.reduce((sum, shop) => sum + shop.rating, 0);
  return Math.round((totalRating / shops.length) * 10) / 10;
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

// Filtering utilities following Open/Closed Principle
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
  return shops.filter(shop => {
    // Category filter
    if (criteria.category && shop.category !== criteria.category) {
      return false;
    }

    // Search query filter
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase().trim();
      const matchesSearch = 
        shop.name.toLowerCase().includes(query) ||
        shop.category.toLowerCase().includes(query) ||
        shop.description.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Rating filter
    if (criteria.minRating && shop.rating < criteria.minRating) {
      return false;
    }

    if (criteria.maxRating && shop.rating > criteria.maxRating) {
      return false;
    }

    // Price range filter
    if (criteria.priceRange && shop.priceRange !== criteria.priceRange) {
      return false;
    }

    return true;
  });
};

// Sorting utilities following Interface Segregation Principle
export type ShopSortOption = 'name' | 'rating' | 'category' | 'distance';
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
        // Placeholder for distance sorting
        comparison = 0;
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

// Search utilities with type safety
export const searchShops = (
  shops: ShopData[], 
  query: string, 
  fields: (keyof ShopData)[] = ['name', 'category', 'description']
): ShopData[] => {
  if (!query.trim()) return shops;

  const searchTerm = query.toLowerCase().trim();
  
  return shops.filter(shop => {
    return fields.some(field => {
      const value = shop[field];
      return typeof value === 'string' && value.toLowerCase().includes(searchTerm);
    });
  });
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

  return {
    totalShops: shops.length,
    averageRating: calculateAverageRating(shops),
    categoriesCount: Object.keys(categoryDistribution).length,
    topRatedShop,
    categoryDistribution,
  };
};

// Distance calculation utility (placeholder for future implementation)
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  // Haversine formula implementation would go here
  // For now, return a placeholder value
  return 0;
};

// Format utilities for display
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatRatingCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const formatPriceRange = (priceRange: string): string => {
  return priceRange.replace(/₱/g, '₱ ');
};
