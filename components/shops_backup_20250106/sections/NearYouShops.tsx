import { ShopsData } from '@/app/Controller/ShopData';
import type { ShopData } from '@/types/shop';
import { getShopsWithinDistance } from '@/utils/shopUtils';
import { router } from 'expo-router';
import React from 'react';
import BaseShopSection from '../core/BaseShopSection';

interface NearYouShopsProps {
  userLocation?: { latitude: number; longitude: number };
  maxDistance?: number;
  limit?: number;
  showViewAll?: boolean;
}

const NearYouShops: React.FC<NearYouShopsProps> = ({ 
  userLocation,
  maxDistance = 5, // 5km default
  limit = 6,
  showViewAll = true 
}) => {
  if (!userLocation) {
    return null;
  }

  // Calculate nearby shops
  const nearbyShops = getShopsWithinDistance(
    ShopsData as ShopData[], 
    userLocation.latitude, 
    userLocation.longitude, 
    maxDistance
  ).slice(0, limit);
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/${shopId}`);
  };

  const handleViewAll = () => {
    router.push('/(tabs)/(home)/(shops)/nearby');
  };

  return (
    <BaseShopSection
      title="Near You"
      shops={nearbyShops}
      onShopPress={handleShopPress}
      onViewAllPress={showViewAll ? handleViewAll : undefined}
      showViewAll={showViewAll}
      limit={limit}
      showRating={true}
      showDistance={true}
      emptyMessage="No shops found near your location"
    />
  );
};

export default NearYouShops;
