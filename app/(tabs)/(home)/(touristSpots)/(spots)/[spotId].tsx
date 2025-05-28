// app/(tabs)/(home)/(touristSpots)/(spots)/[spotId].tsx
import TabSwitcher from "@/components/TabSwitcherComponent";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SpotDetailsSection from "@/components/touristSpot/SpotDetailsSection";
import SpotHeaderImage from "@/components/touristSpot/SpotHeaderImage";
import SpotLocationRow from "@/components/touristSpot/SpotLocationRow";
import SpotMapSection from "@/components/touristSpot/SpotMapSection";
import SpotMoreImages from "@/components/touristSpot/SpotMoreImages";
import SpotReviewsSection from "@/components/touristSpot/SpotReviewsSection";
import SpotTitleRow from "@/components/touristSpot/SpotTitleRow";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { JSX, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getSpotWithRatings } from "../data";

interface Tab {
  key: string;
  label: string;
}

const TouristSpotDetails: React.FC = () => {
  const { spotId } = useLocalSearchParams<{ spotId: string }>();
  const [activeTab, setActiveTab] = useState<string>("details");
  const spot = spotId ? getSpotWithRatings(spotId) : null;
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme].text;
  const activeBackground = "#0A1B47";

  if (!spot) {
    return (
      <ThemedView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}> 
        <ThemedText type="title" style={{ marginBottom: 10 }}>
          Tourist Spot Not Found
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText type="link">Back to Previous Screen</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const renderStars = (rating: number): JSX.Element => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#FFD700" : "gray"}
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  const renderRatingBars = (): JSX.Element => (
    <View>
      <Text style={{ color: textColor }}>Rating bars will go here</Text>
    </View>
  );

  const tabs: Tab[] = [
    { key: "details", label: "Details" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <SafeAreaProvider>
      <ThemedView style={styles.container}>
        <ScrollView>
          <SpotHeaderImage image={spot.image} onBack={() => router.back()} />
          <View style={[styles.detailsContainer]}>
            <SpotTitleRow name={spot.name} onFavorite={() => {}} isFavorite={false} textColor={textColor} />
            <SpotLocationRow location={spot.location} iconColor={Colors[colorScheme].icon} />
            <TabSwitcher
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              color={textColor}
              active={activeBackground}
            />
            <View style={styles.tabContent}>
              {activeTab === "details" && (
                <View style={styles.detailsTab}>
                  <SpotDetailsSection title="Description">
                    <ThemedText type="default2" style={styles.sectionText}>{spot.description}</ThemedText>
                  </SpotDetailsSection>
                  {spot.contact && (
                    <SpotDetailsSection title="Contact">
                      <View style={styles.contactItem}>
                        <Ionicons name="call-outline" size={20} color={Colors[colorScheme].icon} />
                        <ThemedText type="default2" style={styles.contactText}>{spot.contact}</ThemedText>
                      </View>
                    </SpotDetailsSection>
                  )}
                  {spot.openingHours && (
                    <SpotDetailsSection title="Opening Hours">
                      <View style={styles.contactItem}>
                        <Ionicons name="time-outline" size={20} color={Colors[colorScheme].icon} />
                        <ThemedText type="default2" style={styles.contactText}>{spot.openingHours}</ThemedText>
                      </View>
                    </SpotDetailsSection>
                  )}
                  {spot.admissionFee && (
                    <SpotDetailsSection title="Admission Fee">
                      <ThemedText type="defaultSemiBold" style={styles.admissionFee}>{spot.admissionFee}</ThemedText>
                    </SpotDetailsSection>
                  )}
                  <SpotMoreImages
                    images={spot.additionalImages}
                    onSeeAll={() => router.push({ pathname: "/(tabs)/(home)/(touristSpots)/(spots)/AllImages", params: { images: spot.additionalImages.join(",") } })}
                  />
                  <SpotMapSection mapLocation={spot.mapLocation} address={spot.address} iconColor={Colors[colorScheme].icon} />
                </View>
              )}
              {activeTab === "reviews" && (
                <SpotReviewsSection
                  spotId={spotId}
                  rating={spot.rating}
                  ratingCount={spot.ratingCount}
                  renderStars={renderStars}
                  iconColor={Colors[colorScheme].icon}
                />
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
  detailsContainer: {
    flex: 1,
    paddingTop: 5,
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },
  detailsTab: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "gray",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: "gray",
  },
  admissionFee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  reviewsTab: {
    paddingBottom: 20,
  },
});

export default TouristSpotDetails;
