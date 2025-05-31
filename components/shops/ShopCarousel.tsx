import { useColorScheme } from '@/hooks/useColorScheme';
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Beautiful color scheme matching the enhanced design
  const colors = {
    textColor: isDark ? '#ffffff' : '#1A1A1A',
    subtextColor: isDark ? '#94A3B8' : '#6B7280',
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    cardBackground: isDark ? '#334155' : '#F8FAFB',
    borderColor: isDark ? '#475569' : '#E5E7EB',
    accentColor: '#3B82F6',
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 32,
      backgroundColor: colors.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
      marginRight: 12,    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: '#2E5AA7',
      marginRight: 4,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
          {showViewAll && onViewAllPress && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={onViewAllPress}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
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
