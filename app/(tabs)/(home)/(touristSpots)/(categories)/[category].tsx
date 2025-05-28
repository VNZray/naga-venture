// Category page that displays tourist spots filtered by a specific category
// Includes search functionality and a list view of spots within the category

import EmptyState from "@/components/EmptyState";
import { ThemedView } from "@/components/ThemedView";
import SearchBar from "@/components/touristSpot/TouristSearchBar";
import TouristSpotCard from "@/components/touristSpot/TouristSpotCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet
} from "react-native";
import { TouristSpot, touristSpotsData } from "../TouristSpotData";

const CategoryPage: React.FC = () => {
  // Get category ID from URL parameters
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Helper function to get human-readable category title
  const getCategoryTitle = (id: string): string => {
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

  // Set navigation header title based on category
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getCategoryTitle(categoryId),
    });
  }, [navigation, categoryId]);

  // Filter spots by category
  const allCategorySpots = useMemo(() => {
    return Object.values(touristSpotsData).filter(
      (spot: TouristSpot) => spot.category === categoryId
    );
  }, [categoryId]);

  // Filter spots by search query within the category
  const filteredCategorySpots = useMemo(() => {
    if (!searchQuery.trim()) return allCategorySpots;

    const query = searchQuery.toLowerCase().trim();
    return allCategorySpots.filter((spot: TouristSpot) =>
      spot.name.toLowerCase().includes(query)
    );
  }, [searchQuery, allCategorySpots]);

  // Navigation handler for spot selection
  const handleSpotClick = (spotId: string): void => {
    router.push(`/(tabs)/(home)/(touristSpots)/(spots)/${spotId}`);
  };

  return (
    <ThemedView style={[styles.container]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      
      {/* Search bar for filtering spots within category */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={`Search ${getCategoryTitle(categoryId).toLowerCase()}...`}
      />

      {/* List of spots in the category */}
      <ScrollView contentContainerStyle={styles.content}>
        {filteredCategorySpots.length > 0 ? (
          filteredCategorySpots.map((spot) => (
            <TouristSpotCard
              key={spot.id}
              spot={spot}
              onPress={() => handleSpotClick(spot.id)}
              variant="list"
            />
          ))
        ) : (
          <EmptyState
            message={`No ${getCategoryTitle(categoryId).toLowerCase()} found matching "${searchQuery}"`}
          />
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
  content: {
    padding: 10,
    paddingBottom: 100,
  },
});

export default CategoryPage;