// app/(tabs)/(home)/(shops)/(subcategory)/[subcategoryId].tsx - Individual Subcategory Page
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from 'react';

// Import shop-specific composable components
import {
  ShopCategoryGrid
} from "@/components/shops";

// Import the shop data
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
import { getCategoryById, shopsData } from "../../../../Controller/ShopData";

/**
 * SubcategoryPage - Shows shops within a specific subcategory
 * 
 * This page displays:
 * 1. All shops that belong to the selected subcategory
 * 2. Search functionality within the subcategory
 * 3. Navigation back to main category
 */
const SubcategoryPage = () => {
  const { subcategoryId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();

  // Ensure subcategoryId is a string
  const subcategoryIdString = Array.isArray(subcategoryId) ? subcategoryId[0] : subcategoryId || "";

  // Get the subcategory data
  const subcategoryData = useMemo(() => {
    return getCategoryById(subcategoryIdString);
  }, [subcategoryIdString]);

  // Set navigation title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: subcategoryData?.name || "Category",
    });
  }, [navigation, subcategoryData]);

  // Get all shops that belong to this subcategory
  const allCategoryItems = useMemo(() => {
    if (!subcategoryData) return [];
    
    return Object.values(shopsData).filter(
      (item) => item.category === subcategoryData.id
    );
  }, [subcategoryData]);

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
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  if (!subcategoryData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Subcategory not found
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
            placeholder={`Search ${subcategoryData.name.toLowerCase()}...`}
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
        {/* Category Info */}
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryTitle, { color: textColor }]}>
            {subcategoryData.name}
          </Text>
          <Text style={[styles.categoryDescription, { color: textColor + '80' }]}>
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'business' : 'businesses'}
          </Text>
        </View>

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
                ? `No businesses found matching "${searchQuery}"`
                : `No businesses found in ${subcategoryData.name}`
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
  categoryInfo: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-Regular",
  },
});

export default SubcategoryPage;
