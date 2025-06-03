import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Assuming expo-linear-gradient is available
import type { ShopCardProps } from './types'; // We can reuse or adapt ShopCardProps

// Props might be identical to ShopCardProps, or you might want to simplify/extend
// For now, let's assume it's similar enough to reuse ShopCardProps.
// interface FeaturedShopCardProps extends ShopCardProps {
//   // any additional props specific to featured card
// }

const FeaturedShopCard: React.FC<ShopCardProps> = ({
  shop,
  onPress,
  // width prop might be handled differently or be a fixed larger size by default
}) => {
  const cardWidth = 280; // A wider card for featured items
  const cardHeight = 180; // A taller card

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      height: cardHeight,
      borderRadius: 16, // Slightly larger radius
      overflow: 'hidden', // Important for ImageBackground and borderRadius
      backgroundColor: ShopColors.border, // Fallback color
      elevation: 5, // More pronounced shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    imageBackground: {
      flex: 1,
      justifyContent: 'flex-end', // Align content to the bottom
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '70%', // Gradient covers bottom part for text readability
    },
    contentContainer: {
      padding: 16,
      position: 'relative', // For absolute positioning of featured tag
    },
    name: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold', // Bolder for featured
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    ratingBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    ratingText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Poppins-SemiBold',
      marginLeft: 4,
    },
    featuredTag: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: ShopColors.accent,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    featuredTagText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontFamily: 'Poppins-SemiBold',
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(shop.id)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: shop.image }}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {shop.name}
          </Text>
        </View>

        {shop.rating !== undefined && shop.rating !== null && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{shop.rating.toFixed(1)}</Text>
          </View>
        )}

        <View style={styles.featuredTag}>
          <Text style={styles.featuredTagText}>FEATURED</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default FeaturedShopCard;