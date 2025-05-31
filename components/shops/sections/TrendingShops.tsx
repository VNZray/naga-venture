// Trending Shops Component - Simplified for better performance
import { ShopsData } from '@/app/Controller/ShopData';
import type { ShopData } from '@/types/shop';
import { getTrendingShops } from '@/utils/shopUtils';
import { router } from 'expo-router';
import React from 'react';
import BaseShopSection from '../core/BaseShopSection';

interface TrendingShopsProps {
  limit?: number;
  showViewAll?: boolean;
}

const TrendingShops: React.FC<TrendingShopsProps> = ({ 
  limit = 6,
  showViewAll = true 
}) => {
  // Simple trending shops calculation
  const trendingShops = getTrendingShops(ShopsData as ShopData[], limit);

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const handleViewAll = () => {
    router.push('/(tabs)/(home)/(shops)/');
  };

  return (
    <BaseShopSection
      title="Trending Shops"
      shops={trendingShops}
      onShopPress={handleShopPress}
      onViewAllPress={showViewAll ? handleViewAll : undefined}
      showViewAll={showViewAll}
      limit={limit}
      showRating={true}
      showCategory={true}
      emptyMessage="No trending shops available at the moment"
    />
  );
};

export default TrendingShops;
