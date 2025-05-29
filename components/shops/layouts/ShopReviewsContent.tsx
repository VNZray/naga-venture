// Shop-specific Reviews Content Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ShopReviewsContentProps {
  shop: ShopData;
}

/**
 * ShopReviewsContent - Shop-specific reviews content component
 * 
 * This component handles the "Reviews" tab content including:
 * - Overall rating display
 * - Rating breakdown (placeholder for now)
 * - Individual reviews display
 * - Empty state when no reviews available
 */
export const ShopReviewsContent: React.FC<ShopReviewsContentProps> = ({
  shop,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

  const renderStars = (rating: number) => {
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
    <View style={styles.reviewsTab}>
      <View style={styles.ratingSummary}>
        <View style={styles.overallRating}>
          <Text style={[styles.overallRatingValue, { color: textColor }]}>
            {shop.rating ? shop.rating.toFixed(1) : "No"}
          </Text>
          <View>{renderStars(shop.rating || 0)}</View>
          <Text style={styles.ratingCount}>
            {shop.ratingCount || 0} reviews
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
  );
};

const styles = StyleSheet.create({
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
});

export default ShopReviewsContent;
