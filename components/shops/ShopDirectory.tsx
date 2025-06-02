import { specialOffersData as importedSpecialOffersData } from '@/app/Controller/ShopData';
import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
<<<<<<< HEAD
import { ScrollView, StyleSheet, View } from 'react-native';
=======
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DiscoverMoreShopList from './DiscoverMoreShopList';
import RecommendedShopCard from './RecommendedShopCard';
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428
import ShopCarousel from './ShopCarousel';
import ShopCategories from './ShopCategories';
import ShopList from './ShopList';
import ShopSearch from './ShopSearch';
import SpecialOfferCard from './SpecialOfferCard';

interface SpecialOfferItem {
  id: string;
  promoImageUrl: string;
  title?: string;
  altText?: string;
  targetPath?: string;
}

interface ShopDirectoryProps {
  shops: ShopData[];
  categories: {
    id: string;
    name: string;
    icon: string;
  }[];
  featuredShops: ShopData[];
}

const ShopDirectory: React.FC<ShopDirectoryProps> = ({
  shops,
  categories,
  featuredShops,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const specialOffersData: SpecialOfferItem[] = useMemo(
    () => importedSpecialOffersData,
    []
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ShopColors.background,
    },
    content: {
      paddingTop: 0, // Removed top padding
    },
    scrollViewContent: {
      paddingBottom: 16, // Reduced from 32
    },
    section: {
      marginBottom: 12, // Reduced from 24 - much tighter sections
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16, // Reduced from 20
      marginBottom: 8, // Reduced from 16
    },
    sectionTitle: {
      fontSize: 18, // Reduced from 20
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4, // Compact button
      paddingHorizontal: 8,
    },
    viewAllText: {
      fontSize: 14, // Reduced from 16
      fontFamily: 'Poppins-Medium',
      color: ShopColors.accent,
      marginRight: 4,
    },
    horizontalListContentContainer: {
      paddingHorizontal: 16, // Reduced from 20
      paddingVertical: 0, // Removed vertical padding
    },
    horizontalListItemSeparator: {
      width: 12, // Reduced from 16
    },
    emptyStateText: {
      paddingHorizontal: 16, // Reduced from 20
      paddingVertical: 8, // Reduced from 10
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: ShopColors.textSecondary,
      textAlign: 'center',
    },
  });

  const filteredShops = useMemo(() => {
<<<<<<< HEAD
    if (!searchQuery.trim()) return shops;

    return shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shops, searchQuery]);

  // Get recommended shops (high ratings)
  const recommendedShops = useMemo(
    () => shops.filter((shop) => shop.rating >= 4.5).slice(0, 6),
    [shops]
  );

  // Get special offers shops (static for now - could be shops with promotions)
  const specialOffersShops = useMemo(() => shops.slice(0, 6), [shops]);

  // Get discover more shops (all shops for infinite scroll-like experience)
  const discoverMoreShops = useMemo(() => shops, [shops]);
