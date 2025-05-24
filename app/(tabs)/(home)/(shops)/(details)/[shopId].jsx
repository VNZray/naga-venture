// app/(tabs)/(home)/(shops)/(details)/[shopId].jsx
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
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { shopsData } from "../../../../Controller/ShopData";

const ShopDetails = () => {
  const { shopId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("details");
  const shop = shopId ? shopsData[String(shopId)] : null;
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#0A1B47" : "#F8F8F8";

  if (!shop) {
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
          Shop Not Found
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

  const handleCall = () => {
    if (shop.contact) {
      Linking.openURL(`tel:${shop.contact}`);
    }
  };

  const handleDirections = () => {
    if (shop.mapLocation) {
      const { latitude, longitude } = shop.mapLocation;
      Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
    }
  };

  // Mock function for rendering rating bars
  const renderRatingBars = () => (
    <View>
      <Text style={{ color: textColor }}>Rating bars will go here</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ScrollView>
          {/* Header Image */}
          <View style={styles.headerImageContainer}>
            <Image source={{ uri: shop.image }} style={styles.headerImage} />
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
              <Text style={[styles.shopTitle, { color: textColor }]}>
                {shop.name}
              </Text>
              {/* Favorite Button - Add functionality later */}
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            {shop.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="gray" />
                <Text style={styles.locationText}>{shop.location}</Text>
              </View>
            )}

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
                  activeTab === "menu" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("menu")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "menu" && styles.activeTabText,
                  ]}
                >
                  Menu
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
                      {shop.description}
                    </Text>
                  </View>

                  {shop.contact && (
                    <View style={styles.section}>
                      <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Contact
                      </Text>
                      <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <Ionicons name="call-outline" size={20} color="gray" />
                        <Text style={styles.contactText}>{shop.contact}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {shop.openingHours && (
                    <View style={styles.section}>
                      <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Opening Hours
                      </Text>
                      <View style={styles.contactItem}>
                        <Ionicons name="time-outline" size={20} color="gray" />
                        <Text style={styles.contactText}>
                          {shop.openingHours}
                        </Text>
                      </View>
                    </View>
                  )}

                  {shop.priceRange && (
                    <View style={styles.section}>
                      <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Price Range
                      </Text>
                      <Text style={styles.priceRange}>
                        {shop.priceRange}
                      </Text>
                    </View>
                  )}

                  {shop.additionalImages &&
                    shop.additionalImages.length > 0 && (
                      <View style={styles.section}>
                        <Text
                          style={[styles.sectionTitle, { color: textColor }]}
                        >
                          More Images
                        </Text>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          {shop.additionalImages.map((image, index) => (
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
                          {shop.additionalImages.length > 3 && (
                            <TouchableOpacity style={styles.seeAllButton}>
                              <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                          )}
                        </ScrollView>
                      </View>
                    )}

                  {shop.mapLocation && (
                    <View style={styles.section}>
                      <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Location
                      </Text>
                      <TouchableOpacity 
                        style={styles.mapContainer}
                        onPress={handleDirections}
                      >
                        <Ionicons name="map-outline" size={40} color="gray" />
                        {shop.mapLocation.latitude &&
                          shop.mapLocation.longitude && (
                            <Text style={styles.mapText}>Tap to open in Maps</Text>
                          )}
                        {shop.location && (
                          <Text style={styles.mapAddress}>{shop.location}</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {activeTab === "menu" && (
                <View style={styles.menuTab}>
                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      Menu & Offerings
                    </Text>
                    {shop.menu && shop.menu.length > 0 ? (
                      shop.menu.map((item, index) => (
                        <View key={index} style={styles.menuItem}>
                          <Text style={[styles.menuItemName, { color: textColor }]}>
                            {item.item}
                          </Text>
                          <Text style={styles.menuItemPrice}>
                            {item.price}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ color: "gray" }}>Menu not available.</Text>
                    )}
                  </View>
                </View>
              )}

              {activeTab === "reviews" && (
                <View style={styles.reviewsTab}>
                  <View style={styles.ratingSummary}>
                    <View style={styles.overallRating}>
                      <Text style={styles.overallRatingValue}>
                        {shop.rating ? shop.rating.toFixed(1) : "No"}
                      </Text>
                      <View>{renderStars(shop.rating)}</View>
                      <Text style={styles.ratingCount}>
                        {shop.ratingCount} reviews
                      </Text>
                    </View>
                    <View style={styles.ratingBreakdown}>
                      {renderRatingBars()}
                    </View>
                  </View>
                  {shop.reviews && shop.reviews.length > 0 ? (
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
          <Text style={{ color: textColor }}>
            Bottom Navigation Placeholder
          </Text>
          {/* Integrate your bottom navigation here */}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  headerImageContainer: {
    height: 360,
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
    paddingTop: 5,
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
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
  menuTab: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  priceRange: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemName: {
    fontSize: 16,
    flex: 1,
  },
  menuItemPrice: {
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

export default ShopDetails;