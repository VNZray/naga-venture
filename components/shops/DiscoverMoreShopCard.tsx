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

interface DiscoverMoreShopCardProps {
  shop: ShopData;
  onPress: (shopId: string) => void;
  onToggleFavorite?: (shopId: string, isFavorited: boolean) => void;
}

const DiscoverMoreShopCard: React.FC<DiscoverMoreShopCardProps> = ({
  shop,
  onPress,
  onToggleFavorite,
}) => {
  const cardHeight = 250; // Consistent height with RecommendedShopCard

  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoritePress = () => {
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    if (onToggleFavorite) {
      onToggleFavorite(shop.id, newFavoriteState);
    }
  };

  const formatReviewCount = (count: number | undefined) => {
    if (count === undefined) return '';
    if (count > 500) return '(500+)';
    return `(${count})`;
  };

  const styles = StyleSheet.create({
    card: {
      width: '100%', // Designed to take full width of its container
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
      // Ensure the main TouchableOpacity can work correctly by not having children absolutely positioned outside its bounds
      // without a parent View handling the layout.
    },
    touchableContent: { // Wrapper for pressable content if favorite button is separate
        flex: 1,
        flexDirection: 'column', // Main axis for image and contentWrapper
    },
    imageContainer: {
      width: '100%',
      height: cardHeight * 0.70, // Adjust as needed
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
      zIndex: 1, // Ensure it's above the image
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 20,
      padding: 6,
    },
    contentWrapper: {
      flex: 1, // Takes remaining space after image
      paddingVertical: 10,
      paddingHorizontal: 14,
      justifyContent: 'flex-start',
    },
    topInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    name: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      flexShrink: 1,
      marginRight: 8,
    },
    ratingReviewBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 0,
    },
    starIcon: {
      marginRight: 3,
    },
    ratingText: {
      fontSize: 13,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      marginRight: 4,
    },
    reviewCountText: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
    },
    priceRange: {
      fontSize: 12,
      fontFamily: 'Poppins-Medium',
      color: ShopColors.textSecondary,
    },
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPress(shop.id)} activeOpacity={0.85} style={styles.touchableContent}>
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

export default DiscoverMoreShopCard;