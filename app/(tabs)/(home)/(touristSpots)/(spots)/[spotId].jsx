// app/(tabs)/(home)/(touristSpots)/(spots)/[spot].jsx
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { touristSpotsData } from "../data"; // Corrected import path

const TouristSpotDetails = () => {
  const { spotId } = useLocalSearchParams();
  console.log("Spot ID received:", spotId);
  const [activeTab, setActiveTab] = useState("details");
  const spot = spotId ? touristSpotsData[String(spotId)] : null;
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  if (!spot) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: textColor,
            marginBottom: 10,
          }}
        >
          Tourist Spot Not Found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#007AFF" }}>Back to Previous Screen</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderStars = (rating) => {
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

  // Mock function for rendering rating bars
  const renderRatingBars = () => (
    <View>
      <Text style={{ color: textColor }}>Rating bars will go here</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView>
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          <Image source={{ uri: spot.image }} style={styles.headerImage} />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={[styles.detailsContainer, { backgroundColor }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.spotTitle, { color: textColor }]}>
              {spot.name}
            </Text>
            {/* Favorite Button - Add functionality later */}
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "details" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("details")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "details" && styles.activeTabText,
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "reviews" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("reviews")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "reviews" && styles.activeTabText,
                ]}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === "details" && (
              <View style={styles.detailsTab}>
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: textColor }]}>
                    Description
                  </Text>
                  <Text style={[styles.sectionText, { color: "gray" }]}>
                    {spot.description}
                  </Text>
                </View>

                {spot.contact && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Contact
                    </Text>
                    <View style={styles.contactItem}>
                      <Ionicons name="call-outline" size={20} color="gray" />
                      <Text style={styles.contactText}>{spot.contact}</Text>
                    </View>
                  </View>
                )}

                {spot.openingHours && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Opening Hours
                    </Text>
                    <View style={styles.contactItem}>
                      <Ionicons name="time-outline" size={20} color="gray" />
                      <Text style={styles.contactText}>
                        {spot.openingHours}
                      </Text>
                    </View>
                  </View>
                )}

                {spot.admissionFee && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Admission Fee
                    </Text>
                    <Text style={styles.admissionFee}>{spot.admissionFee}</Text>
                  </View>
                )}

                {spot.additionalImages && spot.additionalImages.length > 0 && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      More Images
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {spot.additionalImages.map((image, index) => (
                        <View
                          key={index}
                          style={styles.additionalImageContainer}
                        >
                          <Image
                            source={{ uri: image }}
                            style={styles.additionalImage}
                          />
                        </View>
                      ))}
                      {spot.additionalImages.length > 3 && (
                        <TouchableOpacity style={styles.seeAllButton}>
                          <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>
                )}

                {spot.mapLocation && (
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Location
                    </Text>
                    <View style={styles.mapContainer}>
                      <Ionicons name="map-outline" size={40} color="gray" />
                      {spot.mapLocation.latitude &&
                        spot.mapLocation.longitude && (
                          <Text style={styles.mapText}>Map here</Text>
                          // You would integrate a MapView component here
                        )}
                      {spot.address && (
                        <Text style={styles.mapAddress}>{spot.address}</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeTab === "reviews" && (
              <View style={styles.reviewsTab}>
                <View style={styles.ratingSummary}>
                  <View style={styles.overallRating}>
                    <Text style={styles.overallRatingValue}>
                      {spot.rating ? spot.rating.toFixed(1) : "No"}
                    </Text>
                    <View>{renderStars(spot.rating)}</View>
                    <Text style={styles.ratingCount}>
                      {spot.ratingCount} reviews
                    </Text>
                  </View>
                  <View style={styles.ratingBreakdown}>
                    {renderRatingBars()}
                  </View>
                </View>
                {spot.reviews && spot.reviews.length > 0 ? (
                  <View>
                    {/* Map through reviews here */}
                    <Text style={{ color: textColor }}>
                      Reviews will be listed here
                    </Text>
                  </View>
                ) : (
                  <Text style={{ color: "gray" }}>No reviews yet.</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <Text style={{ color: textColor }}>Bottom Navigation Placeholder</Text>
        {/* Integrate your bottom navigation here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 10,
  },
  detailsContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  spotTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    // Add color here dynamically if needed
  },
  favoriteButton: {
    padding: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#ddd",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#333",
  },
  tabContent: {
    flex: 1,
  },
  detailsTab: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    // Add color here dynamically if needed
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
  additionalImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  additionalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  seeAllButton: {
    marginTop: 10,
  },
  seeAllText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  mapContainer: {
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    marginLeft: 10,
    color: "gray",
  },
  mapAddress: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
  reviewsTab: {
    paddingBottom: 20,
  },
  ratingSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  overallRating: {
    alignItems: "center",
  },
  overallRatingValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  ratingCount: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  ratingBreakdown: {
    flex: 1,
    marginLeft: 20,
  },
  // Styles for rating bars would go here
  reviewsList: {
    marginTop: 10,
  },
  // Styles for individual reviews would go here
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
});

export default TouristSpotDetails;
