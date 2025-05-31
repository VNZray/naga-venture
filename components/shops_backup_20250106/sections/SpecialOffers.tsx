import { ShopsData } from '@/app/Controller/ShopData';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import BaseShopSection from '../core/BaseShopSection';

interface SpecialOffersProps {
  limit?: number;
  showViewAll?: boolean;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ 
  limit = 6,
  showViewAll = true 
}) => {
  // Filter shops with special offers (high rating shops for now)
  const offersShops = ShopsData
    .filter((shop: ShopData) => shop.rating >= 4.5)
    .slice(0, limit);
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/${shopId}`);
  };

  const handleViewAll = () => {
    router.push('/(tabs)/(home)/(shops)/offers');
  };

  const renderOfferBadge = (shop: ShopData, index: number, styles: any) => (
    <View style={[styles.ratingBadge, { backgroundColor: '#FF6B6B' }]}>
      <Ionicons name="flame" size={12} color="#FFFFFF" />
      <Text style={styles.ratingBadgeText}>Special</Text>
    </View>
  );

  return (
    <BaseShopSection
      title="Special Offers"
      shops={offersShops}
      onShopPress={handleShopPress}
      onViewAllPress={showViewAll ? handleViewAll : undefined}
      showViewAll={showViewAll}
      limit={limit}
      showRating={true}
      showCategory={true}
      renderCustomBadge={renderOfferBadge}
      emptyMessage="No special offers available at the moment"
    />
  );
};

export default SpecialOffers;
