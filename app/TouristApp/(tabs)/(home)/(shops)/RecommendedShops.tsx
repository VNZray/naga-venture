import ShopCard from '@/components/shops/ShopCard';
import { ShopColors } from '@/constants/ShopColors';
<<<<<<< HEAD:app/TouristApp/(tabs)/(home)/(shops)/RecommendedShops.tsx
import { destinations } from '@/Controller/ShopData';
=======
import type { ShopData } from '@/types/shop';
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428:app/(tabs)/(home)/(shops)/RecommendedShops.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
<<<<<<< HEAD:app/TouristApp/(tabs)/(home)/(shops)/RecommendedShops.tsx
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RecommendedShops = () => {
  // Get recommended shops (high ratings) - same logic as in ShopDirectory
  const recommendedShops = useMemo(
    () => destinations.filter((shop) => shop.rating >= 4.5),
    []
  );
=======
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShopCard from '../../../../components/shops/ShopCard'; // Ensure this path is correct
import { destinations as allShopsData } from '../../../Controller/ShopData'; // Your static data for all shops

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const NUM_COLUMNS = 2;
// Calculate card width based on screen width, columns, and margins
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const RecommendedShopsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shops, setShops] = useState<ShopData[]>([]);

  // Simulate data fetching for recommended shops
  const fetchRecommendedShops = useCallback(async () => {
    // In a real app, this might be an API call with specific filters
    // For now, we filter the static data
    return new Promise<ShopData[]>((resolve) => {
      setTimeout(() => {
        const recommended = allShopsData.filter(shop => shop.rating >= 4.5);
        resolve(recommended);
      }, 800); // Simulate network delay
    });
  }, []);

  const loadShops = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const data = await fetchRecommendedShops();
      setShops(data);
    } catch (error) {
      console.error("Failed to fetch recommended shops:", error);
      // Optionally set an error state here
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fetchRecommendedShops]);

  useEffect(() => {
    loadShops();
  }, [loadShops]);
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428:app/(tabs)/(home)/(shops)/RecommendedShops.tsx

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
        width={CARD_WIDTH}
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: ShopColors.cardBackground,
      // borderBottomWidth: 1,
      // borderBottomColor: ShopColors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      flex: 1,
    },
    // Subtitle can be added if desired, similar to FeaturedShopsScreen
    // subtitle: {
    //   fontSize: 14,
    //   fontFamily: 'Poppins-Regular',
    //   color: ShopColors.textSecondary,
    //   paddingHorizontal: 20,
    //   paddingVertical: 12,
    // },
    listContentContainer: {
      paddingHorizontal: CARD_MARGIN,
      paddingVertical: 16,
    },
    cardWrapper: {
      margin: CARD_MARGIN / 2,
      width: CARD_WIDTH,
    },
    centeredView: {
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
        color: ShopColors.textSecondary
    }
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
          <Text style={styles.headerTitle}>Recommended For You</Text>
        </View>
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={ShopColors.accent} />
          <Text style={styles.loadingText}>Loading Recommendations...</Text>
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
        <Text style={styles.headerTitle}>Recommended For You</Text>
      </View>

<<<<<<< HEAD:app/TouristApp/(tabs)/(home)/(shops)/RecommendedShops.tsx
      <Text style={styles.subtitle}>Highly rated shops perfect for you</Text>

      {recommendedShops.length > 0 ? (
=======
      {/* Optional: Subtitle if you want one */}
      {/* <Text style={styles.subtitle}>
        Highly rated shops perfect for you
      </Text> */}

      {shops.length > 0 ? (
>>>>>>> f59dd0fc3358ae4f3b219a7a866609ed4b399428:app/(tabs)/(home)/(shops)/RecommendedShops.tsx
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
              colors={[ShopColors.accent]}
              tintColor={ShopColors.accent}
            />
          }
        />
      ) : (
        <View style={styles.centeredView}>
          <Ionicons name="thumbs-up-outline" size={48} color={ShopColors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.headerTitle}>No Recommendations Yet</Text>
          <Text style={styles.emptyText}>We&apos;re still finding the perfect spots for you. Explore more to help us learn your preferences!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default RecommendedShopsScreen;