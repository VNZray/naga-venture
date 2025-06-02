import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ShopCarousel from './ShopCarousel';
import ShopCategories from './ShopCategories';
import ShopList from './ShopList';
import ShopSearch from './ShopSearch';

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ShopColors.background,
    },
    content: {
      paddingTop: 8,
      paddingBottom: 32,
    },
    section: {
      marginBottom: 8,
    },
  });

  // Simple filtering
  const filteredShops = useMemo(() => {
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

  const handleShopPress = (shopId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };

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

  // Generate search results title
  const searchResultsTitle = useMemo(() => {
    if (!searchQuery) return 'Search Results';
    return `Search Results (${filteredShops.length})`;
  }, [searchQuery, filteredShops.length]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ShopSearch onSearch={setSearchQuery} value={searchQuery} />
        </View>

        {!searchQuery && (
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
              <ShopCategories
                categories={categories}
                onCategoryPress={handleCategoryPress}
                showViewAll={true}
                onViewAllPress={handleViewAllCategories}
              />
            </View>

            <View style={styles.section}>
              <ShopList
                shops={recommendedShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllRecommended}
                title="Recommended for you"
                horizontal={true}
                showRating={true}
                showCategory={true}
                showViewAll={true}
              />
            </View>

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
                onShopPress={handleShopPress}
                title="Discover More"
                horizontal={false}
                showRating={true}
                showCategory={true}
                showViewAll={false}
                gridLayout={true}
                numColumns={2}
              />
            </View>
          </>
        )}

        {searchQuery && (
          <View style={styles.section}>
            <ShopList
              shops={filteredShops}
              onShopPress={handleShopPress}
              title={searchResultsTitle}
              horizontal={false}
              showRating={true}
              showCategory={true}
              emptyMessage="No shops found for your search"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShopDirectory;
