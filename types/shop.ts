// Shop-related TypeScript type definitions

export interface ShopMenuItem {
  item: string;
  price: string;
  description?: string;
  category?: string;
}

export interface ShopLocation {
  latitude: number;
  longitude: number;
}

export interface ShopData {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  rating: number;
  ratingCount: number;
  reviews?: ShopReview[];
  additionalImages?: string[];
  location?: string;
  mapLocation?: {
    latitude: number;
    longitude: number;
  };
  contact?: string;
  website?: string;
  openingHours?: string;
  priceRange?: string;
  menu?: MenuItem[];
  isOpen?: boolean;
  distance?: number;
}

export interface MenuItem {
  item: string;
  price: string;
  description?: string;
}

export interface ShopReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FeaturedShop {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
}

export interface ShopCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  mainCategory?: string;
  mainCategoryName?: string;
  subcategories?: ShopCategory[];
}

export interface MainCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: ShopCategory[];
}

export interface ShopFilter {
  categories: string[];
  minRating: number;
  maxRating: number;
  priceRanges: string[];
  openNow: boolean;
  maxDistance?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'shop' | 'category' | 'location';
  count?: number;
}

export type SortOption = 'rating' | 'distance' | 'name' | 'price';

export interface ShopSearchFilters {
  query: string;
  categories: string[];
  rating: number;
  priceRange: string[];
  sortBy: SortOption;
  openNow: boolean;
}
