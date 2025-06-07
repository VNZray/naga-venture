import SpecialOfferCard from '@/components/shops/SpecialOfferCard';
import { ShopColors } from '@/constants/ShopColors';
import { useAllSpecialOffers } from '@/hooks/useShops';
import { ShopNavigator } from '@/navigation/ShopNavigator';
import { SpecialOffer } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons'; // Re-added for View All button
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity, // Re-added for View All button
  View,
} from 'react-native';

// Consider creating and importing a SkeletonCardList component
// import SkeletonCardList from '@/components/skeletons/SkeletonCardList';

export const SpecialOffersSection = () => {
  const { data: specialOffersData, isLoading, error } = useAllSpecialOffers();

  const handleSpecialOfferPress = (offerId: string) => {
    ShopNavigator.goToSpecialOfferDetails(offerId);
  };

  const handleViewAllSpecialOffers = () => {
    // Navigate to a new screen that shows a ShopGridScreen of all special offers.
    // This navigation path needs to be defined in your navigator.
    // Example: router.push('/TouristApp/(tabs)/(home)/(shops)/all-special-offers');
    ShopNavigator.goToAllSpecialOffers(); // Assuming this function is updated or will be created
    // to navigate to a screen listing all offers.
  };

  const renderSpecialOfferCard = ({ item }: { item: SpecialOffer }) => (
    <SpecialOfferCard offer={item} onPress={handleSpecialOfferPress} />
  );

  if (isLoading) {
    // Replace with Skeleton Loader if implemented
    // return (
    //   <View style={styles.section}>
    //     <View style={styles.sectionHeader}>
    //       <Text style={styles.sectionTitle}>Special Offers</Text>
    //       {/* Optionally, show a disabled or placeholder View All button */}
    //     </View>
    //     {/* <SkeletonCardList count={3} horizontal={true} /> */}
    //     <ActivityIndicator size="large" color={ShopColors.accent} style={{ marginVertical: 20}} />
    //   </View>
    // );
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
        <TouchableOpacity
          style={styles.viewAllButton} // Re-added View All button
          onPress={handleViewAllSpecialOffers}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={ShopColors.accent}
          />
        </TouchableOpacity>
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
    justifyContent: 'space-between', // Reverted to space-between for View All button
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  viewAllButton: {
    // Re-added styles for View All button
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8, // Added some padding for better touch area
  },
  viewAllText: {
    // Re-added styles for View All text
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.accent,
    marginRight: 4,
  },
  horizontalListContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  horizontalListItemSeparator: {
    width: 12,
  },
});
