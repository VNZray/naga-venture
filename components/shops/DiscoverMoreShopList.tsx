import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DiscoverMoreShopCard from './DiscoverMoreShopCard';

interface DiscoverMoreShopListProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  title?: string;
  emptyMessage?: string;
  onToggleFavoriteItem?: (shopId: string, isFavorited: boolean) => void; // Optional favorite handler
  // For true infinite scroll, you'd add:
  // onEndReached?: () => void;
  // onEndReachedThreshold?: number;
  // isLoadingMore?: boolean; // To show a footer spinner
}

const DiscoverMoreShopList: React.FC<DiscoverMoreShopListProps> = ({
  shops,
  onShopPress,
  title = 'Discover More',
  emptyMessage = 'No more shops to discover.',
  onToggleFavoriteItem,
  // onEndReached,
  // onEndReachedThreshold = 0.5,
  // isLoadingMore
}) => {
  const styles = StyleSheet.create({
    // Container for the whole component (title + list)
    componentContainer: {
      // This component will be a section in ShopDirectory, so marginBottom is handled there
    },
    titleText: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
      paddingHorizontal: 20, // Match other section title paddings
      marginBottom: 16,
    },
    listContentContainer: {
      paddingHorizontal: 20, // Horizontal padding for the items within the list
      paddingBottom: 16, // Bottom padding for the last item
    },
    cardItemWrapper: {
      marginBottom: 16, // Spacing between cards
    },
    emptyListContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    emptyListText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: ShopColors.textSecondary,
      textAlign: 'center',
    },
    // footerLoadingContainer: {
    //   paddingVertical: 20,
    //   alignItems: 'center',
    // },
  });

  const renderShopItem = ({ item }: { item: ShopData }) => (
    <View style={styles.cardItemWrapper}>
      <DiscoverMoreShopCard
        shop={item}
        onPress={onShopPress}
        onToggleFavorite={onToggleFavoriteItem}
      />
    </View>
  );

  // const renderListFooter = () => {
  //   if (!isLoadingMore) return null;
  //   return (
  //     <View style={styles.footerLoadingContainer}>
  //       <ActivityIndicator size="large" color={ShopColors.accent} />
  //     </View>
  //   );
  // };

  if (shops.length === 0 && !title) {
    // If no title and no shops, render nothing or minimal
    return null;
  }

  if (shops.length === 0) {
    return (
      <View style={styles.componentContainer}>
        {title && <Text style={styles.titleText}>{title}</Text>}
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.componentContainer}>
      {title && <Text style={styles.titleText}>{title}</Text>}
      <FlatList
        data={shops}
        renderItem={renderShopItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        // IMPORTANT: When a FlatList is nested inside a ScrollView,
        // set scrollEnabled={false} to let the parent ScrollView handle scrolling.
        // The FlatList will render all its items.
        // For true virtualization where FlatList handles its own scroll,
        // it shouldn't be in a ScrollView or needs careful height management.
        scrollEnabled={false}
        // onEndReached={onEndReached}
        // onEndReachedThreshold={onEndReachedThreshold}
        // ListFooterComponent={renderListFooter}DiscoverMoreShopList
      />
    </View>
  );
};

export default DiscoverMoreShopList;
