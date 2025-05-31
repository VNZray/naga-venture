// Trending Shops Component - Refactored to use BaseShopSection
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseShopSection, { ColorScheme } from '../core/BaseShopSection';

interface TrendingShopsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  onViewAllPress?: () => void;
  title?: string;
  limit?: number;
}

const TrendingShops: React.FC<TrendingShopsProps> = React.memo(({ 
  shops, 
  onShopPress,
  onViewAllPress,
  title = "Trending Shops",
  limit = 6
}) => {
  // Memoized trending shops calculation - only recalculates when shops or limit changes
  const trendingShops = useMemo(() => 
    shops
      .filter(shop => shop.rating >= 4.0 && shop.ratingCount >= 50)
      .sort((a, b) => {
        // Sort by rating * log(ratingCount) for trending score
        const scoreA = a.rating * Math.log(a.ratingCount + 1);
        const scoreB = b.rating * Math.log(b.ratingCount + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit),
    [shops, limit]
  );

  // Memoized custom card renderer for trending badges
  const renderTrendingCard = useCallback((shop: ShopData, index: number, styles: any, colors: ColorScheme) => (
    <TouchableOpacity
      key={shop.id}
      style={[
        styles.shopCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.borderColor,
          width: 180,
        },
      ]}
      onPress={() => onShopPress(shop.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {/* Trending badge for top 3 */}
        {index < 3 && (
          <View style={[trendingStyles.trendingBadge, {
            backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'
          }]}>
            <Text style={trendingStyles.trendingRank}>#{index + 1}</Text>
          </View>
        )}
        
        <Image
          source={{ uri: shop.image }}
          style={styles.shopImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.shopInfo}>
        <Text style={[styles.shopName, { color: colors.textColor }]} numberOfLines={1}>
          {shop.name}
        </Text>
        <Text style={[styles.shopCategory, { color: colors.subtextColor }]} numberOfLines={1}>
          {shop.category}
        </Text>
        
        <View style={trendingStyles.metricsContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.textColor }]}>
              {shop.rating.toFixed(1)}
            </Text>
          </View>
          
          <View style={trendingStyles.reviewsContainer}>
            <Ionicons name="chatbubble-outline" size={10} color={colors.subtextColor} />
            <Text style={[trendingStyles.reviewsText, { color: colors.subtextColor }]}>
              {shop.ratingCount}
            </Text>
          </View>
        </View>
        
        {/* Trending indicator */}
        <View style={trendingStyles.trendingIndicator}>
          <Ionicons name="trending-up" size={10} color="#EF4444" />
          <Text style={[trendingStyles.trendingText, { color: '#EF4444' }]}>Trending</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [onShopPress]);

  return (
    <BaseShopSection
      title={title}
      shops={trendingShops}
      onShopPress={onShopPress}
      onViewAllPress={onViewAllPress}
      limit={limit}
      cardWidth={180}
      showViewAll={!!onViewAllPress}
      renderCustomCard={renderTrendingCard}
      showRating={false} // We handle rating in custom card
      showCategory={false} // We handle category in custom card
      emptyMessage="No trending shops available"
    />  );
});

// Add display name for debugging
TrendingShops.displayName = 'TrendingShops';

// Custom styles for trending-specific elements
const trendingStyles = StyleSheet.create({
  trendingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trendingRank: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginLeft: 2,
  },
  trendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingText: {
    fontSize: 9,
    fontFamily: 'Poppins-Medium',
    marginLeft: 2,
  },
});

export default TrendingShops;
