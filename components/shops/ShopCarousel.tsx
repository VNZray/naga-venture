import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList, // Changed from ScrollView for better performance with lists
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import ShopList from './ShopList'; // No longer using ShopList directly here
import FeaturedShopCard from './FeaturedShopCard'; // Import the new card
import type { ShopCarouselProps } from './types'; // Ensure ShopData is part of types if not already

const ShopCarousel: React.FC<ShopCarouselProps> = ({
  shops,
  onShopPress,
  onViewAllPress,
  title = 'Featured Shops', // Default title makes sense
  showViewAll = true,
}) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 24, // Adjusted from 32
      backgroundColor: ShopColors.background, // Optional: if you want a distinct bg for the carousel section
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    title: {
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
    listContentContainer: {
      paddingHorizontal: 20, // Horizontal padding for the list
      paddingVertical: 8, // Padding for shadow visibility
    },
    separator: {
      width: 16, // Spacing between cards
    },
  });

  const renderFeaturedCard = ({
    item,
  }: {
    item: ShopCarouselProps['shops'][0];
  }) => (
    <FeaturedShopCard
      shop={item}
      onPress={onShopPress}
      // Props like showRating, showCategory are intrinsic to FeaturedShopCard design
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {showViewAll && onViewAllPress && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={onViewAllPress}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={ShopColors.accent}
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={shops}
        renderItem={renderFeaturedCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        // getItemLayout can be added for optimization if card sizes are fixed
        getItemLayout={(data, index) => (
          { length: 280 + 16, offset: (280 + 16) * index, index } // cardWidth + separator
        )}
      />
    </View>
  );
};

export default ShopCarousel;
