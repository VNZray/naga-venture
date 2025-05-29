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

  // Ensure categoryId is a string
  const categoryIdString = Array.isArray(categoryId) ? categoryId[0] : categoryId || "";

  // Define category title based on categoryId
  const getCategoryTitle = (id: string) => {
    switch (id) {
      // Food & Beverage
      case "dining":
        return "Restaurants & Dining";
      case "cafe":
        return "Cafes & Coffee Shops";
      case "bars":
        return "Bars & Nightlife";
      case "fastfood":
        return "Fast Food";
      case "bakery":
        return "Bakeries & Pastries";
      
      // Health & Beauty Services
      case "spa":
        return "Spas & Wellness Centers";
      case "salon":
        return "Salons & Barbershops";
      case "pharmacy":
        return "Pharmacies & Drugstores";
      case "clinic":
        return "Medical Clinics";
      case "dental":
        return "Dental Services";
      case "optical":
        return "Optical Shops";
      
      // Technology & Services
      case "computer":
        return "Computer Shops & IT Services";
      case "mobile":
        return "Mobile & Electronics";
      case "printing":
        return "Printing & Copy Services";
      case "internet":
        return "Internet Cafes";
      case "repair":
        return "Repair Services";
      
      // Shopping & Retail
      case "souvenir":
        return "Souvenirs & Gifts";
      case "clothing":
        return "Clothing & Fashion";
      case "shoes":
        return "Shoes & Accessories";
      case "jewelry":
        return "Jewelry & Watches";
      case "books":
        return "Books & Stationery";
      case "sports":
        return "Sports & Recreation";
      case "toys":
        return "Toys & Games";
      
      // Professional Services
      case "financial":
        return "Financial Services";
      case "insurance":
        return "Insurance Services";
      case "legal":
        return "Legal Services";
      case "accounting":
        return "Accounting Services";
      case "realestate":
        return "Real Estate";
      case "travel":
        return "Travel & Tours";
      
      // Automotive & Transportation
      case "automotive":
        return "Automotive Services";
      case "gasstation":
        return "Gas Stations";
      case "parking":
        return "Parking Services";
      
      // Specialty Stores
      case "hardware":
        return "Hardware Stores";
      case "garden":
        return "Garden & Plants";
      case "pet":
        return "Pet Stores & Services";
      case "music":
        return "Music & Instruments";
      case "art":
        return "Art & Crafts";
      
      // Essential Services
      case "laundry":
        return "Laundry Services";
      case "grocery":
        return "Grocery Stores";
      case "convenience":
        return "Convenience Stores";
      case "market":
        return "Markets & Bazaars";
      
      default:
        return "Shops & Services";
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getCategoryTitle(categoryIdString),
    });
  }, [navigation, categoryIdString]);

  // Filter shops based on the categoryId
  const allCategoryItems = useMemo(() => {
    return Object.values(shopsData).filter(
      (item) => item.category === categoryIdString
    );
  }, [categoryIdString]);

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
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const categoryTitle = getCategoryTitle(categoryIdString);
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
