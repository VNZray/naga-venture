// app/(tabs)/(home)/(shops)/index.jsx - Refactored using composition
import { router } from "expo-router";
import { useMemo, useState } from "react";

// Import our shop-specific composable components
import {
  ShopCategoriesSection,
  ShopDirectoryLayout,
  ShopFeaturedCarousel,
  ShopItemList
} from "@/components/shops";

// Import data
import { categories, destinations, featuredShops } from "../../../Controller/ShopData";

/**
 * ShopsDirectory - Refactored using shop-specific composition patterns
 * 
 * This demonstrates the power of composition specifically for shops:
 * 1. ShopDirectoryLayout handles shop directory structure
 * 2. ShopFeaturedCarousel handles the featured shops carousel
 * 3. ShopCategoriesSection handles shop category display
 * 4. ShopItemList handles the shop listings with shop-specific features
 * 
 * The main component focuses on:
 * - Shop data management and filtering
 * - Shop navigation logic
 * - Composing the shop-specific layout components together
 */
const ShopsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation handlers
  const handleCategoryPress = (categoryId) => {
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };

  const handleShopPress = (shopId) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  // Filter destinations based on search
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;
    
    const query = searchQuery.toLowerCase().trim();
    return destinations.filter(destination => 
      destination.name.toLowerCase().includes(query) ||
      destination.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  // Prepare featured carousel content
  const featuredContent = (
    <ShopFeaturedCarousel
      data={featuredShops}
      onItemPress={handleShopPress}
      height={200}
    />
  );

  return (
    <ShopDirectoryLayout
      searchPlaceholder="Search shops..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFeaturedSection={true}
      featuredTitle="Featured Shops"
      featuredContent={featuredContent}
    >
      {/* Main Content - Uses composition via children prop */}
      
      {/* Categories Section - Only show when not searching */}
      {!searchQuery.trim() && (
        <ShopCategoriesSection
          categories={categories}
          onCategoryPress={handleCategoryPress}
          title="Shop Categories"
        />
      )}

      {/* Shops List - Show filtered results when searching, all shops otherwise */}
      <ShopItemList
        shops={filteredDestinations}
        onShopPress={handleShopPress}
        title={searchQuery.trim() ? "Search Results" : "All Shops"}
        showRating={true}
        showCategory={true}
        showDistance={false}
        showPrice={false}
        showOpenStatus={false}
        emptyMessage={
          searchQuery.trim() 
            ? `No shops found for "${searchQuery}"`
            : "No shops available"
        }
      />
    </ShopDirectoryLayout>
  );
};

export default ShopsDirectory;
