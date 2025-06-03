import { ShopColors } from '@/constants/ShopColors';
import type { MenuItem } from '@/types/shop';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

interface ShopDetailMenuItemCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

const ShopDetailMenuItemCard: React.FC<ShopDetailMenuItemCardProps> = ({ item, onPress }) => {
  const renderTags = () => {
    const tags = [];
    
    if (item.isPopular) {
      tags.push(
        <View key="popular" style={[styles.menuItemTag, styles.popularTag]}>
          <Text style={styles.popularTagText}>Popular</Text>
        </View>
      );
    }
    
    if (item.isBestseller) {
      tags.push(
        <View key="bestseller" style={[styles.menuItemTag, styles.bestsellerTag]}>
          <Text style={styles.bestsellerTagText}>Bestseller</Text>
        </View>
      );
    }
    
    if (!item.isAvailable) {
      tags.push(
        <View key="unavailable" style={[styles.menuItemTag, styles.unavailableTag]}>
          <Text style={styles.unavailableTagText}>Unavailable</Text>
        </View>
      );
    }
    
    return tags;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.menuItemCard,
        { opacity: item.isAvailable === false ? 0.6 : 1 }
      ]} 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      disabled={item.isAvailable === false}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      )}
      
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName} numberOfLines={1}>
            {item.item}
          </Text>
          <Text style={styles.menuItemPrice}>{item.price}</Text>
        </View>
        
        {item.description && (
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.menuItemTags}>
          {renderTags()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItemCard: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  menuItemContent: {
    padding: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  menuItemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuItemTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularTag: {
    backgroundColor: ShopColors.warning + '20',
  },
  popularTagText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.warning,
  },
  bestsellerTag: {
    backgroundColor: ShopColors.success + '20',
  },
  bestsellerTagText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.success,
  },
  unavailableTag: {
    backgroundColor: ShopColors.error + '20',
  },
  unavailableTagText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.error,
  },
});

export default React.memo(ShopDetailMenuItemCard);