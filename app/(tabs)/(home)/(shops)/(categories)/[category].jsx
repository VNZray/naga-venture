// app/(tabs)/(home)/(shops)/(categories)/[category].jsx - Refactored using composition
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from 'react';

// Import shop-specific composable components
import {
  ShopCategoryGrid,
  ShopCategoryLayout
} from "@/components/shops";

// Import the shop data
import { shopsData } from "../../../../Controller/ShopData";

/**
 * CategoryPage - Refactored using shop category composition patterns
 * 
 * This demonstrates the power of composition specifically for shop categories:
 * 1. ShopCategoryLayout handles the category page structure
 * 2. ShopCategoryGrid handles the shop listings display
 * 
 * The main component focuses on:
 * - Category data management and filtering
 * - Category navigation logic  
 * - Composing the shop category layout components together
 */
const CategoryPage = () => {
  const { category: categoryId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  // Define category title based on categoryId
  const getCategoryTitle = (id) => {
    switch (id) {
      case "bars":
        return "Bars & Nightlife";
      case "cafe":
        return "Cafes & Coffee Shops";
      case "dining":
        return "Restaurants & Dining";
      case "souvenir":
        return "Souvenirs & Gifts";
      default:
        return "Shops";
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getCategoryTitle(categoryId),
    });
  }, [navigation, categoryId]);

  // Filter shops based on the categoryId
  const allCategoryItems = useMemo(() => {
    return Object.values(shopsData).filter(
      (item) => item.category === categoryId
    );
  }, [categoryId]);

  const filteredCategoryItems = useMemo(() => {
    if (!searchQuery.trim()) return allCategoryItems;

    const query = searchQuery.toLowerCase().trim();
    return allCategoryItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  }, [searchQuery, allCategoryItems]);

  // Navigation handlers
  const handleShopPress = (shopId) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const categoryTitle = getCategoryTitle(categoryId);
  const showEmptyState = filteredCategoryItems.length === 0;
  const emptyMessage = searchQuery.trim() 
    ? `No ${categoryTitle.toLowerCase()} found matching "${searchQuery}".`
    : `No ${categoryTitle.toLowerCase()} available.`;

  return (
    <ShopCategoryLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      categoryTitle={categoryTitle}
      showEmptyState={showEmptyState}
      emptyMessage={emptyMessage}
    >
      <ShopCategoryGrid
        shops={filteredCategoryItems}
        onShopPress={handleShopPress}
      />
    </ShopCategoryLayout>
  );
};

export default CategoryPage;
