// Personalized Recommendations Component - Refactored to use BaseShopSection
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BaseShopSection, { ColorScheme } from '../core/BaseShopSection';

interface PersonalizedRecommendationsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  onViewAllPress?: () => void;
  userPreferences?: {
    favoriteCategories?: string[];
    visitedShops?: string[];
    searchHistory?: string[];
  };
  limit?: number;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = React.memo(({ 
  shops, 
  onShopPress,
  onViewAllPress,
  userPreferences = {},
  limit = 6
}) => {
  // Memoized personalized scoring - only recalculates when dependencies change
  const personalizedShops = useMemo(() => {
    // Simplified implementation - just get the top-rated shops as "recommendations"
    return shops
      .filter(shop => shop.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);  }, [shops, limit]);
  
  // Memoized recommendation reason function
  const getRecommendationReason = useCallback((shop: ShopData) => {
    if (shop.rating >= 4.8) return 'Top rated in this area';
    if (shop.rating >= 4.5) return 'Highly rated shop';
    return 'Recommended for you';
  }, []);
  
  // Render a custom card with recommendation reason
  const renderCustomCard = useCallback((shop: ShopData, index: number, styles: any, colors: ColorScheme) => (
    <TouchableOpacity
      key={shop.id}
      style={[styles.shopCard, { 
        backgroundColor: colors.cardBackground, 
        borderColor: colors.borderColor,
        width: 180,
      }]}
      onPress={() => onShopPress(shop.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: shop.image }}
          style={styles.shopImage}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingBadgeText}>{shop.rating.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.shopInfo}>
        <Text style={[styles.shopName, { color: colors.textColor }]} numberOfLines={1}>
          {shop.name}
        </Text>
        
        <Text style={[styles.shopCategory, { color: colors.subtextColor }]} numberOfLines={1}>
          {shop.category}
        </Text>
        
        <View style={recommendationStyles.reasonContainer}>
          <Ionicons name="bulb" size={12} color="#2E5AA7" />
          <Text style={recommendationStyles.reasonText} numberOfLines={1}>
            {getRecommendationReason(shop)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>  ), [onShopPress, getRecommendationReason]);
  
  // Return the base shop section with customized card rendering
  return (
    <BaseShopSection
      title="Recommended for You"
      shops={personalizedShops}
      onShopPress={onShopPress}
      onViewAllPress={onViewAllPress}
      limit={limit}
      showViewAll={!!onViewAllPress}
      renderCustomCard={renderCustomCard}
      cardWidth={180}
    />  );
});

// Add display name for debugging
PersonalizedRecommendations.displayName = 'PersonalizedRecommendations';

const recommendationStyles = StyleSheet.create({
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reasonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#2E5AA7',
    marginLeft: 4,
  },
});

export default PersonalizedRecommendations;
