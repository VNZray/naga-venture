// Near You Shops Component (Simulated for demo) - Refactored to use BaseShopSection
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseShopSection, { ColorScheme } from '../core/BaseShopSection';

interface NearYouShopsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  onViewAllPress?: () => void;
  maxDistance?: number; // in kilometers
  limit?: number;
}

interface ShopWithDistance extends ShopData {
  calculatedDistance: number;
}

const NearYouShops: React.FC<NearYouShopsProps> = React.memo(({ 
  shops, 
  onShopPress,
  onViewAllPress,
  maxDistance = 5,  limit = 6
}) => {
  const [locationPermission, setLocationPermission] = useState(true); // Simplified for demo
  const [nearbyShops, setNearbyShops] = useState<ShopWithDistance[]>([]);

  // Memoized nearby shops calculation - only recalculates when dependencies change
  const simulatedNearbyShops = useMemo(() => 
    shops
      .map(shop => ({
        ...shop,
        calculatedDistance: Math.random() * maxDistance // Simulated distance
      }))
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
      .slice(0, limit),
    [shops, maxDistance, limit]
  );

  useEffect(() => {
    setNearbyShops(simulatedNearbyShops);
  }, [simulatedNearbyShops]);

  // Memoized location press handler
  const handleLocationPress = useCallback(() => {
    // For demo - in real app, would request location permission
    setLocationPermission(true);
    console.log('Location feature would be enabled here');
  }, []);

  // Memoized view all handler
  const handleViewAll = useCallback(() => {
    if (onViewAllPress) {
      onViewAllPress();
    } else {
      router.push('/(tabs)/(home)/(shops)/near-you');
    }
  }, [onViewAllPress]);

  // Memoized custom card renderer for distance badge
  const renderNearbyCard = useCallback((shop: ShopData, index: number, styles: any, colors: ColorScheme) => {
    // Cast to ShopWithDistance since we know our shops have calculatedDistance
    const shopWithDistance = shop as ShopWithDistance;
    
    return (
      <TouchableOpacity
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
          <Image
            source={{ uri: shop.image }}
            style={styles.shopImage}
            resizeMode="cover"
          />
          <View style={nearbyStyles.distanceBadge}>
            <Text style={nearbyStyles.distanceText}>
              {shopWithDistance.calculatedDistance < 1 
                ? `${Math.round(shopWithDistance.calculatedDistance * 1000)}m`
                : `${shopWithDistance.calculatedDistance.toFixed(1)}km`
              }
            </Text>
          </View>
        </View>
        
        <View style={styles.shopInfo}>
          <Text style={[styles.shopName, { color: colors.textColor }]} numberOfLines={1}>
            {shop.name}
          </Text>
          <Text style={[styles.shopCategory, { color: colors.subtextColor }]} numberOfLines={1}>
            {shop.category}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.textColor }]}>
              {shop.rating.toFixed(1)}
            </Text>
          </View>        </View>
      </TouchableOpacity>
    );
  }, [onShopPress]);

  if (!locationPermission) {
    return (
      <View style={nearbyStyles.container}>
        <TouchableOpacity 
          style={nearbyStyles.locationPrompt}
          onPress={handleLocationPress}
        >
          <Ionicons name="location-outline" size={24} color="#2E5AA7" />
          <Text style={nearbyStyles.promptTitle}>
            Enable Location
          </Text>
          <Text style={nearbyStyles.promptSubtitle}>
            Find shops near you
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (nearbyShops.length === 0) {
    return (
      <BaseShopSection
        title="Near You"
        shops={[]}
        onShopPress={onShopPress}
        onViewAllPress={handleViewAll}
        emptyMessage={`No shops found within ${maxDistance}km`}
      />
    );
  }

  return (
    <BaseShopSection
      title="Near You"
      shops={nearbyShops}
      onShopPress={onShopPress}
      onViewAllPress={handleViewAll}
      renderCustomCard={renderNearbyCard}
      showCategory={true}
      showRating={true}
    />  );
});

// Add display name for debugging
NearYouShops.displayName = 'NearYouShops';

const nearbyStyles = StyleSheet.create({
  container: {
    marginBottom: 32,
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
    backgroundColor: '#FFFFFF',
  },
  promptTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 8,
    color: '#1A1A1A',
  },
  promptSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    color: '#6B7280',
  },
  // Custom styles for distance badge
  distanceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(46, 90, 167, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  distanceText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default NearYouShops;
