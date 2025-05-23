// app/(tabs)/(home)/(touristSpots)/index.jsx
import CardContainer from "@/components/CardContainer";
import PressableButton from "@/components/PressableButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { categories, destinations, featuredLocations } from "./data";

const width = Dimensions.get("window").width;

const TouristSpotDirectory = () => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#fff" : "#F8F8F8";
  const cardBgColor = colorScheme === "dark" ? "#fff" : "#fff";
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryPress = (categoryId) => {
    router.push(`/(tabs)/(home)/(touristSpots)/(categories)/${categoryId}`);
  };

  const handleDestinationPress = (destinationId) => {
    router.push(`/(tabs)/(home)/(touristSpots)/(spots)/${destinationId}`);
  };

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;
    
    const query = searchQuery.toLowerCase().trim();
    return destinations.filter(destination => 
      destination.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor }]}
        edges={["top"]}
      >
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.searchInput, { color: color }]}
              placeholder="Search tourist spots..."
              placeholderTextColor={
                colorScheme === "dark" ? "#8E9196" : "#9F9EA1"
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={[
                styles.searchButton,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#152A5E" : "#0077B6",
                },
              ]}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Featured Locations - Only show when not searching */}
          {!searchQuery.trim() && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: color }]}>
                Featured Locations
              </Text>
              <View style={{ height: 200 }}>
                <Carousel
                  loop
                  width={width - 40}
                  height={200}
                  mode="parallax"
                  data={featuredLocations}
                  scrollAnimationDuration={1000}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.carouselItem}
                      onPress={() => handleDestinationPress(item.id)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.carouselImage}
                        resizeMode="cover"
                      />
                      <View style={styles.carouselOverlay} />
                      <View style={styles.carouselTextContainer}>
                        <Text style={styles.carouselTitle}>{item.name}</Text>
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
              <Text style={[styles.sectionTitle, { color: color }]}>
                Categories
              </Text>
              <CardContainer style={styles.directories} height={"auto"}>
                {categories.map((category) => (
                  <PressableButton
                    key={category.id}
                    IconSize={24}
                    color={color}
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
            <Text style={[styles.sectionTitle, { color: color }]}>
              {searchQuery ? "Search Results" : "Discover More"}
            </Text>
            <View style={styles.destinationsGrid}>
              {filteredDestinations.map((destination) => (
                <TouchableOpacity
                  key={destination.id}
                  style={styles.destinationCard}
                  onPress={() => handleDestinationPress(destination.id)}
                >
                  <View style={styles.destinationImageContainer}>
                    <Image
                      source={{ uri: destination.image }}
                      style={styles.destinationImage}
                      resizeMode="cover"
                    />
                    <View style={styles.destinationOverlay} />
                    <View style={styles.destinationTextContainer}>
                      <Text style={styles.destinationName} numberOfLines={1}>
                        {destination.name}
                      </Text>

                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {filteredDestinations.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={[styles.noResultsText, { color }]}>
                    No tourist spots found matching &quot;{searchQuery}&quot;
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
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
