// Shop-specific Details Content Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShopDetailsContentProps {
  shop: ShopData;
}

/**
 * ShopDetailsContent - Shop-specific details content component
 * 
 * This component handles the "Details" tab content including:
 * - Description
 * - Contact information
 * - Opening hours
 * - Price range
 * - Additional images
 * - Map/location
 */
const ShopDetailsContent: React.FC<ShopDetailsContentProps> = ({
  shop,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

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

  return (
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

      {shop.additionalImages && shop.additionalImages.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
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
            {shop.mapLocation.latitude && shop.mapLocation.longitude && (
              <Text style={styles.mapText}>Tap to open in Maps</Text>
            )}
            {shop.location && (
              <Text style={styles.mapAddress}>{shop.location}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ShopDetailsContent;
