import SpecialOfferCard from '@/components/shops/SpecialOfferCard';
import { ShopColors } from '@/constants/ShopColors';
import { useAllSpecialOffers } from '@/hooks/useShops'; // Import the new hook
import { ShopNavigator } from '@/navigation/ShopNavigator';
import { SpecialOffer } from '@/types/shop'; // Import the SpecialOffer type
import React from 'react';
import {
  ActivityIndicator, // Added for loading state
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const SpecialOffersSection = () => {
  const { data: specialOffersData, isLoading, error } = useAllSpecialOffers(); // Use the hook to fetch all special offers

  const handleSpecialOfferPress = (offerId: string) => {
    // Navigate to the specific offer details page
    ShopNavigator.goToSpecialOfferDetails(offerId);
  };

  const renderSpecialOfferCard = ({ item }: { item: SpecialOffer }) => (
    <SpecialOfferCard offer={item} onPress={handleSpecialOfferPress} />
  );

  if (isLoading) {
    return (
      <View style={[styles.section, styles.centered]}>
        <ActivityIndicator size="large" color={ShopColors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.section, styles.centered]}>
        <Text style={styles.errorText}>
          Could not load special offers. Please try again later.
        </Text>
      </View>
    );
  }

  if (!specialOffersData || specialOffersData.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
      </View>
      <FlatList
        data={specialOffersData}
        renderItem={renderSpecialOfferCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContentContainer}
        ItemSeparatorComponent={() => (
          <View style={styles.horizontalListItemSeparator} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.error,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Or 'center' if title should be centered
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  horizontalListContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  horizontalListItemSeparator: {
    width: 12,
  },
});
