// app/(tabs)/(home)/(shops)/(main-categories)/[mainCategory].tsx - Main Category Page
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from 'react';

// Import shop-specific composable components
import {
  ShopCategoriesSection,
  ShopCategoryGrid
} from "@/components/shops";

// Import the shop data
import { getMainCategoryById, shopsData } from "@/controller/ShopData";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * MainCategoryPage - Shows all subcategories within a main category
 * 
 * This page displays:
 * 1. All subcategories within the selected main category
 * 2. All shops that belong to those subcategories
 * 3. Category navigation and filtering
 */
const MainCategoryPage = () => {
  const { category: mainCategoryId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();

  // Ensure mainCategoryId is a string
  const mainCategoryIdString = Array.isArray(mainCategoryId) ? mainCategoryId[0] : mainCategoryId || "";

  // Get the main category data
  const mainCategoryData = useMemo(() => {
    return getMainCategoryById(mainCategoryIdString);
  }, [mainCategoryIdString]);

  // Set navigation title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: mainCategoryData?.name || "Category",
    });
  }, [navigation, mainCategoryData]);

  // Get all shops that belong to subcategories of this main category
  const allCategoryItems = useMemo(() => {
    if (!mainCategoryData) return [];
    
    const subcategoryIds = mainCategoryData.subcategories.map(sub => sub.id);
    return Object.values(shopsData).filter(
      (item) => subcategoryIds.includes(item.category)
    );
  }, [mainCategoryData]);

  // Filter shops based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allCategoryItems;
    
    const query = searchQuery.toLowerCase().trim();
    return allCategoryItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [allCategoryItems, searchQuery]);
  // Navigation handlers
  const handleCategoryPress = (categoryId: string) => {
    // Navigate to the subcategory page instead of main category page
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(subcategory)/${categoryId}`);
  };

  const handleShopPress = (shopId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  if (!mainCategoryData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Main category not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder={`Search in ${mainCategoryData.name}...`}
            placeholderTextColor={
              colorScheme === "dark" ? "#8E9196" : "#9F9EA1"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={[
              styles.searchButton, 
              { backgroundColor: colorScheme === "dark" ? "#152A5E" : "#0077B6" }
            ]}
          >
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Subcategories Section - Only show when not searching */}
        {!searchQuery.trim() && (
          <ShopCategoriesSection
            categories={mainCategoryData.subcategories}
            onCategoryPress={handleCategoryPress}
            title="Subcategories"
          />
        )}

        {/* Shops Grid */}
        <ShopCategoryGrid
          shops={filteredItems}
          onShopPress={handleShopPress}
        />
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={40} color="gray" />
            <Text style={[styles.emptyText, { color: textColor }]}>
              {searchQuery.trim() 
                ? `No shops found for "${searchQuery}"`
                : `No shops available in ${mainCategoryData.name}`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: "#0077B6",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default MainCategoryPage;
