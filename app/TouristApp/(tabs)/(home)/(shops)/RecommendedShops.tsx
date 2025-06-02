import ShopCard from '@/components/shops/ShopCard';
import { ShopColors } from '@/constants/ShopColors';
import { destinations } from '@/Controller/ShopData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RecommendedShops = () => {
  // Get recommended shops (high ratings) - same logic as in ShopDirectory
  const recommendedShops = useMemo(
    () => destinations.filter((shop) => shop.rating >= 4.5),
    []
  );

  const handleShopPress = (shopId: string) => {
    router.push(`/TouristApp/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const renderShopItem = ({ item }: { item: any }) => (
    <View style={styles.shopCard}>
      <ShopCard
        shop={item}
        onPress={handleShopPress}
        showRating={true}
        showCategory={true}
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
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: ShopColors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: ShopColors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
      borderRadius: 8,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      flex: 1,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    shopCard: {
      width: '48%',
      marginBottom: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      textAlign: 'center',
    },
  });
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
        <Text style={styles.title}>Recommended for you</Text>
      </View>

      <Text style={styles.subtitle}>Highly rated shops perfect for you</Text>

      {recommendedShops.length > 0 ? (
        <FlatList
          data={recommendedShops}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.content}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recommended shops available</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default RecommendedShops;
