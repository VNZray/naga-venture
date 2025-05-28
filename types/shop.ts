// Shop-related TypeScript type definitions

export interface ShopMenuItem {
  item: string;
  price: string;
}

export interface ShopLocation {
  latitude: number;
  longitude: number;
}

export interface ShopData {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  reviews: any[];
  additionalImages: string[];
  location: string;
  mapLocation: ShopLocation;
  contact: string;
  website: string;
  openingHours: string;
  priceRange: string;
  menu: ShopMenuItem[];
}

export interface ShopCategory {
  id: string;
  name: string;
  icon: string;
  shopCount?: number;
}

// For component props that expect specific shapes
export interface Shop {
  id: string;
  name: string;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  price?: string;
  isOpen?: boolean;
  [key: string]: any;
}

export interface FeaturedShop {
  id: string;
  name: string;
  image: string;
  category?: string;
  rating?: number;
  [key: string]: any;
}
