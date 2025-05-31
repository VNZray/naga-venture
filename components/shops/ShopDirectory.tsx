import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
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
  featuredShops 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Beautiful color scheme matching the enhanced design
  const colors = {
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    containerBackground: isDark ? '#1E293B' : '#FFFFFF',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
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
    
    return shops.filter(shop => 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shops, searchQuery]);

  // Get trending shops (high ratings)
  const trendingShops = useMemo(() => 
    shops.filter(shop => shop.rating >= 4.5).slice(0, 6),
    [shops]
  );

  // Get nearby shops (you can replace this with actual location logic)
  const nearbyShops = useMemo(() => 
    shops.slice(0, 6),
    [shops]
  );

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(categories)/${categoryId}`);
  };
  const handleViewAllFeatured = () => {
    router.push('/(tabs)/(home)/(shops)/(categories)/featured');
  };

  const handleViewAllTrending = () => {
    router.push('/(tabs)/(home)/(shops)/(categories)/trending');
  };
  const handleViewAllNearby = () => {
    router.push('/(tabs)/(home)/(shops)/(categories)/nearby');
  };

  const handleViewAllCategories = () => {
    router.push('/(tabs)/(home)/(shops)/(categories)/all');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ShopSearch 
            onSearch={setSearchQuery}
            value={searchQuery}
          />
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
                onViewAllPress={handleViewAllCategories}
              />
            </View>
            
            <View style={styles.section}>
              <ShopList
                shops={trendingShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllTrending}
                title="Trending Shops"
                horizontal={true}
                showRating={true}
                showCategory={true}
                showViewAll={true}
              />
            </View>
            
            <View style={styles.section}>
              <ShopList
                shops={nearbyShops}
                onShopPress={handleShopPress}
                onViewAllPress={handleViewAllNearby}
                title="Near You"
                horizontal={true}
                showRating={true}
                showCategory={true}
                showViewAll={true}
              />
            </View>
          </>
        )}
        
        {searchQuery && (
          <View style={styles.section}>
            <ShopList
              shops={filteredShops}
              onShopPress={handleShopPress}
              title={`Search Results (${filteredShops.length})`}
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
