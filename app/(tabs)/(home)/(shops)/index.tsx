// app/(tabs)/(home)/(shops)/index.jsx - Refactored using composition
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// Import types
import { useColorScheme } from "@/hooks/useColorScheme";
import type { ShopData } from "@/types/shop";

// Import our shop-specific composable components
import {
  HorizontalCategoriesSection,
  ShopDirectoryLayout,
  ShopFeaturedCarousel,
  ShopItemList
} from "@/components/shops";

// Import data
import { getPopularCategories } from "@/utils/shopUtils";
import { destinations, featuredShops, mainCategories } from "../../../Controller/ShopData";

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
  const colorScheme = useColorScheme();
  
  // Get popular categories for horizontal display
  const popularCategories = useMemo(() => getPopularCategories(mainCategories, 12), []);
    // Navigation handlers
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };
  const handleViewAllCategories = () => {
    router.push("/(tabs)/(home)/(shops)/all-categories");
  };

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };
  // Filter destinations based on search
  const filteredDestinations: ShopData[] = useMemo(() => {
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
      featuredContent={featuredContent}    >
      {/* Main Content - Uses composition via children prop */}
      {/* Categories Section - Only show when not searching */}
      {!searchQuery.trim() && (
        <>
          <HorizontalCategoriesSection
            categories={popularCategories}
            onCategoryPress={handleCategoryPress}
            title="Popular Categories"
          />
          
          {/* View All Categories Button */}
          <TouchableOpacity 
            style={[styles.viewAllButton, { 
              backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f8f9fa",
              borderColor: colorScheme === "dark" ? "#404040" : "#e9ecef",
            }]}
            onPress={handleViewAllCategories}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="grid-outline" 
              size={20} 
              color={colorScheme === "dark" ? "#60a5fa" : "#3b82f6"} 
            />
            <Text style={[styles.viewAllText, { 
              color: colorScheme === "dark" ? "#ffffff" : "#000000" 
            }]}>
              View All Categories
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={18} 
              color={colorScheme === "dark" ? "#60a5fa" : "#3b82f6"} 
            />
          </TouchableOpacity>
        </>
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

const styles = StyleSheet.create({
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginHorizontal: 8,
  },
});
