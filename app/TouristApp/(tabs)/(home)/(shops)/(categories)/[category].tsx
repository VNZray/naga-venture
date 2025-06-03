// app/(tabs)/(home)/(shops)/(categories)/[category].tsx - Simplified
import ShopCategoryPage from "@/components/shops/ShopCategoryPage";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { getMainCategoryById, shopsData } from "../../../../Controller/ShopData";

/**
 * MainCategoryPage - Simple implementation using ShopCategoryPage component
 */
const MainCategoryPage = () => {
  const { category: mainCategoryId } = useLocalSearchParams();
  
  // Ensure mainCategoryId is a string
  const mainCategoryIdString = Array.isArray(mainCategoryId) ? mainCategoryId[0] : mainCategoryId || "";
  
  // Get the main category data
  const mainCategoryData = getMainCategoryById(mainCategoryIdString);
  
  // Get all shops that belong to subcategories of this main category
  const allCategoryShops = mainCategoryData 
    ? Object.values(shopsData).filter(shop => 
        mainCategoryData.subcategories.some(sub => sub.id === shop.category)
      )
    : [];

  if (!mainCategoryData) {
    return <ShopCategoryPage category={null} shops={[]} />;
  }

  return (
    <ShopCategoryPage 
      category={{
        id: mainCategoryData.id,
        name: mainCategoryData.name,
        icon: mainCategoryData.icon
      }}
      shops={allCategoryShops}
    />
  );
};

export default MainCategoryPage;
