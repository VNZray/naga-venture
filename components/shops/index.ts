// Shop-specific composition components exports - Organized Structure

// Core Components
export { default as BaseShopSection } from './core/BaseShopSection';

// Layout Components - Updated to new organized structure (active components only)
export { default as HorizontalCategoriesSection } from './layouts/categories/CategoriesSection';
export { default as ShopCategoriesSection } from './layouts/categories/ShopCategoriesSection';
export { default as ShopDirectoryLayout } from './layouts/pages/ShopDirectoryLayout';
export { default as ShopFeaturedCarousel } from './layouts/utils/ShopFeaturedCarousel';
export { default as ShopItemList } from './layouts/utils/ShopItemList';
export { default as ShopTabContainer } from './layouts/utils/ShopTabContainer';

// Section Components
export { default as NearYouShops } from './sections/NearYouShops';
export { default as PersonalizedRecommendations } from './sections/PersonalizedRecommendations';
export { default as SpecialOffers } from './sections/SpecialOffers';
export { default as TrendingShops } from './sections/TrendingShops';

// Custom Hooks - Phase 4 Performance Optimization
export * from './hooks';

// Search Components
export { default as EnhancedSearchBar } from './search/EnhancedSearchBar';
export { saveSearchToHistory, default as SearchHistoryManager } from './search/SearchHistoryManager';

// UI Components
export { default as PerformanceMonitor } from './ui/PerformanceMonitor';
export { default as PullToRefresh } from './ui/PullToRefresh';
export { default as ShopSkeleton } from './ui/ShopSkeleton';

// Category page components
export { default as ShopCategoryLayout } from './layouts/pages/SubCategoryPageLayout';
export { default as ShopCategoryGrid } from './layouts/utils/ShopCategoryGrid';

// Detail page components
export { default as ShopDetailsContent } from './layouts/content/ShopDetailsContent';
export { default as ShopMenuContent } from './layouts/content/ShopMenuContent';
export { default as ShopReviewsContent } from './layouts/content/ShopReviewsContent';
export { default as ShopDetailLayout } from './layouts/pages/ShopDetailLayout';

