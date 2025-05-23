// app/(tabs)/(home)/(touristSpots)/index.jsx
import CardContainer from "@/components/CardContainer";
import PressableButton from "@/components/PressableButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { categories, destinations, featuredLocations } from "./data";

const width = Dimensions.get("window").width;

const TouristSpotDirectory = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#fff" : "#F8F8F8";
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryPress = (categoryId) => {
    router.push(`/(tabs)/(home)/(touristSpots)/(categories)/${categoryId}`);
  };

  const handleDestinationPress = (destinationId) => {
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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.searchInput, { color: Colors[colorScheme].text}]}
              placeholder="Search tourist spots..."
              placeholderTextColor={
                colorScheme === "dark" ? "#8E9196" : "#9F9EA1"
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

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
                    <TouchableOpacity
                      key={spot.id}
                      style={styles.carouselItem}
                      onPress={() => handleDestinationPress(spot.id)}
                    >
                      <Image
                        source={{ uri: spot.image }}
                        style={styles.carouselImage}
                        resizeMode="cover"
                      />
                      <View style={styles.carouselOverlay} />
                      <View style={styles.carouselTextContainer}>
                        <ThemedText type="cardTitle" style={styles.carouselTitle}>{spot.name}</ThemedText>
                      </View>
                    </TouchableOpacity>
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
                <TouchableOpacity
                  key={spot.id}
                  style={styles.destinationCard}
                  onPress={() => handleDestinationPress(spot.id)}
                >
                  <View style={styles.destinationImageContainer}>
                    <Image
                      source={{ uri: spot.image }}
                      style={styles.destinationImage}
                      resizeMode="cover"
                    />
                    <View style={styles.destinationOverlay} />
                    <View style={styles.destinationTextContainer}>
                      <ThemedText type="cardTitle" style={styles.destinationName} numberOfLines={1}>
                        {spot.name}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {filteredSpots.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <ThemedText type="default" style={styles.noResultsText}>
                    No tourist spots found matching &quot;{searchQuery}&quot;
                  </ThemedText>
                </View>
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
  carouselItem: {
    borderRadius: 15,
    overflow: "hidden",
    height: "100%",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  destinationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  destinationCard: {
    width: "48%",
    marginBottom: 15,
  },
  destinationImageContainer: {
    height: 130,
    borderRadius: 10,
    overflow: "hidden",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  destinationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  destinationTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  destinationName: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  noResultsContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
});

export default TouristSpotDirectory;
