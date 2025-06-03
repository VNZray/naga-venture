import { ShopColors } from '@/constants/ShopColors';
import type { MenuItem, ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ShopDetailMenuItemCard } from '../elements';

interface ShopDetailMenuSectionProps {
  shop: ShopData;
  onMenuItemPress: (item: MenuItem) => void;
}

const ShopDetailMenuSection: React.FC<ShopDetailMenuSectionProps> = ({
  shop,
  onMenuItemPress,
}) => {
  // Process menu items - matching your actual data structure
  const allItems = useMemo(() => {
    if (!shop?.menu || !Array.isArray(shop.menu)) {
      console.log('No menu data available');
      return [];
    }

    // Filter based on your actual menu structure: { item: "name", price: "₱180" }
    const validItems = shop.menu.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        item.item && // Your menu items have 'item' property
        item.price // Your menu items have 'price' property
    );

    console.log('Menu processing:', {
      shopId: shop.id,
      shopName: shop.name,
      originalMenuCount: shop.menu.length,
      validItemsCount: validItems.length,
      sampleMenuItem: shop.menu[0],
    });

    return validItems;
  }, [shop?.menu, shop?.id, shop?.name]);

  // Empty state
  if (!shop?.menu || shop.menu.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="storefront-outline"
          size={48}
          color={ShopColors.textSecondary}
        />
        <Text style={styles.emptyStateTitle}>No Offerings Available</Text>
        <Text style={styles.emptyStateText}>
          This business hasn&apos;t listed their offerings yet.
        </Text>
      </View>
    );
  }

  if (allItems.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="warning-outline"
          size={48}
          color={ShopColors.textSecondary}
        />
        <Text style={styles.emptyStateTitle}>Menu Data Issue</Text>
        <Text style={styles.emptyStateText}>
          The menu data appears to be in an unexpected format. Expected items
          with &apos;item&apos; and &apos;price&apos; properties.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: MenuItem; index: number }) => {
    if (!item) {
      console.warn(`Rendering null/undefined menu item at index ${index}`);
      return null;
    }

    return (
      <ShopDetailMenuItemCard
        item={item}
        onPress={onMenuItemPress}
        variant="default"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.offeringsSection}>
        <Text style={styles.sectionTitle}>
          Our Offerings ({allItems.length})
        </Text>

        <FlatList
          data={allItems}
          keyExtractor={(item, index) => {
            // Safe key generation based on your data structure
            const itemName = item?.item || 'unknown';
            return `offering-${itemName}-${index}`;
          }}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },

  // Offerings Section
  offeringsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },

  // Empty States
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default React.memo(ShopDetailMenuSection);
