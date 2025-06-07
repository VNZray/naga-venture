// app/(tabs)/(home)/(shops)/(details)/[shopId].tsx - REFACTORED

import { ErrorState } from '@/components/shops/ErrorState';
import ShopDetail from '@/components/shops/ShopDetail';
import { useShop } from '@/hooks/useShops';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator } from 'react-native'; // Removed View import

const ShopDetailsPage = () => {
  const { shopId } = useLocalSearchParams();
  const id = Array.isArray(shopId) ? shopId[0] : shopId || '';

  // Fetch data using the hook. No more direct imports!
  const { data: shop, isLoading, isError, refetch } = useShop(id);

  // Handle Loading and Error states
  if (isLoading) {
    // You can replace this with a beautiful skeleton loader for the detail page
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, alignSelf: 'center' }}
      />
    );
  }

  if (isError) {
    return (
      <ErrorState message="Could not load shop details." onRetry={refetch} />
    );
  }

  // Handle case where shop is not found by the API
  if (!shop) {
    // Render your "Not Found" view from ShopDetail or a dedicated component
    return <ShopDetail shop={null} />;
  }

  // Render the "dumb" presentational component with the fetched data
  return <ShopDetail shop={shop} />;
};

export default ShopDetailsPage;
