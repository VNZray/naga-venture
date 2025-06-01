import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons'; // Make sure Ionicons is imported
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text, 
    TouchableOpacity, // Make sure TouchableOpacity is imported
    View
} from 'react-native';
import ShopCarousel from './ShopCarousel';
import ShopCategories from './ShopCategories';
import ShopList from './ShopList';
import ShopSearch from './ShopSearch';
import RecommendedShopCard from './RecommendedShopCard';

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
  featuredShops 
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
      marginBottom: 24, // Standardized section spacing
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
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
      paddingHorizontal: 20,
      paddingVertical: 4, 
    },
    horizontalListItemSeparator: {
      width: 16,
    },
    emptyStateText: { // Style for empty state messages in lists
      paddingHorizontal: 20,
      paddingVertical: 10,
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: ShopColors.textSecondary,
      textAlign: 'center',
    }
  });

  // Simple filtering for search
  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return []; // Return empty if no search, or 'shops' if you want to show all
    
    return shops.filter(shop => 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (shop.category && shop.category.toLowerCase().includes(searchQuery.toLowerCase()))
      // Add more fields to search if needed, e.g., description
    );
  }, [shops, searchQuery]);

  const recommendedShops = useMemo(() => 
    shops.filter(shop => shop.rating >= 4.5).slice(0, 10),
    [shops]
  );

  const specialOffersShops = useMemo(() => 
    // Example: Mark first 5 shops as special. In a real app, this would be based on actual offer data.
    shops.slice(0, 5).map(s => ({...s, isSpecialOffer: true })), 
    [shops]
  );
  
  const discoverMoreShops = useMemo(() => 
    shops,
    [shops]
  );

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };

  const handleViewAllFeatured = () => {
    router.push('/(tabs)/(home)/(shops)/FeaturedShops');
  };

  const handleViewAllRecommended = () => {
    router.push('/(tabs)/(home)/(shops)/RecommendedShops'); 
  };

  const handleViewAllSpecialOffers = () => {
    router.push('/(tabs)/(home)/(shops)/SpecialOffers');
  };

  const handleViewAllCategories = () => {
    router.push('/(tabs)/(home)/(shops)/AllCategories');
  };
  
  const searchResultsTitle = useMemo(() => {
    if (!searchQuery) return 'Search Results'; // Should not be shown if searchQuery is empty
    return `Search Results (${filteredShops.length})`;
  }, [searchQuery, filteredShops.length]); // Dependency on filteredShops.length is correct

  const renderRecommendedShopCard = ({ item }: { item: ShopData }) => (
    <RecommendedShopCard shop={item} onPress={handleShopPress} />
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Good for search inputs in ScrollView
      >
        <View style={styles.section}>
          <ShopSearch 
            onSearch={setSearchQuery}
            value={searchQuery}
          />
        </View>
        
        {!searchQuery.trim() ? ( // Show default content if no search query
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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                {recommendedShops.length > 0 && (
                  <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllRecommended} activeOpacity={0.7}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="chevron-forward" size={16} color={ShopColors.accent} />
                  </TouchableOpacity>
                )}
              </View>
              {recommendedShops.length > 0 ? (
                <FlatList
                  data={recommendedShops}
                  renderItem={renderRecommendedShopCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContentContainer}
                  ItemSeparatorComponent={() => <View style={styles.horizontalListItemSeparator} />}
                />
              ) : (
                <Text style={styles.emptyStateText}>No recommendations available right now.</Text>
              )}
            </View>
            
            <View style={styles.section}>
              {/* This will be updated next with SpecialOfferShopCard */}
              <ShopList 
                shops={specialOffersShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllSpecialOffers}
                title="Special Offers"
                horizontal={true}
                showRating={true} // These props will be irrelevant once we use a custom card
                showCategory={true} //
                showViewAll={true}
                width={200} // Example width for standard ShopCard in horizontal list
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
                emptyMessage="No more shops to discover."
              />
            </View>
          </>
        ) : ( // Show search results if there is a search query
          <View style={styles.section}>
            <ShopList
              shops={filteredShops} // Use the defined filteredShops here
              onShopPress={handleShopPress}
              title={searchResultsTitle}
              horizontal={false} // Display search results as a vertical list
              showRating={true}
              showCategory={true}
              emptyMessage="No shops found matching your search."
              // gridLayout={true} // Optionally use grid for search results
              // numColumns={2}    //
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ShopDirectory;