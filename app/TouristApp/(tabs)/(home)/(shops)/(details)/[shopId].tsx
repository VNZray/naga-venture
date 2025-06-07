// app/(tabs)/(home)/(shops)/(details)/[shopId].tsx - REFACTORED

import { ErrorState } from '@/components/shops/ErrorState';
import ShopDetail from '@/components/shops/ShopDetail';
import ShopDetailSkeleton from '@/components/shops/skeletons/ShopDetailSkeleton';
import { ShopColors } from '@/constants/ShopColors';
import { useShop, useToggleFavorite } from '@/hooks/useShops';
import type { ShopData } from '@/types/shop'; // Import ShopData type
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// A simple "Not Found" component
const NotFoundComponent = () => (
  <View style={styles.notFoundContainer}>
    <Text style={styles.notFoundTitle}>Shop Not Found</Text>
    <Text style={styles.notFoundText}>
      Sorry, we couldn&apos;t find the shop you&apos;re looking for.
    </Text>
  </View>
);

const ShopDetailsPage = () => {
  const { shopId } = useLocalSearchParams();
  const id = Array.isArray(shopId) ? shopId[0] : shopId || '';

  const { data: shop, isLoading, isError, refetch } = useShop(id);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleFavoriteToggle = () => {
    if (shop) {
      toggleFavoriteMutation.mutate(shop.id);
    }
  };

  const handleShare = async () => {
    if (!shop) return;
    try {
      // Construct a more generic share message if specific URLs are not available
      let message = `Check out ${shop.name} on NagaVenture!`;
      if (shop.location) {
        message += ` Located at: ${shop.location}`;
      }
      // If you have a deep link or web URL for the shop, add it here.
      // For now, we'll keep it simple.
      // const shopUrl = shop.socialLinks?.website; // Example

      await Share.share({
        message: message,
        // url: shopUrl,
        title: `Discover ${shop.name}`,
      });
    } catch (error: any) {
      Alert.alert('Share Error', error.message);
    }
  };

  const handleCall = () => {
    // shop.contact is a string, assumed to be the phone number
    if (shop?.contact) {
      const phoneNumber =
        Platform.OS === 'android'
          ? `tel:${shop.contact}`
          : `telprompt:${shop.contact}`;
      Linking.canOpenURL(phoneNumber)
        .then((supported) => {
          if (!supported) {
            Alert.alert(
              'Phone Error',
              'Phone calls are not supported on this device.'
            );
          } else {
            return Linking.openURL(phoneNumber);
          }
        })
        .catch((err) => Alert.alert('Phone Error', err.message));
    } else {
      Alert.alert(
        'No Phone Number',
        'This shop has not provided a phone number.'
      );
    }
  };

  const handleDirections = () => {
    if (shop?.mapLocation?.latitude && shop?.mapLocation?.longitude) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${shop.mapLocation.latitude},${shop.mapLocation.longitude}`;
      const label = shop.name;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        // For Android, geo URI with label is widely supported: geo:latitude,longitude?q=latitude,longitude(label)
        // Simpler form: geo:latitude,longitude?q=label (might be less reliable for navigation, better for search)
        android: `${scheme}${latLng}(${label})`, // Using geo:lat,lng(label) for better navigation intent
      });

      if (url) {
        Linking.openURL(url).catch((err) =>
          Alert.alert(
            'Directions Error',
            'Could not open map directions. ' + err.message
          )
        );
      } else {
        Alert.alert('Directions Error', 'Could not construct map URL.');
      }
    } else if (shop?.location) {
      // Fallback to string address if no coordinates
      const encodedAddress = encodeURIComponent(shop.location);
      const mapUrl = Platform.select({
        ios: `maps:?q=${encodedAddress}`,
        android: `geo:0,0?q=${encodedAddress}`,
      });
      if (mapUrl) {
        Linking.openURL(mapUrl).catch((err) =>
          Alert.alert(
            'Directions Error',
            'Could not open map with address. ' + err.message
          )
        );
      } else {
        Alert.alert(
          'No Directions',
          'Map directions are not available for this shop.'
        );
      }
    } else {
      Alert.alert(
        'No Directions',
        'Map directions are not available for this shop.'
      );
    }
  };

  const handleWebsite = () => {
    if (shop?.socialLinks?.website) {
      let url = shop.socialLinks.website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      Linking.openURL(url).catch((err) =>
        Alert.alert('Website Error', 'Could not open website. ' + err.message)
      );
    } else {
      Alert.alert('No Website', 'This shop has not provided a website link.');
    }
  };

  if (isLoading) {
    return <ShopDetailSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState message="Could not load shop details." onRetry={refetch} />
    );
  }

  if (!shop) {
    return <NotFoundComponent />;
  }

  // Ensure shop is not null before passing to ShopDetail which expects ShopData
  const currentShop = shop as ShopData;

  return (
    <ShopDetail
      shop={currentShop} // Pass the asserted shop data
      onFavoriteToggle={handleFavoriteToggle}
      onShare={handleShare}
      onCall={handleCall}
      onDirections={handleDirections}
      onWebsite={handleWebsite}
    />
  );
};

// Styles for NotFoundComponent (can be moved to a separate file if preferred)
const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: ShopColors.background,
  },
  notFoundTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default ShopDetailsPage;
