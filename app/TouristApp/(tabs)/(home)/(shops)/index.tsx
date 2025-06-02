// app/(tabs)/(home)/(shops)/index.tsx - Clean and simple
import ShopDirectory from '@/components/shops/ShopDirectory';
import {
  destinations,
  featuredShops,
  mainCategories,
} from '@/Controller/ShopData';
import React from 'react';

const ShopsIndex = () => {
  // Simple category data transformation
  const categories = mainCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
  }));

  return (
    <ShopDirectory
      shops={destinations}
      categories={categories}
      featuredShops={featuredShops}
    />
  );
};

export default ShopsIndex;
