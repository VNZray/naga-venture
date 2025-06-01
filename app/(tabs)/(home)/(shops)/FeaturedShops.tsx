import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShopCard from '../../../../components/shops/ShopCard';
import { featuredShops } from '../../../Controller/ShopData';

const FeaturedShops = () => {
  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
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
  );  const styles = StyleSheet.create({
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
          <Ionicons name="arrow-back" size={24} color={ShopColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Featured Shops</Text>
      </View>
      
      <Text style={styles.subtitle}>Our hand-picked selection of the best shops</Text>
      
      {featuredShops.length > 0 ? (
        <FlatList
          data={featuredShops}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.content}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No featured shops available</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FeaturedShops;
