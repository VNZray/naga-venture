// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\shops\layouts\ShopCategoriesSection.tsx
import type { ShopCategory } from '@/types/shop';
import React from 'react';
import BaseCategorySection, { type BaseCategoryItem } from '../base/BaseCategorySection';

interface ShopCategoriesSectionProps {
  categories: ShopCategory[];
  onCategoryPress: (categoryId: string) => void;
  title?: string;
}

/**
 * ShopCategoriesSection - Shop-specific categories component
 * 
 * Now powered by BaseCategorySection with horizontal layout.
 * Improved UI with horizontal scrolling layout and compact design:
 * - Horizontal scrolling for better space efficiency
 * - Compact card-based design with smaller icons
 * - Modern visual design with shadows
 * - Better dark mode support
 * - Icon + text layout for better readability
 */
const ShopCategoriesSection: React.FC<ShopCategoriesSectionProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
}) => {
  // Convert ShopCategory[] to BaseCategoryItem[]
  const baseCategoryItems: BaseCategoryItem[] = categories.map(item => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
  }));

  return (
    <BaseCategorySection
      categories={baseCategoryItems}
      onCategoryPress={onCategoryPress}
      layoutType="horizontal"
      displayMode="compact"
      title={title}
      showViewAll={false}
      snapToInterval={false}
    />
  );
};

export default ShopCategoriesSection;
