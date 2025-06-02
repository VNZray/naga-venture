// app/(tabs)/(home)/(shops)/(categories)/featured.tsx
import ShopCategoryPage from '@/components/shops/ShopCategoryPage';
import { featuredShops } from '@/Controller/ShopData';
import React from 'react';

/**
 * FeaturedShopsPage - Shows all featured shops
 */
const FeaturedShopsPage = () => {
  return (
    <ShopCategoryPage
      category={{
        id: 'featured',
        name: 'Featured Shops',
        icon: 'star',
      }}
      shops={featuredShops}
    />
  );
};

export default FeaturedShopsPage;
