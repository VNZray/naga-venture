// Layout components exports - Clean organized structure

// Base Components (Unified Pattern)
export { default as BaseCategorySection } from './base/BaseCategorySection';
export { default as BaseContentSection } from './base/BaseContentSection';

// Category Layout Components
export { default as CategoriesSection } from './categories/CategoriesSection';
export { default as ShopCategoriesSection } from './categories/ShopCategoriesSection';

// Content Layout Components
export { default as ShopDetailsContent } from './content/ShopDetailsContent';
export { default as ShopMenuContent } from './content/ShopMenuContent';
export { default as ShopReviewsContent } from './content/ShopReviewsContent';

// Page Layout Components
export { default as ShopDetailLayout } from './pages/ShopDetailLayout';
export { default as ShopDirectoryLayout } from './pages/ShopDirectoryLayout';
export { default as SubCategoryPageLayout } from './pages/SubCategoryPageLayout';

// Utility Layout Components
export { default as ShopCategoryGrid } from './utils/ShopCategoryGrid';
export { default as ShopFeaturedCarousel } from './utils/ShopFeaturedCarousel';
export { default as ShopItemList } from './utils/ShopItemList';
export { default as ShopTabContainer } from './utils/ShopTabContainer';

// Type exports for TypeScript support
export type { CategoryLayoutType } from './base/BaseCategorySection';
export type { ContentType } from './base/BaseContentSection';

