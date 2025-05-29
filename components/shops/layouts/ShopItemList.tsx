// Shop-specific Item List Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShopItemListProps {
  shops: ShopData[];
  onShopPress: (id: string) => void;
  title?: string;
  showRating?: boolean;
  showCategory?: boolean;
  showDistance?: boolean;
  showPrice?: boolean;
  showOpenStatus?: boolean;
  emptyMessage?: string;
}

/**
 * ShopItemList - Shop-specific list component
 * 
 * This component is tailored for shops and demonstrates composition by:
 * - Accepting shop data via props
 * - Shop-specific display options (price, open status, etc.)
 * - Handling shop press via callback
 * - Optimized for shop-specific requirements
 */
export const ShopItemList: React.FC<ShopItemListProps> = ({
  shops,
  onShopPress,
  title = "Shops",
  showRating = true,
  showCategory = true,
  showDistance = false,
  showPrice = false,
  showOpenStatus = false,
  emptyMessage = "No shops found",
}) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color }]}>
        {title}
      </Text>
      
      <View style={styles.itemsGrid}>
        {shops.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={styles.itemCard}
            onPress={() => onShopPress(shop.id)}
          >
            <View style={styles.itemImageContainer}>
              <Image
                source={{ uri: shop.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemOverlay} />
              
              {/* Category Badge */}
              {showCategory && shop.category && (
                <View style={styles.categoryBadgeContainer}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{shop.category}</Text>
                  </View>
                </View>
              )}
              
              {/* Open Status Badge */}
              {showOpenStatus && shop.isOpen !== undefined && (
                <View style={styles.statusBadgeContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: shop.isOpen ? '#4CAF50' : '#F44336' }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                </View>
              )}
              
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {shop.name}
                </Text>
                
                <View style={styles.itemDetailsRow}>
                  {/* Rating */}
                  {showRating && shop.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{shop.rating}</Text>
                      {shop.reviewCount && (
                        <Text style={styles.reviewText}>({shop.reviewCount})</Text>
                      )}
                    </View>
                  )}
                  
                  {/* Price */}
                  {showPrice && shop.price && (
                    <Text style={styles.priceText}>{shop.price}</Text>
                  )}
                </View>
                
                {/* Distance */}
                {showDistance && shop.distance && (
                  <Text style={styles.distanceText}>{shop.distance}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {shops.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color }]}>
              {emptyMessage}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    width: "48%",
    marginBottom: 15,
  },
  itemImageContainer: {
    height: 130,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryBadgeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  categoryBadge: {
    backgroundColor: "rgba(0, 119, 182, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusBadgeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  itemTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  itemName: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  itemDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  reviewText: {
    marginLeft: 2,
    fontSize: 10,
    color: "#fff",
    opacity: 0.8,
  },
  priceText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  distanceText: {
    fontSize: 10,
    color: "#fff",
    opacity: 0.8,
    marginTop: 2,
  },
  emptyContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
});

export default ShopItemList;
