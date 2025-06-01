import { specialOffersData as importedSpecialOffersData } from '@/app/Controller/ShopData';
import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DiscoverMoreShopList from './DiscoverMoreShopList'; // Import the new list component
import RecommendedShopCard from './RecommendedShopCard';
import ShopCarousel from './ShopCarousel';
import ShopCategories from './ShopCategories';
import ShopList from './ShopList'; // Keep for search results
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
      // Main ScrollView's style
      paddingTop: 8,
    },
    scrollViewContent: {
      // contentContainerStyle for the main ScrollView
      paddingBottom: 32, // Ensures padding at the very end of all content
    },
    section: {
      // Style for each section block
      marginBottom: 24, // Spacing between sections
    },
    sectionHeader: {
      // For sections like Recommended, Special Offers (if they have a View All)
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      // For titles within sectionHeader
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: ShopColors.accent,
      marginRight: 4,
    },
    horizontalListContentContainer: {
      // For horizontal FlatLists
      paddingHorizontal: 20,
      paddingVertical: 4,
    },
    horizontalListItemSeparator: {
      width: 16,
    },
    emptyStateText: {
      // Generic empty state text
      paddingHorizontal: 20,
      paddingVertical: 10,
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: ShopColors.textSecondary,
      textAlign: 'center',
    },
  });

  const filteredShops = useMemo(() => {
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

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
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
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };

  const handleViewAllFeatured = () =>
    router.push('/(tabs)/(home)/(shops)/FeaturedShops');
  const handleViewAllRecommended = () =>
    router.push('/(tabs)/(home)/(shops)/RecommendedShops');
  const handleViewAllSpecialOffers = () =>
    router.push('/(tabs)/(home)/(shops)/SpecialOffers');
  const handleViewAllCategories = () =>
    router.push('/(tabs)/(home)/(shops)/AllCategories');

  const searchResultsTitle = useMemo(() => {
    if (!searchQuery) return 'Search Results';
    return `Search Results (${filteredShops.length})`;
  }, [searchQuery, filteredShops.length]);

  const renderRecommendedShopCardForHorizontalList = ({
    item,
  }: {
    item: ShopData;
  }) => (
    <RecommendedShopCard shop={item} onPress={handleShopPress} width={280} />
  );

  const renderSpecialOfferCard = ({ item }: { item: SpecialOfferItem }) => (
    <SpecialOfferCard offer={item} onPress={handleSpecialOfferPress} />
  );

  // Optional: Handler for favorite toggling in DiscoverMoreList if needed
  const handleDiscoverItemFavoriteToggle = (
    shopId: string,
    isFavorited: boolean
  ) => {
    console.log(
      `Shop ${shopId} favorite status: ${isFavorited} (from DiscoverMoreList)`
    );
    // Implement actual favorite state update logic here if this feature is active
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent} // Added for overall bottom padding
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <ShopSearch onSearch={setSearchQuery} value={searchQuery} />
        </View>

        {!searchQuery.trim() ? (
          <>
            <View style={styles.section}>
              <ShopCarousel
                shops={featuredShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllFeatured}
                title="Featured Shops"
                showViewAll={true}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Special Offers</Text>
                {specialOffersData.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={handleViewAllSpecialOffers}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={ShopColors.accent}
                    />
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

            <View style={styles.section}>
              <ShopCategories
                categories={categories}
                onCategoryPress={handleCategoryPress}
                showViewAll={true}
                onViewAllPress={handleViewAllCategories}
              />
            </View>

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
                      size={16}
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

            {/* 5. Discover More Section - Using new DiscoverMoreList component */}
            <View style={styles.section}>
              <DiscoverMoreShopList
                shops={discoverMoreShopsData}
                onShopPress={handleShopPress}
                title="Discover More" // This title is now rendered by DiscoverMoreList
                onToggleFavoriteItem={handleDiscoverItemFavoriteToggle} // Optional
              />
            </View>
          </>
        ) : (
          // Search Results Section
          <View style={styles.section}>
            <ShopList // ShopList is fine for search results (vertical, full-width ShopCard)
              shops={filteredShops}
              onShopPress={handleShopPress}
              title={searchResultsTitle} // Title rendered by ShopList
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
