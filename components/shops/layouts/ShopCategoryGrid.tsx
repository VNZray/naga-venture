// Shop-specific Category Item Grid Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShopCategoryGridProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
}

/**
 * ShopCategoryGrid - Shop-specific category grid component
 * 
 * This component displays shops in a category with:
 * - Shop-specific layout optimized for category browsing
 * - Rating, location, and price information
 * - Responsive design
 * - Touch interactions for navigation
 */
const ShopCategoryGrid: React.FC<ShopCategoryGridProps> = ({
  shops,
  onShopPress,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const cardBackgroundColor = colorScheme === "dark" ? "#1E293B" : "#fff";
  const shadowColor = colorScheme === "dark" ? "#000" : "#ccc";

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {shops.map((shop) => (
        <TouchableOpacity
          key={shop.id}
          onPress={() => onShopPress(shop.id)}
          style={[
            styles.itemContainer,
            { backgroundColor: cardBackgroundColor, shadowColor },
          ]}
        >
          <Image source={{ uri: shop.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={[styles.itemName, { color: textColor }]}>
              {shop.name}
            </Text>
            <Text style={[styles.itemDescription, { color: textColor }]}>
              {shop.description}
            </Text>
            <View style={styles.itemFooter}>
              <View style={styles.location}>
                <Ionicons name="location" size={16} color="#007AFF" />
                <Text style={styles.locationText}>{shop.location}</Text>
              </View>
              <View style={styles.priceRange}>
                <Text style={styles.priceRangeText}>{shop.priceRange}</Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {shop.rating} ({shop.ratingCount} reviews)
                </Text>
              </View>
              <View style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 10,
    paddingBottom: 100,
  },
  itemContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  itemImage: {
    width: "100%",
    height: 200,
  },
  itemDetails: {
    padding: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 5,
    color: "#007AFF",
    fontSize: 12,
  },
  priceRange: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priceRangeText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: "gray",
    fontSize: 12,
  },
  detailsButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ShopCategoryGrid;
