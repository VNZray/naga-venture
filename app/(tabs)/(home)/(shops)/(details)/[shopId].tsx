// app/(tabs)/(home)/(shops)/(details)/[shopId].tsx - Clean and simple
import ShopDetail from "@/components/shops/ShopDetail";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { shopsData } from "../../../../Controller/ShopData";

/**
 * ShopDetails - Clean and simple using our new ShopDetail component
 * 
 * This demonstrates the new simple approach:
 * 1. Get shop data from parameters
 * 2. Pass data to ShopDetail component
 * 3. ShopDetail handles all the UI and navigation
 */
const ShopDetails = () => {
  const { shopId } = useLocalSearchParams();
    // Handle shopId which can be string or string[]
  const shopKey = Array.isArray(shopId) ? shopId[0] : shopId;
  const shop = shopKey ? shopsData[shopKey as unknown as keyof typeof shopsData] : null;

  // Handle case where shop is not found
  if (!shop) {
    return <ShopDetail shop={null} />;
  }

  return <ShopDetail shop={shop} />;
};

export default ShopDetails;