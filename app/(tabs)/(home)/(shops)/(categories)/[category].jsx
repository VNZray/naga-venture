// app/(tabs)/(home)/(shops)/(categories)/[category].jsx
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Import the shop data
import { shopsData } from "../../../../Controller/ShopData";

const CategoryPage = () => {
  const { category: categoryId } = useLocalSearchParams();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";
  const cardBackgroundColor = colorScheme === "dark" ? "#1E293B" : "#fff";
  const shadowColor = colorScheme === "dark" ? "#000" : "#ccc";
  const [searchQuery, setSearchQuery] = useState("");

  // Define category title based on categoryId
  const getCategoryTitle = (id) => {
    switch (id) {
      case "bars":
        return "Bars & Nightlife";
      case "cafe":
        return "Cafes & Coffee Shops";
      case "dining":
        return "Restaurants & Dining";
      case "souvenir":
        return "Souvenirs & Gifts";
      default:
        return "Shops";
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getCategoryTitle(categoryId),
    });
  }, [navigation, categoryId]);

  // Filter shops based on the categoryId
  const allCategoryItems = useMemo(() => {
    return Object.values(shopsData).filter(
      (item) => item.category === categoryId
    );
  }, [categoryId]);

  const filteredCategoryItems = useMemo(() => {
    if (!searchQuery.trim()) return allCategoryItems;

    const query = searchQuery.toLowerCase().trim();
    return allCategoryItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  }, [searchQuery, allCategoryItems]);
  const handleItemClick = (itemId) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${itemId}`);
  };

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
            placeholder={`Search ${getCategoryTitle(categoryId).toLowerCase()}...`}
            placeholderTextColor={
              colorScheme === "dark" ? "#8E9196" : "#9F9EA1"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={[styles.searchButton, { backgroundColor: colorScheme === "dark" ? "#152A5E" : "#0077B6" }]}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredCategoryItems.length > 0 ? (
          filteredCategoryItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemClick(item.id)}
              style={[
                styles.itemContainer,
                { backgroundColor: cardBackgroundColor, shadowColor },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: textColor }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemDescription, { color: textColor }]}>
                  {item.description}
                </Text>
                <View style={styles.itemFooter}>
                  <View style={styles.location}>
                    <Ionicons name="location" size={16} color="#007AFF" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                  <View style={styles.priceRange}>
                    <Text style={styles.priceRangeText}>{item.priceRange}</Text>
                  </View>
                </View>
                <View style={styles.ratingRow}>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {item.rating} ({item.ratingCount} reviews)
                    </Text>
                  </View>
                  <View style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (          <View style={styles.emptyContainer}>
            <Ionicons name="information-circle-outline" size={40} color="gray" />
            <Text style={[styles.emptyText, { color: textColor }]}>
              No {getCategoryTitle(categoryId).toLowerCase()} found matching &quot;{searchQuery}&quot;.
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
  content: {
    padding: 10,
    paddingBottom: 100,
  },
  itemContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  itemImage: {
    width: "100%",
    height: 200,
  },
  itemDetails: {
    padding: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 5,
    color: "#007AFF",
    fontSize: 12,
  },
  priceRange: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priceRangeText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: "gray",
    fontSize: 12,
  },
  detailsButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});

export default CategoryPage;
