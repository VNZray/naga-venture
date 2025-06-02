// app/(tabs)/(home)/(shops)/(categories)/special-offers.tsx
import ShopCategoryPage from '@/components/shops/ShopCategoryPage';
import { destinations } from '@/Controller/ShopData';
import React from 'react';

/**
 * SpecialOffersPage - Shows shops with special offers
 * For now using static selection, can be enhanced with actual offers data
 */
const SpecialOffersPage = () => {
  // For representation purposes, using first 10 shops as "special offers"
  // In a real app, this would filter shops that actually have special offers/promotions
  const specialOffersShops = destinations.slice(0, 10);

  return (
    <ShopCategoryPage
      category={{
        id: 'special-offers',
        name: 'Special Offers',
        icon: 'pricetag',
      }}
      shops={specialOffersShops}
    />
  );
};

export default SpecialOffersPage;
