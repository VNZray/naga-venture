import { ShopsData } from '@/app/Controller/ShopData';
import type { ShopData } from '@/types/shop';
import { sortShopsByRating } from '@/utils/shopUtils';
import { router } from 'expo-router';
import React from 'react';
import BaseShopSection from '../core/BaseShopSection';

interface PersonalizedRecommendationsProps {
  userPreferences?: string[];
  limit?: number;
  showViewAll?: boolean;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ 
  userPreferences = [],
  limit = 6,
  showViewAll = true 
}) => {
  // Filter by user preferences if available
  let filtered = ShopsData as ShopData[];
  
  if (userPreferences.length > 0) {
    filtered = filtered.filter(shop => 
      userPreferences.some(pref => 
        shop.category?.toLowerCase().includes(pref.toLowerCase())
      )
    );
  }
  
  // Sort by rating and return limited results
  const recommendedShops = sortShopsByRating(filtered).slice(0, limit);
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/${shopId}`);
  };

  const handleViewAll = () => {
    router.push('/(tabs)/(home)/(shops)/search?type=recommended');
  };

  return (
    <BaseShopSection
      title="Recommended for You"
      shops={recommendedShops}
      onShopPress={handleShopPress}
      onViewAllPress={showViewAll ? handleViewAll : undefined}
      showViewAll={showViewAll}
      limit={limit}
      showRating={true}
      showCategory={true}
      emptyMessage="No recommendations available. Try browsing different categories!"
    />
  );
};

export default PersonalizedRecommendations;
