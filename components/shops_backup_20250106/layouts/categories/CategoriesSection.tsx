// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\components\shops\layouts\CategoriesSection.tsx
import React from 'react';
import BaseCategorySection, { type BaseCategoryItem } from '../base/BaseCategorySection';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface HorizontalCategoriesSectionProps {
  categories: CategoryItem[];
  onCategoryPress: (categoryId: string) => void;
  title?: string;
  onViewAllPress?: () => void;
}

/**
 * HorizontalCategoriesSection - FoodPanda-style horizontal scrolling categories
 * 
 * Now powered by BaseCategorySection with horizontal layout.
 * Features:
 * - Horizontal scrolling with smooth navigation
 * - Icon-based design with beautiful styling
 * - Responsive layout that adapts to screen size
 * - Clean, modern UI with proper spacing
 * - Support for dark/light themes
 */
const HorizontalCategoriesSection: React.FC<HorizontalCategoriesSectionProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
  onViewAllPress,
}) => {
  // Convert CategoryItem[] to BaseCategoryItem[]
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
      showViewAll={!!onViewAllPress}
      onViewAllPress={onViewAllPress}
      snapToInterval={true}
    />
  );
};

export default HorizontalCategoriesSection;
