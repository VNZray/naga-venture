// Example usage of optimized shop components with shared hooks
import {
    NearYouShops,
    PersonalizedRecommendations,
    SpecialOffers,
    TrendingShops,
    useShopNavigation
} from '@/components/shops';
import type { ShopData } from '@/types/shop';
import React from 'react';
import { View } from 'react-native';

interface OptimizedShopsExampleProps {
  shops: ShopData[];
}

const OptimizedShopsExample: React.FC<OptimizedShopsExampleProps> = React.memo(({ shops }) => {
  // Use shared hooks for common functionality
  const { navigateToShop, navigateToCategory } = useShopNavigation();

  return (
    <View>
      {/* All components now optimized with React.memo, useCallback, and useMemo */}
      <TrendingShops 
        shops={shops} 
        onShopPress={navigateToShop}
        onViewAllPress={() => navigateToCategory('trending')}
        limit={6}
      />
      
      <PersonalizedRecommendations 
        shops={shops} 
        onShopPress={navigateToShop}
        onViewAllPress={() => navigateToCategory('recommended')}
        limit={6}
      />
      
      <SpecialOffers 
        shops={shops} 
        onShopPress={navigateToShop}
        onViewAllPress={() => navigateToCategory('offers')}
        limit={5}
      />
      
      <NearYouShops 
        shops={shops} 
        onShopPress={navigateToShop}
        maxDistance={5}
        limit={6}
      />
    </View>
  );
});

OptimizedShopsExample.displayName = 'OptimizedShopsExample';

export default OptimizedShopsExample;
