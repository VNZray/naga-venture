// Horizontal Shop List Component
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

interface HorizontalShopListProps {
  shops: ShopData[];
  onShopPress: (id: string) => void;
  title?: string;
  showViewAll?: boolean;
  onViewAllPress?: () => void;
  showRating?: boolean;
  showCategory?: boolean;
  showDistance?: boolean;
  showPrice?: boolean;
  emptyMessage?: string;
  cardWidth?: number;
}

/**
 * HorizontalShopList - Horizontal scrolling shop list component
 * Consistent with other horizontal components but for general shop listing
 */
const HorizontalShopList: React.FC<HorizontalShopListProps> = ({
  shops,
  onShopPress,
  title = "Shops",
  showViewAll = true,
  onViewAllPress,
  showRating = true,
  showCategory = true,
  showDistance = false,
  showPrice = false,
  emptyMessage = "No shops found",
  cardWidth = 180,
}) => {
  const colorScheme = useColorScheme();
  
  const backgroundColor = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';
  const cardBackground = colorScheme === 'dark' ? '#334155' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#475569' : '#E5E7EB';

  if (shops.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: subtextColor }]}>
            {emptyMessage}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {showViewAll && onViewAllPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
            <Text style={[styles.viewAllText, { color: '#2E5AA7' }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {shops.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={[
              styles.shopCard, 
              { 
                backgroundColor: cardBackground, 
                borderColor,
                width: cardWidth 
              }
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
              
              {/* Category Badge */}
              {showCategory && shop.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{shop.category}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.shopInfo}>
              <Text style={[styles.shopName, { color: textColor }]} numberOfLines={1}>
                {shop.name}
              </Text>
              
              <View style={styles.detailsContainer}>
                {/* Rating */}
                {showRating && shop.rating && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={[styles.ratingText, { color: textColor }]}>
                      {shop.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
                
                {/* Price */}
                {showPrice && shop.priceRange && (
                  <Text style={[styles.priceText, { color: subtextColor }]}>
                    {shop.priceRange}
                  </Text>
                )}
              </View>
              
              {/* Distance */}
              {showDistance && shop.distance && (
                <Text style={[styles.distanceText, { color: subtextColor }]}>
                  {shop.distance}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32, // Increased from 24 to provide space for drop shadow
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
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
    paddingBottom: 8, // Added bottom padding for drop shadow
    gap: 12,
  },
  shopCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 90,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(46, 90, 167, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  shopInfo: {
    padding: 12,
  },
  shopName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 6,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginLeft: 3,
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  distanceText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default HorizontalShopList;
