// app/(tabs)/(home)/(shops)/index.tsx - Simplified for performance
import { router } from "expo-router";
import { useState } from "react";

import type { ShopData } from "@/types/shop";

import {
  HorizontalCategoriesSection,
  NearYouShops,
  PersonalizedRecommendations,
  ShopDirectoryLayout,
  ShopFeaturedCarousel,
  ShopItemList,
  SpecialOffers,
  TrendingShops
} from "@/components/shops";

import {
  getMainCategoriesForDisplay,
  searchShops
} from "@/utils/shopUtils";
import { destinations, featuredShops, mainCategories } from "../../../Controller/ShopData";

const ShopsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Simple main categories - no useMemo to avoid optimization overhead
  const displayMainCategories = getMainCategoriesForDisplay(mainCategories, 8);
  
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };
  
  const handleViewAllCategories = () => {
    router.push("/(tabs)/(home)/(shops)/shopViewAllCategoryPage");
  };

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  // Simple filtering - no useMemo optimization
  const filteredDestinations: ShopData[] = searchQuery.trim() 
    ? searchShops(destinations, searchQuery)
    : destinations;

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
        {/* Categories - Only show when not searching */}
      {!searchQuery.trim() && (
        <HorizontalCategoriesSection
          categories={displayMainCategories}
          onCategoryPress={handleCategoryPress}
          title="Categories"
          onViewAllPress={handleViewAllCategories}
        />
      )}

      {/* Performance Sections - Only show when not searching */}
      {!searchQuery.trim() && (
        <>
          <PersonalizedRecommendations 
            userPreferences={["Restaurant", "Food"]}
            limit={6}
            showViewAll={true}
          />
          
          <SpecialOffers 
            limit={6}
            showViewAll={true}
          />
          
          <TrendingShops 
            limit={6}
            showViewAll={true}
          />
          
          <NearYouShops 
            userLocation={{ latitude: 13.6218, longitude: 123.1948 }}
            maxDistance={5}
            limit={6}
            showViewAll={true}
          />
        </>
      )}      {/* Discover More */}
      <ShopItemList
        shops={filteredDestinations}
        onShopPress={handleShopPress}
        title={searchQuery.trim() ? "Search Results" : "Discover More"}
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