=======
    if (!searchQuery.trim()) return [];
    return shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shop.category &&
          shop.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [shops, searchQuery]);

  const recommendedShopsData = useMemo(
    () => shops.filter((shop) => shop.rating >= 4.5).slice(0, 10),
    [shops]
  );

  const discoverMoreShopsData = useMemo(() => shops, [shops]);
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428

  const handleShopPress = (shopId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const handleSpecialOfferPress = (offerId: string) => {
    const offer = specialOffersData.find((o) => o.id === offerId);
    if (offer && offer.targetPath) {
      router.push(offer.targetPath as any);
    } else {
      console.log(
        'Pressed Special Offer:',
        offerId,
        '- No targetPath defined or offer not found.'
      );
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };

<<<<<<< HEAD
  const handleViewAllFeatured = () => {
    router.push('/TouristApp/(tabs)/(home)/(shops)/FeaturedShops');
  };

  const handleViewAllRecommended = () => {
    router.push('/TouristApp/(tabs)/(home)/(shops)/RecommendedShops');
  };

  const handleViewAllSpecialOffers = () => {
    router.push('/TouristApp/(tabs)/(home)/(shops)/SpecialOffers');
  };

  const handleViewAllCategories = () => {
    router.push('/TouristApp/(tabs)/(home)/(shops)/AllCategories');
  };
=======
  const handleViewAllFeatured = () =>
    router.push('/(tabs)/(home)/(shops)/FeaturedShops');
  const handleViewAllRecommended = () =>
    router.push('/(tabs)/(home)/(shops)/RecommendedShops');
  const handleViewAllSpecialOffers = () =>
    router.push('/(tabs)/(home)/(shops)/SpecialOffers');
  const handleViewAllCategories = () =>
    router.push('/(tabs)/(home)/(shops)/AllCategories');
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428

  const searchResultsTitle = useMemo(() => {
    if (!searchQuery) return 'Search Results';
    return `Search Results (${filteredShops.length})`;
  }, [searchQuery, filteredShops.length]);

  const renderRecommendedShopCardForHorizontalList = ({
    item,
  }: {
    item: ShopData;
  }) => (
    <RecommendedShopCard shop={item} onPress={handleShopPress} width={260} /> // Slightly smaller cards
  );

  const renderSpecialOfferCard = ({ item }: { item: SpecialOfferItem }) => (
    <SpecialOfferCard offer={item} onPress={handleSpecialOfferPress} />
  );

  const handleDiscoverItemFavoriteToggle = (
    shopId: string,
    isFavorited: boolean
  ) => {
    console.log(
      `Shop ${shopId} favorite status: ${isFavorited} (from DiscoverMoreList)`
    );
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ShopSearch onSearch={setSearchQuery} value={searchQuery} />
        </View>

        {!searchQuery && (
=======
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Section - No extra wrapper */}
        <ShopSearch onSearch={setSearchQuery} value={searchQuery} />

        {!searchQuery.trim() ? (
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428
          <>
            {/* Featured Shops Section */}
            <View style={styles.section}>
              <ShopCarousel
                shops={featuredShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllFeatured}
                title="Featured Shops"
                showViewAll={true}
              />
            </View>

<<<<<<< HEAD
=======
            {/* Special Offers Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Special Offers</Text>
                {specialOffersData.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={handleViewAllSpecialOffers}
                    activeOpacity={0.7}
                  >
                    
                  </TouchableOpacity>
                )}
              </View>
              {specialOffersData.length > 0 ? (
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
              ) : (
                <Text style={styles.emptyStateText}>
                  No special offers available currently.
                </Text>
              )}
            </View>

            {/* Categories Section */}
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428
            <View style={styles.section}>
              <ShopCategories
                categories={categories}
                onCategoryPress={handleCategoryPress}
                showViewAll={true}
                onViewAllPress={handleViewAllCategories}
              />
            </View>

            {/* Recommended Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                {recommendedShopsData.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={handleViewAllRecommended}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={ShopColors.accent}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {recommendedShopsData.length > 0 ? (
                <FlatList
                  data={recommendedShopsData}
                  renderItem={renderRecommendedShopCardForHorizontalList}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContentContainer}
                  ItemSeparatorComponent={() => (
                    <View style={styles.horizontalListItemSeparator} />
                  )}
                />
              ) : (
                <Text style={styles.emptyStateText}>
                  No recommendations available right now.
                </Text>
              )}
            </View>

<<<<<<< HEAD
            <View style={styles.section}>
              <ShopList
                shops={specialOffersShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllSpecialOffers}
                title="Special Offers"
                horizontal={true}
                showRating={true}
                showCategory={true}
                showViewAll={true}
              />
            </View>

            <View style={styles.section}>
              <ShopList
                shops={discoverMoreShops}
=======
            {/* Discover More Section */}
            <View style={styles.section}>
              <DiscoverMoreShopList
                shops={discoverMoreShopsData}
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428
                onShopPress={handleShopPress}
                title="Discover More"
                onToggleFavoriteItem={handleDiscoverItemFavoriteToggle}
              />
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <ShopList
              shops={filteredShops}
              onShopPress={handleShopPress}
              title={searchResultsTitle}
              horizontal={false}
              showRating={true}
              showCategory={true}
              emptyMessage="No shops found matching your search."
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShopDirectory;
