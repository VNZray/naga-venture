// app/(tabs)/(home)/(shops)/index.jsx - Refactored using composition
import { router } from "expo-router";
import { useMemo, useState } from "react";

import type { FilterOptions } from "@/components/shops/EnhancedSearchBar";
import type { ShopData } from "@/types/shop";

import {
  HorizontalCategoriesSection,
  NearYouShops,
  PersonalizedRecommendations,
  RecentlyViewedShops,
  ShopDirectoryLayout,
  ShopFeaturedCarousel,
  ShopItemList,
  SpecialOffers,
  TrendingShops
} from "@/components/shops";

import {
  filterShopsEnhanced,
  flattenCategories,
  generateSearchSuggestions,
  getMainCategoriesForDisplay
} from "@/utils/shopUtils";
import { destinations, featuredShops, mainCategories } from "../../../Controller/ShopData";


const ShopsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced search filters state
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    minRating: 0,
    maxRating: 5,
    priceRanges: [],
    openNow: false,
    sortBy: 'rating' as const,
  });

  // Simulated user preferences for personalized recommendations
  const userPreferences = {
    favoriteCategories: ['dining', 'cafe', 'shopping'],
    visitedShops: ['1', '3', '5'], // IDs of previously visited shops
    searchHistory: ['coffee', 'restaurants', 'souvenir shops'],
  };

  const displayMainCategories = useMemo(() => getMainCategoriesForDisplay(mainCategories, 8), []);
  
  // Get available categories and price ranges for filters
  const availableCategories = useMemo(() => 
    flattenCategories(mainCategories).map(cat => ({ id: cat.id, name: cat.name })), 
    []
  );
  
  const availablePriceRanges = useMemo(() => {
    const ranges = new Set<string>();
    destinations.forEach(shop => {
      if (shop.priceRange) ranges.add(shop.priceRange);
    });
    return Array.from(ranges).sort();
  }, []);

  // Generate search suggestions based on current query
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return generateSearchSuggestions(destinations, searchQuery, 5);
  }, [searchQuery]);
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };
  
  const handleViewAllCategories = () => {
    router.push("/(tabs)/(home)/(shops)/shopViewAllCategoryPage");
  };
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };
    const filteredDestinations: ShopData[] = useMemo(() => {
    // Use enhanced filtering when search query or filters are active
    if (searchQuery.trim() || filters.categories.length > 0 || filters.priceRanges.length > 0 || filters.openNow) {
      return filterShopsEnhanced(destinations, searchQuery, filters);
    }
    return destinations;
  }, [searchQuery, filters]);
  

  const featuredContent = (
    <ShopFeaturedCarousel
      data={featuredShops}
      onItemPress={handleShopPress}
      height={200}
    />
  );  return (
    <ShopDirectoryLayout
      searchPlaceholder="Search shops..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showFeaturedSection={true}
      featuredTitle="Featured Shops"
      featuredContent={featuredContent}
      useEnhancedSearch={true}
      searchSuggestions={searchSuggestions}
      filters={filters}
      onFiltersChange={setFilters}
      availableCategories={availableCategories}      availablePriceRanges={availablePriceRanges}    >      {/* Categories - Only show when not searching */}
      {!searchQuery.trim() && (
        <HorizontalCategoriesSection
          categories={displayMainCategories}
          onCategoryPress={handleCategoryPress}
          title="Categories"
          onViewAllPress={handleViewAllCategories}
        />
      )}

      {/* Personalized Recommendations */}
      <PersonalizedRecommendations 
        shops={destinations} 
        onShopPress={handleShopPress}
        userPreferences={userPreferences}
        limit={6}
      />

      {/* Special Offers */}
      <SpecialOffers 
        shops={destinations} 
        onShopPress={handleShopPress}
      />

      {/* Trending Shops */}
      <TrendingShops 
        shops={destinations.slice(0, 8)} 
        onShopPress={handleShopPress}
        title="Trending Shops"
      />

      {/* Near You Shops */}
      <NearYouShops 
        shops={destinations} 
        onShopPress={handleShopPress}
        maxDistance={5}
        limit={6}
      />      {/* Recently Viewed Shops */}
      <RecentlyViewedShops onShopPress={handleShopPress} />

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
