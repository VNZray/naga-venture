// app/(tabs)/(home)/(touristSpots)/(categories)/[category].jsx
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/TouristSearchBar";
import { ThemedView } from "@/components/ThemedView";
import TouristSpotCard from "@/components/TouristSpotCard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet
} from "react-native";
import { touristSpotsData } from "../data";

const CategoryPage = () => {
  const { category: categoryId } = useLocalSearchParams();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
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
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={`Search ${getCategoryTitle(categoryId).toLowerCase()}...`}
      />

      {/* Content */}
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
