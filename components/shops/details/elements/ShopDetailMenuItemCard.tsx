import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopColors } from '@/constants/ShopColors';
import type { MenuItem } from '@/types/shop';

interface ShopDetailMenuItemCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
  variant?: 'default' | 'compact';
  width?: number;
}

const ShopDetailMenuItemCard: React.FC<ShopDetailMenuItemCardProps> = ({
  item,
  onPress,
  variant = 'default',
  width,
}) => {
  // Add null check for item
  if (!item) {
    console.warn('ShopDetailMenuItemCard: item is null or undefined');
    return null;
  }

  // REMOVED isAvailable check since your menu data doesn't have this property
  // Your menu structure: { item: "Classic Burger", price: "₱180" }
  const itemName = item.item || 'Unknown Item';
  const itemPrice = item.price || 'Price not available';
  const itemDescription = item.description || '';

  const getCardStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.card];
    
    if (width) {
      baseStyle.push({ width });
    }
    
    switch (variant) {
      case 'compact':
        baseStyle.push(styles.compactCard);
        break;
      default:
        break;
    }
    
    return baseStyle;
  };

  const handlePress = () => {
    if (item && onPress) {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Horizontal Layout */}
      <View style={styles.cardContent}>
        {/* Left Side - Image placeholder (your data doesn't have images) */}
        <View style={styles.placeholderImage}>
          <Ionicons 
            name="restaurant-outline" 
            size={24} 
            color={ShopColors.textSecondary} 
          />
        </View>

        {/* Right Side - Content */}
        <View style={styles.itemContent}>
          {/* Header with name and price on same line */}
          <View style={styles.itemHeader}>
            <Text 
              style={styles.itemName} 
              numberOfLines={1}
            >
              {itemName}
            </Text>
            
            {/* Price aligned to the right */}
            <Text style={styles.itemPrice}>
              {itemPrice}
            </Text>
          </View>

          {/* Description - Only show if exists */}
          {itemDescription ? (
            <Text 
              style={styles.itemDescription} 
              numberOfLines={2}
            >
              {itemDescription}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base Card Styles
  card: {
    backgroundColor: ShopColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  compactCard: {
    marginBottom: 8,
    shadowOpacity: 0.03,
    elevation: 1,
  },

  // Card Content - Horizontal Layout
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },

  // Left Side - Image placeholder
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: ShopColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },

  // Right Side - Content
  itemContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  // Header - Name and Price on same line
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    flex: 1,
    marginRight: 12,
  },

  // Price - Positioned with name
  itemPrice: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
    textAlign: 'right',
  },

  // Description - Full width below header
  itemDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 18,
  },
});

export default React.memo(ShopDetailMenuItemCard);