// Recently Viewed Shops Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RecentlyViewedShopsProps {
  onShopPress: (shopId: string) => void;
  currentShopId?: string; // To avoid showing current shop in recently viewed
}

const RECENT_SHOPS_KEY = 'recently_viewed_shops';
const MAX_RECENT_SHOPS = 4;

const RecentlyViewedShops: React.FC<RecentlyViewedShopsProps> = ({ 
  onShopPress, 
  currentShopId 
}) => {
  const colorScheme = useColorScheme();
  const [recentShops, setRecentShops] = useState<ShopData[]>([]);
  
  const backgroundColor = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';
  const loadRecentShops = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SHOPS_KEY);
      if (stored) {
        const shops: ShopData[] = JSON.parse(stored);
        // Filter out current shop if provided
        const filtered = currentShopId 
          ? shops.filter(shop => shop.id !== currentShopId)
          : shops;
        setRecentShops(filtered);
      }
    } catch (error) {
      console.log('Error loading recent shops:', error);
    }
  };

  useEffect(() => {
    loadRecentShops();
  }, [loadRecentShops]);
  // Function to add a shop to recently viewed (exported for use in shop detail pages)
  // const addToRecentlyViewed = async (shop: ShopData) => {
  //   try {
  //     const stored = await AsyncStorage.getItem(RECENT_SHOPS_KEY);
  //     let recentShops: ShopData[] = stored ? JSON.parse(stored) : [];
      
  //     // Remove if already exists
  //     recentShops = recentShops.filter(s => s.id !== shop.id);
      
  //     // Add to beginning
  //     recentShops.unshift(shop);
      
  //     // Keep only MAX_RECENT_SHOPS
  //     recentShops = recentShops.slice(0, MAX_RECENT_SHOPS);
      
  //     await AsyncStorage.setItem(RECENT_SHOPS_KEY, JSON.stringify(recentShops));
  //     setRecentShops(recentShops);
  //   } catch (error) {
  //     console.log('Error saving recent shop:', error);
  //   }
  // };

  if (recentShops.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>Recently Viewed</Text>
        <TouchableOpacity 
          onPress={() => {/* Could implement clear all */}}
          style={styles.clearButton}
        >
          <Text style={styles.viewAllText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentShops.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={[styles.shopCard, { backgroundColor }]}
            onPress={() => onShopPress(shop.id)}
            activeOpacity={0.8}
          >
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
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={[styles.ratingText, { color: subtextColor }]}>
                  {shop.rating.toFixed(1)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Export the utility function for use in other components
export { RecentlyViewedShops as default };
export const useRecentlyViewed = () => {
  const addToRecentlyViewed = async (shop: ShopData) => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SHOPS_KEY);
      let recentShops: ShopData[] = stored ? JSON.parse(stored) : [];
      
      recentShops = recentShops.filter(s => s.id !== shop.id);
      recentShops.unshift(shop);
      recentShops = recentShops.slice(0, MAX_RECENT_SHOPS);
      
      await AsyncStorage.setItem(RECENT_SHOPS_KEY, JSON.stringify(recentShops));
    } catch (error) {
      console.log('Error saving recent shop:', error);
    }
  };

  return { addToRecentlyViewed };
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
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#3498DB',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8, // Added bottom padding for drop shadow
    gap: 12,
  },  shopCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  shopImage: {
    width: '100%',
    height: 90,
  },
  shopInfo: {
    padding: 12,
  },
  shopName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#F39C12',
    marginLeft: 2,
  },
});
