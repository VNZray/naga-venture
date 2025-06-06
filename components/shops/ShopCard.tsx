import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ShopCardProps } from './types';

const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  onPress,
  showRating = true, // This prop now primarily controls the badge on the image
  showCategory = true,
  width = 180,
}) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: ShopColors.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: ShopColors.border,
      width: width,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    imageContainer: {
      position: 'relative',
      height: 90,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    ratingBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 12,
    },
    ratingBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4, // Adjusted spacing
      fontFamily: 'Poppins-SemiBold',
    },
    shopInfo: {
      padding: 12,
    },
    name: {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      marginBottom: 4,
    },
    category: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      textTransform: 'capitalize',
      marginBottom: 6,
    },
    shopFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Adjust as needed if only one item
      alignItems: 'center',
      marginTop: 4, // Added some top margin for spacing
    },
    reviewCountText: {
      // New style for review count
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
    },
    // ratingContainer and ratingText can be removed if no longer used
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(shop.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: shop.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {showRating && shop.rating !== undefined && shop.rating !== null && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingBadgeText}>{shop.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.shopInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {shop.name || 'Unknown Shop'}
        </Text>

        {showCategory && shop.category && (
          <Text style={styles.category} numberOfLines={1}>
            {shop.category}
          </Text>
        )}

        <View style={styles.shopFooter}>
          {/* Display review count if available */}
          {shop.ratingCount !== undefined && shop.ratingCount !== null && (
            <Text style={styles.reviewCountText}>
              ({shop.ratingCount}
              {shop.ratingCount === 1 ? 'review' : 'reviews'})
            </Text>
          )}
          {/* You can add other elements to the footer here if needed, e.g., price range */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ShopCard;
