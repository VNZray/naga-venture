// app/(tabs)/(home)/(shops)/(subcategory)/[subcategoryId].tsx - Simplified
import ShopCategoryPage from '@/components/shops/ShopCategoryPage';
import { getCategoryById, shopsData } from '@/Controller/ShopData';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

/**
 * SubcategoryPage - Simple implementation using ShopCategoryPage component
 */
const SubcategoryPage = () => {
  const { subcategoryId } = useLocalSearchParams();

  // Ensure subcategoryId is a string
  const subcategoryIdString = Array.isArray(subcategoryId)
    ? subcategoryId[0]
    : subcategoryId || '';

  // Get the subcategory data
  const subcategoryData = getCategoryById(subcategoryIdString);

  // Get all shops that belong to this subcategory
  const categoryShops = Object.values(shopsData).filter(
    (shop) => shop.category === subcategoryIdString
  );

  if (!subcategoryData) {
    return <ShopCategoryPage category={null} shops={[]} />;
  }

  return (
    <ShopCategoryPage
      category={{
        id: subcategoryData.id,
        name: subcategoryData.name,
        icon: subcategoryData.icon,
      }}
      shops={categoryShops}
    />
  );
};

export default SubcategoryPage;
