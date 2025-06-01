import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ShopList from './ShopList';
import type { ShopCarouselProps } from './types';

const ShopCarousel: React.FC<ShopCarouselProps> = ({ 
  shops, 
  onShopPress, 
  onViewAllPress,
  title = 'Featured Shops',
  showViewAll = true 
}) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 32,
      backgroundColor: ShopColors.background,
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
  });return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        
        {showViewAll && onViewAllPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={ShopColors.accent} />
          </TouchableOpacity>
        )}
      </View>
      
      <ShopList
        shops={shops}
        onShopPress={onShopPress}
        horizontal={true}
        showRating={true}
        showCategory={true}
        width={200}
      />
    </View>
  );
};

export default ShopCarousel;
