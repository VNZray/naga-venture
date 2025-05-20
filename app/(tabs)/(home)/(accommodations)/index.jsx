import { accommodations } from "@/app/Controller/AccommodationData";
import CardView from "@/components/CardView";
import SearchBar from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const width = Dimensions.get("screen").width;

const AccommodationDirectory = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "#151718" : "#FFFFFF";
  const isDarkMode = colorScheme === "dark";

  const [search, setSearch] = useState("");
  const [filteredAccommodations, setFilteredAccommodations] =
    useState(accommodations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredAccommodations(accommodations);
  }, []);

const handleSearch = () => {
  setLoading(true);

  setTimeout(() => {
    const lowerSearch = search.toLowerCase();

    const filtered = accommodations.filter((acc) => {
      return (
        acc.name.toLowerCase().includes(lowerSearch) ||
        acc.location.toLowerCase().includes(lowerSearch)
      );
    });

    setFilteredAccommodations(filtered);
    setLoading(false);
  }, 800); // simulate loading for 800ms
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.SearchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSearch={handleSearch}
          placeholder={"Search Accommodation or Location"}
        />
      </View>

      {/* Scrollable Accommodation List */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
      >
        <View style={styles.cardWrapper}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={isDarkMode}
              style={{ marginTop: 40 }}
            />
          ) : filteredAccommodations.length > 0 ? (
            filteredAccommodations.map((acc) => (
              <Link href={`/profile/${acc.id}`} key={acc.id}>
                <CardView
                  width={width - 32}
                  height={320}
                  radius={10}
                  elevation={0}
                >
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: acc.imageUri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View
                    style={[
                      styles.cardTextContainer,
                      {
                        backgroundColor,
                        shadowColor: isDarkMode ? "#f3f3f3" : "#000000",
                        shadowOpacity: isDarkMode ? 0 : 0.2,
                        shadowOffset: { width: 0, height: 0 },
                        shadowRadius: 6,
                      },
                    ]}
                  >
                    <ThemedText type="cardTitle">{acc.name}</ThemedText>
                    <ThemedText type="cardSubTitle">
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={14}
                        color="#FFB007"
                      />{" "}
                      {acc.location}
                    </ThemedText>
                    <ThemedText
                      type="cardBoldSubTitle"
                      style={{ color: "#FFB007" }}
                    >
                      {acc.priceRange}
                    </ThemedText>
                  </View>
                </CardView>
              </Link>
            ))
          ) : (
            <ThemedText
              type="body"
              style={{ textAlign: "center", marginTop: 40 }}
            >
              No results found.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SearchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    backgroundColor: "transparent",
  },
  cardWrapper: {
    paddingHorizontal: 16,
    gap: 16,
  },
  imageWrapper: {
    width: "100%",
    height: "88%",
    borderRadius: 10,
    position: "absolute",
    top: 0,
  },
  cardTextContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 10,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default AccommodationDirectory;
