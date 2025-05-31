// Trending Shops Component
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

interface TrendingShopsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  title?: string;
}

const TrendingShops: React.FC<TrendingShopsProps> = ({ 
  shops, 
  onShopPress,
  title = "Trending Shops"
}) => {
  const colorScheme = useColorScheme();
  
  const backgroundColor = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';

  // Get top trending shops (highest rated with good review count)
  const trendingShops = shops
    .filter(shop => shop.rating >= 4.0 && shop.ratingCount >= 50)
    .sort((a, b) => {
      // Sort by rating * log(ratingCount) for trending score
      const scoreA = a.rating * Math.log(a.ratingCount + 1);
      const scoreB = b.rating * Math.log(b.ratingCount + 1);
      return scoreB - scoreA;
    })
    .slice(0, 6);

  if (trendingShops.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: '#2E5AA7' }]}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {trendingShops.map((shop, index) => (
          <TouchableOpacity
            key={shop.id}
            style={[styles.shopCard, { backgroundColor }]}
            onPress={() => onShopPress(shop.id)}
            activeOpacity={0.8}
          >
            {/* Trending badge for top 3 */}
            {index < 3 && (
              <View style={[styles.trendingBadge, {
                backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'
              }]}>
                <Text style={styles.trendingRank}>#{index + 1}</Text>
              </View>
            )}
            
            <Image
              source={{ uri: shop.image }}
              style={styles.shopImage}
              resizeMode="cover"
            />
            
            <View style={styles.shopInfo}>
              <Text style={[styles.shopName, { color: textColor }]} numberOfLines={1}>
                {shop.name}
              </Text>
              <Text style={[styles.shopCategory, { color: subtextColor }]} numberOfLines={1}>
                {shop.category}
              </Text>
              
              <View style={styles.metricsContainer}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: textColor }]}>
                    {shop.rating.toFixed(1)}
                  </Text>
                </View>
                
                <View style={styles.reviewsContainer}>
                  <Ionicons name="chatbubble-outline" size={10} color={subtextColor} />
                  <Text style={[styles.reviewsText, { color: subtextColor }]}>
                    {shop.ratingCount}
                  </Text>
                </View>
              </View>
              
              {/* Trending indicator */}
              <View style={styles.trendingIndicator}>
                <Ionicons name="trending-up" size={10} color="#EF4444" />
                <Text style={[styles.trendingText, { color: '#EF4444' }]}>Trending</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({  container: {
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
  },  shopCard: {
    width: 180,
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
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
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
  shopImage: {
    width: '100%',
    height: 90,
  },  shopInfo: {
    padding: 12,
  },
  shopName: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 3,
  },
  shopCategory: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  metricsContainer: {
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
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 2,
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
