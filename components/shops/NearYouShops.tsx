// Near You Shops Component (Simulated for demo)
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NearYouShopsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  maxDistance?: number; // in kilometers
  limit?: number;
}

interface ShopWithDistance extends ShopData {
  calculatedDistance: number; // New property to avoid conflict
}

const NearYouShops: React.FC<NearYouShopsProps> = ({ 
  shops, 
  onShopPress,
  maxDistance = 5,
  limit = 6
}) => {
  const colorScheme = useColorScheme();
  const [locationPermission, setLocationPermission] = useState(true); // Simplified for demo
  const [nearbyShops, setNearbyShops] = useState<ShopWithDistance[]>([]);
  
  const backgroundColor = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';

  useEffect(() => {
    // For demo purposes, simulate nearby shops by taking a random selection
    // In a real app, you would calculate actual distances based on user location
    const simulatedNearbyShops = shops
      .map(shop => ({
        ...shop,
        calculatedDistance: Math.random() * maxDistance // Simulated distance
      }))
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
      .slice(0, limit);
    
    setNearbyShops(simulatedNearbyShops);
  }, [shops, maxDistance, limit]);
  const handleLocationPress = () => {
    // For demo - in real app, would request location permission
    setLocationPermission(true);
    console.log('Location feature would be enabled here');
  };

  if (!locationPermission) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.locationPrompt, { backgroundColor }]}
          onPress={handleLocationPress}
        >
          <Ionicons name="location-outline" size={24} color="#2E5AA7" />
          <Text style={[styles.promptTitle, { color: textColor }]}>
            Enable Location
          </Text>
          <Text style={[styles.promptSubtitle, { color: subtextColor }]}>
            Find shops near you
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (nearbyShops.length === 0) {
    return (      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: textColor }]}>Near You</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/(home)/(shops)/near-you')} style={styles.refreshButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.noShopsText, { color: subtextColor }]}>
          No shops found within {maxDistance}km
        </Text>
      </View>
    );
  }

  return (    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>Near You</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/(home)/(shops)/near-you')} style={styles.refreshButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {nearbyShops.map((shop) => (
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
              <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>
                {shop.calculatedDistance < 1 
                  ? `${Math.round(shop.calculatedDistance * 1000)}m`
                  : `${shop.calculatedDistance.toFixed(1)}km`
                }
              </Text>
            </View>
            
            <View style={styles.shopInfo}>
              <Text style={[styles.shopName, { color: textColor }]} numberOfLines={1}>
                {shop.name}
              </Text>
              <Text style={[styles.shopCategory, { color: subtextColor }]} numberOfLines={1}>
                {shop.category}
              </Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={[styles.ratingText, { color: textColor }]}>
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
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#3498DB',
  },
  refreshButton: {
    padding: 4,
  },
  locationPrompt: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 8,
  },
  promptSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  noShopsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    padding: 20,
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
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 90,
  },
  distanceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(46, 90, 167, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  distanceText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
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

export default NearYouShops;
