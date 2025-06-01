// app/(tabs)/(home)/(shops)/(categories)/recommended.tsx
import ShopCategoryPage from "@/components/shops/ShopCategoryPage";
import React from "react";
import { destinations } from "../../../../Controller/ShopData";

/**
 * RecommendedShopsPage - Shows recommended shops based on high ratings
 */
const RecommendedShopsPage = () => {
  // Filter shops with high ratings (4.5 and above) for recommendations
  const recommendedShops = destinations.filter(shop => shop.rating >= 4.5);

  return (
    <ShopCategoryPage 
      category={{
        id: "recommended",
        name: "Recommended for you",
        icon: "thumbs-up"
      }}
      shops={recommendedShops}
    />
  );
};

export default RecommendedShopsPage;
