// app/(tabs)/(home)/(touristSpots)/index.tsx
import CardContainer from "@/components/CardContainer";
import EmptyState from "@/components/EmptyState";
import PressableButton from "@/components/PressableButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SearchBar from "@/components/touristSpot/TouristSearchBar";
import TouristSpotCard from "@/components/touristSpot/TouristSpotCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { categories, destinations, featuredLocations } from "./data";

const width = Dimensions.get("window").width;

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Destination {
  id: string;
  name: string;
  image: string;
}

const TouristSpotDirectory: React.FC = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/(home)/(touristSpots)/(categories)/${categoryId}`);
  };

  const handleDestinationPress = (destinationId: string) => {
    router.push(`/(tabs)/(home)/(touristSpots)/(spots)/${destinationId}`);
  };

  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return destinations;

    const query = searchQuery.toLowerCase().trim();
    return destinations.filter((spot) =>
      spot.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <SafeAreaProvider>
      <ThemedView style={styles.container}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tourist spots..."
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Featured Locations - Only show when not searching */}
          {!searchQuery.trim() && (
            <View style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.CarouselTitle}>
                Featured Locations
              </ThemedText>
              <View style={{ height: 200 }}>
                <Carousel
                  loop
                  width={width - 50}
                  height={200}
                  mode="parallax"
                  data={featuredLocations}
                  scrollAnimationDuration={1000}
                  renderItem={({ item: spot }) => (
                    <TouristSpotCard
                      key={spot.id}
                      spot={spot}
                      onPress={() => handleDestinationPress(spot.id)}
                      variant="carousel"
                    />
                  )}
                />
              </View>
            </View>
          )}

          {/* Categories - Only show when not searching */}
          {!searchQuery.trim() && (
            <View style={styles.sectionContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Categories
              </ThemedText>
              <CardContainer style={styles.directories} height={"auto"}>
                {categories.map((category) => (
                  <PressableButton
                    key={category.id}
                    IconSize={24}
                    color={Colors[colorScheme].text}
                    direction="column"
                    Title={category.name}
                    Icon={category.icon}
                    onPress={() => handleCategoryPress(category.id)}
                  />
                ))}
              </CardContainer>
            </View>
          )}

          {/* Discover More / Search Results */}
          <View style={[styles.sectionContainer, { marginBottom: 100 }]}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {searchQuery ? "Search Results" : "Discover More"}
            </ThemedText>
            <View style={styles.destinationsGrid}>
              {filteredSpots.map((spot) => (
                <TouristSpotCard
                  key={spot.id}
                  spot={{
                    ...spot,
                    description: '',
                    location: ''
                  }}
                  onPress={() => handleDestinationPress(spot.id)}
                  variant="grid"
                />
              ))}
              {filteredSpots.length === 0 && (
                <EmptyState message={`No tourist spots found matching "${searchQuery}"`} />
              )}
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  directories: {
    flex: 1,
    width: "100%",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  CarouselTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: -10,
  },
  destinationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default TouristSpotDirectory;