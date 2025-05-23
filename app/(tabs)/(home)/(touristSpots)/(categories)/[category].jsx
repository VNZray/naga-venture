// app/(tabs)/(home)/(touristSpots)/(categories)/[category].jsx
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
// Import the central data
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { touristSpotsData } from "../data";

const CategoryPage = () => {
  const { category: categoryId } = useLocalSearchParams();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme].text;
  const backgroundColor = Colors[colorScheme].background;
  const cardBackgroundColor = colorScheme === "dark" ? "#1E293B" : "#fff";
  const shadowColor = colorScheme === "dark" ? "#000" : "#ccc";
  const [searchQuery, setSearchQuery] = useState("");

  // Define category title based on categoryId
  const getCategoryTitle = (id) => {
    switch (id) {
      case "historical":
        return "Historical Places";
      case "natural":
        return "Natural Wonders";
      case "urban":
        return "Urban Attractions";
      case "museums":
        return "Museums & Galleries";
      case "resorts":
        return "Resorts & Recreation";
      default:
        return "Places";
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getCategoryTitle(categoryId),
    });
  }, [navigation, categoryId]);

  // Filter tourist spots based on the categoryId
  const allCategorySpots = useMemo(() => {
    return Object.values(touristSpotsData).filter(
      (spot) => spot.category === categoryId
    );
  }, [categoryId]);

  const filteredCategorySpots = useMemo(() => {
    if (!searchQuery.trim()) return allCategorySpots;

    const query = searchQuery.toLowerCase().trim();
    return allCategorySpots.filter((spot) =>
      spot.name.toLowerCase().includes(query)
    );
  }, [searchQuery, allCategorySpots]);

  const handleSpotClick = (spotId) => {
    router.push(`/(tabs)/(home)/(touristSpots)/(spots)/${spotId}`);
  };

  return (
    <ThemedView style={[styles.container]}>
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
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredCategorySpots.length > 0 ? (
          filteredCategorySpots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              onPress={() => handleSpotClick(spot.id)}
              style={[
                styles.itemContainer,
                { backgroundColor: cardBackgroundColor, shadowColor },
              ]}
            >
              <Image source={{ uri: spot.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <ThemedText type="cardTitle" style={styles.itemName}>
                  {spot.name}
                </ThemedText>
                <ThemedText type="default2" style={styles.itemDescription}>
                  {spot.description}
                </ThemedText>
                <View style={styles.itemFooter}>
                  <View style={styles.location}>
                    <Ionicons name="location" size={16} color={Colors[colorScheme].tint} />
                    <ThemedText type="default2" style={styles.locationText}>{spot.location}</ThemedText>
                  </View>
                  <View style={styles.detailsButton}>
                    <ThemedText type="default2" style={styles.detailsButtonText}>View Details</ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="information-circle-outline"
              size={40}
              color={Colors[colorScheme].icon}
            />
            <ThemedText type="default2" style={[styles.emptyText, { color: textColor }]}>
              No {getCategoryTitle(categoryId).toLowerCase()} found matching &quot;{searchQuery}&quot;.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
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
  detailsButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#333",
    fontSize: 12,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
