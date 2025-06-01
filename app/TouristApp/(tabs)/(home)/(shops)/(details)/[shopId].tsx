// app/(tabs)/(home)/(shops)/(details)/[shopId].jsx - Refactored using composition
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Import shop-specific composable components
import {
  ShopDetailLayout,
  ShopDetailsContent,
  ShopMenuContent,
  ShopReviewsContent,
  ShopTabContainer
} from "@/components/shops";

// Import the shop data
import { shopsData } from "@/Controller/ShopData";

/**
 * ShopDetails - Refactored using shop detail composition patterns
 * 
 * This demonstrates the power of composition specifically for shop details:
 * 1. ShopDetailLayout handles the detail page structure (header, title, etc.)
 * 2. ShopTabContainer handles the tab navigation
 * 3. ShopDetailsContent handles the "Details" tab content
 * 4. ShopMenuContent handles the "Menu" tab content
 * 5. ShopReviewsContent handles the "Reviews" tab content
 * 
 * The main component focuses on:
 * - Shop data management
 * - Tab state management
 * - Composing the shop detail layout components together
 */
const ShopDetails = () => {
  const { shopId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("details");
  const shop = shopId ? shopsData[String(shopId)] : null;

  // Handle case where shop is not found
  if (!shop) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
        }}>
          Shop Not Found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#007AFF" }}>Back to Previous Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Define tab content
  const tabs = [
    {
      id: "details",
      label: "Details",
      content: <ShopDetailsContent shop={shop} />
    },
    {
      id: "menu",
      label: "Menu",
      content: <ShopMenuContent shop={shop} />
    },
    {
      id: "reviews",
      label: "Reviews",
      content: <ShopReviewsContent shop={shop} />
    }
  ];

  return (
    <ShopDetailLayout shop={shop}>
      <ShopTabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </ShopDetailLayout>
  );
};

export default ShopDetails;