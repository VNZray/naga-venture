import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import type { ShopData } from '@/types/shop';

interface RecommendedShopCardProps {
  shop: ShopData;
  onPress: (shopId: string) => void;
  onToggleFavorite?: (shopId: string, isFavorited: boolean) => void;
}

const RecommendedShopCard: React.FC<RecommendedShopCardProps> = ({
  shop,
  onPress,
  onToggleFavorite,
}) => {
  const cardWidth = 280;
  const cardHeight = 230; // Height can be adjusted if content becomes too cramped or too sparse

  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoritePress = () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    if (onToggleFavorite) {
      onToggleFavorite(shop.id, newFavoriteState);
    }
  };

  // Format review count as (500+) if it exceeds 500
  const formatReviewCount = (count: number | undefined) => {
    if (count === undefined) return '';
    if (count > 500) return '(500+)';
    return `(${count})`; // Removed "review/s" for brevity as per visual target
  };

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: ShopColors.cardBackground,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: ShopColors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    imageContainer: {
      width: '100%',
      height: cardHeight * 0.70, // Adjusted image height slightly for more content space
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    floatingFavoriteButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 20,
      padding: 6,
    },
    contentWrapper: { // Main container for all text content below image
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 14,
      justifyContent: 'flex-start', // Center content vertically if space allows
    },
    topInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center', // Align shop name and rating block vertically
    },
    name: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      flexShrink: 1, // Allow name to shrink if rating block is wide
      marginRight: 8, // Space before rating block
    },
    ratingReviewBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 0, // Prevent this block from shrinking
    },
    starIcon: {
      marginRight: 3,
      marginBottom: 3.5, // Adjusted for better vertical alignment
    },
    ratingText: {
      fontSize: 13,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      marginRight: 4, // Space before review count
    },
    reviewCountText: {
      fontSize: 12, // Slightly smaller for balance
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
    },
    priceRange: {
      fontSize: 12,
      fontFamily: 'Poppins-Medium',
      color: ShopColors.textSecondary,
      // No marginBottom needed if it's the last item or contentWrapper handles spacing
    },
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPress(shop.id)} activeOpacity={0.85} style={{flex: 1}}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: shop.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.topInfoRow}>
            <Text style={styles.name} numberOfLines={1}>
              {shop.name || 'Unknown Shop'}
            </Text>
            {shop.rating !== undefined && shop.rating !== null && (
              <View style={styles.ratingReviewBlock}>
                <Ionicons name="star" size={15} color="#FFD700" style={styles.starIcon} />
                <Text style={styles.ratingText}>
                  {shop.rating.toFixed(1)}
                </Text>
                <Text style={styles.reviewCountText}>
                  {formatReviewCount(shop.ratingCount)}
                </Text>
              </View>
            )}
          </View>

          {shop.priceRange && (
            <Text style={styles.priceRange} numberOfLines={1}>
              {shop.priceRange}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingFavoriteButton} onPress={handleFavoritePress}>
        <Ionicons
          name={isFavorited ? "heart" : "heart-outline"}
          size={22}
          color={isFavorited ? ShopColors.error : '#FFFFFF'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default RecommendedShopCard;