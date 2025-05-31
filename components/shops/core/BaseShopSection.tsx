// Base Shop Section Component - Eliminates code duplication across shop components
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface BaseShopSectionProps {
  title: string;
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  onViewAllPress?: () => void;
  limit?: number;
  cardWidth?: number;
  showViewAll?: boolean;
  renderCustomCard?: (shop: ShopData, index: number, styles: any, colors: ColorScheme) => React.ReactNode;
  renderCustomBadge?: (shop: ShopData, index: number, styles: any) => React.ReactNode;
  showRating?: boolean;
  showCategory?: boolean;
  showPrice?: boolean;
  showDistance?: boolean;
  emptyMessage?: string;
  customStyles?: Partial<typeof defaultStyles>;
}

export interface ColorScheme {
  textColor: string;
  subtextColor: string;
  backgroundColor: string;
  cardBackground: string;
  borderColor: string;
}

const BaseShopSection: React.FC<BaseShopSectionProps> = React.memo(({
  title,
  shops,
  onShopPress,
  onViewAllPress,
  limit = 6,
  cardWidth = 180,
  showViewAll = true,
  renderCustomCard,
  renderCustomBadge,
  showRating = true,
  showCategory = true,
  showPrice = false,
  showDistance = false,
  emptyMessage,
  customStyles = {},
}) => {
  const colorScheme = useColorScheme();
  
  // Memoized color scheme - only recalculates when colorScheme changes
  const colors: ColorScheme = useMemo(() => ({
    textColor: colorScheme === 'dark' ? '#ffffff' : '#1A1A1A',
    subtextColor: colorScheme === 'dark' ? '#94A3B8' : '#6B7280',
    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
    cardBackground: colorScheme === 'dark' ? '#334155' : '#F8FAFB',
    borderColor: colorScheme === 'dark' ? '#475569' : '#E5E7EB',
  }), [colorScheme]);

  // Memoized styles - only recalculates when customStyles changes
  const styles = useMemo(() => ({ ...defaultStyles, ...customStyles }), [customStyles]);  // Memoized filtered shops - only recalculates when shops or limit changes
  const displayShops = useMemo(() => shops.slice(0, limit), [shops, limit]);

  // Memoized view all press handler - only recreates when onViewAllPress changes
  const handleViewAllPress = useCallback(() => {
    onViewAllPress?.();
  }, [onViewAllPress]);

  // Memoized default card renderer - only recreates when dependencies change
  const renderDefaultCard = useCallback((shop: ShopData, index: number) => (
    <TouchableOpacity
      key={shop.id}
      style={[
        styles.shopCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.borderColor,
          width: cardWidth,
        },
      ]}
      onPress={() => onShopPress(shop.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: shop.image }}
          style={styles.shopImage}
          resizeMode="cover"
        />
        
        {/* Custom badge rendering */}
        {renderCustomBadge && renderCustomBadge(shop, index, styles)}
        
        {/* Default badges */}
        {showRating && shop.rating && !renderCustomBadge && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingBadgeText}>{shop.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.shopInfo}>
        <Text style={[styles.shopName, { color: colors.textColor }]} numberOfLines={1}>
          {shop.name}
        </Text>
        
        {showCategory && shop.category && (
          <Text style={[styles.shopCategory, { color: colors.subtextColor }]} numberOfLines={1}>
            {shop.category}
          </Text>
        )}
        
        <View style={styles.shopFooter}>
          {showRating && shop.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={[styles.ratingText, { color: colors.textColor }]}>
                {shop.rating.toFixed(1)}
              </Text>
            </View>
          )}
          
          {showPrice && shop.priceRange && (
            <Text style={[styles.priceText, { color: colors.subtextColor }]}>
              {shop.priceRange}
            </Text>
          )}
          
          {showDistance && (shop as any).calculatedDistance !== undefined && (
            <Text style={[styles.distanceText, { color: colors.subtextColor }]}>
              {(shop as any).calculatedDistance < 1 
                ? `${Math.round((shop as any).calculatedDistance * 1000)}m`
                : `${(shop as any).calculatedDistance.toFixed(1)}km`
              }
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), [cardWidth, colors, onShopPress, renderCustomBadge, showCategory, showDistance, showPrice, showRating, styles]);

  // Show empty state if no shops
  if (displayShops.length === 0) {
    if (emptyMessage) {
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
          </View>
          <View style={[styles.emptyContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.emptyText, { color: colors.subtextColor }]}>
              {emptyMessage}
            </Text>
          </View>
        </View>
      );    }
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Standardized Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>        {showViewAll && onViewAllPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllPress}>
            <Text style={[styles.viewAllText, { color: '#2E5AA7' }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Horizontal Scroll View */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayShops.map((shop, index) => 
          renderCustomCard 
            ? renderCustomCard(shop, index, styles, colors)
            : renderDefaultCard(shop, index)
        )}
      </ScrollView>    </View>
  );
});

// Add display name for debugging
BaseShopSection.displayName = 'BaseShopSection';

// Default standardized styles
const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 32, // Standardized spacing for drop shadow
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18, // Standardized title size
    fontFamily: 'Poppins-SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8, // Standardized bottom padding for drop shadow
    gap: 12, // Standardized gap between cards
  },
  shopCard: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 90, // Standardized image height
  },
  shopImage: {
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
    marginLeft: 2,
  },
  shopInfo: {
    padding: 12,
  },
  shopName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginLeft: 2,
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  distanceText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default BaseShopSection;
export { defaultStyles as BaseShopSectionStyles };
