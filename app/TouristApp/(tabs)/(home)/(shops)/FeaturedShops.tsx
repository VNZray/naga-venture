import ShopCard from '@/components/shops/ShopCard'; // Ensure this path is correct
import { ShopColors } from '@/constants/ShopColors';
import { featuredShops as staticFeaturedShops } from '@/Controller/ShopData'; // Your static data
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const NUM_COLUMNS = 2;
// Calculate card width based on screen width, columns, and margins
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS; // Calculate card width based on screen width, columns, and margins

const FeaturedShopsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shops, setShops] = useState<ShopData[]>([]);

  // Simulate data fetching
  const fetchFeaturedShops = useCallback(async () => {
    // In a real app, this would be an API call
    return new Promise<ShopData[]>((resolve) => {
      setTimeout(() => {
        resolve(staticFeaturedShops); // Using your imported static data
      }, 1000); // Simulate network delay
    });
  }, []);

  const loadShops = useCallback(
    async (refreshing = false) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      try {
        const data = await fetchFeaturedShops();
        setShops(data);
      } catch (error) {
        console.error('Failed to fetch featured shops:', error);
        // Optionally set an error state here to show a message to the user
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [fetchFeaturedShops]
  );

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  const handleShopPress = (shopId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const renderShopItem = ({ item }: { item: ShopData }) => (
    <View style={styles.cardWrapper}>
      <ShopCard
        shop={item}
        onPress={handleShopPress}
        showRating={true}
        showCategory={true}
        width={CARD_WIDTH} // Pass calculated width
      />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ShopColors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16, // Consistent padding
      paddingVertical: 12,
      backgroundColor: ShopColors.cardBackground, // Or ShopColors.background if header shouldn't be elevated
      // Add a subtle border if header is elevated
      // borderBottomWidth: 1,
      // borderBottomColor: ShopColors.border,
    },
    backButton: {
      padding: 8, // Generous touch target
      marginRight: 12, // Space between button and title
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      flex: 1, // Allow title to take available space
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      paddingHorizontal: 20, // Match content padding
      paddingVertical: 12,
      // marginBottom: 8,
    },
    listContentContainer: {
      paddingHorizontal: CARD_MARGIN, // Horizontal padding for the grid
      paddingVertical: 16,
    },
    cardWrapper: {
      margin: CARD_MARGIN / 2, // Distribute margin around each card for even spacing
      width: CARD_WIDTH,
    },
    centeredView: {
      // For loading and empty states
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    loadingText: {
      marginTop: 10,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={ShopColors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Featured Shops</Text>
        </View>
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={ShopColors.accent} />
          <Text style={styles.loadingText}>Loading Featured Shops...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={ShopColors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Featured Shops</Text>
      </View>

      {shops.length > 0 ? (
        <FlatList
          data={shops}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadShops(true)}
              colors={[ShopColors.accent]} // iOS
              tintColor={ShopColors.accent} // Android
            />
          }
        />
      ) : (
        <View style={styles.centeredView}>
          <Ionicons
            name="star-outline"
            size={48}
            color={ShopColors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={styles.headerTitle}>No Featured Shops</Text>
          <Text style={styles.emptyText}>
            Check back later for our hand-picked selections!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FeaturedShopsScreen;
