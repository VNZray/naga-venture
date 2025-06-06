import { specialOffersData as importedSpecialOffersData } from '@/Controller/ShopData';
import SpecialOfferCard from '@/components/shops/SpecialOfferCard';
import { ShopColors } from '@/constants/ShopColors';
import { ShopNavigator } from '@/navigation/ShopNavigator';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SpecialOfferItem {
  id: string;
  promoImageUrl: string;
  title?: string;
  altText?: string;
  targetPath?: string;
}

export const SpecialOffersSection = () => {
  const specialOffersData: SpecialOfferItem[] = useMemo(
    () => importedSpecialOffersData,
    []
  );
  const handleSpecialOfferPress = (offerId: string) => {
    const offer = specialOffersData.find((o) => o.id === offerId);
    if (offer && offer.targetPath) {
      ShopNavigator.goToSpecialOffer(offer.targetPath);
    } else {
      console.log(
        'Pressed Special Offer:',
        offerId,
        '- No targetPath defined or offer not found.'
      );
    }
  };
  const handleViewAllSpecialOffers = () => {
    ShopNavigator.goToAllSpecialOffers();
  };

  const renderSpecialOfferCard = ({ item }: { item: SpecialOfferItem }) => (
    <SpecialOfferCard offer={item} onPress={handleSpecialOfferPress} />
  );

  if (!specialOffersData || specialOffersData.length === 0) {
    return null; // Don't render the section if there's no data
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
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
