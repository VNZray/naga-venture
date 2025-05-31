import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import type { ShopCardProps } from './types';

const ShopCard: React.FC<ShopCardProps> = ({ 
  shop, 
  onPress, 
  showRating = true,
  showCategory = true,
  width = 180 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Beautiful color scheme matching the old design
  const colors = {
    textColor: isDark ? '#ffffff' : '#1A1A1A',
    subtextColor: isDark ? '#94A3B8' : '#6B7280',
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    cardBackground: isDark ? '#334155' : '#F8FAFB',
    borderColor: isDark ? '#475569' : '#E5E7EB',
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
      width: width,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    imageContainer: {
      position: 'relative',
      height: 90,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    ratingBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 12,
    },
    ratingBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 2,
      fontFamily: 'Poppins-SemiBold',
    },
    shopInfo: {
      padding: 12,
    },
    name: {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
      marginBottom: 4,
    },
    category: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
      textTransform: 'capitalize',
      marginBottom: 6,
    },
    shopFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      fontFamily: 'Poppins-Medium',
      color: colors.textColor,
      marginLeft: 2,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(shop.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: shop.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Beautiful rating badge overlay */}
        {showRating && shop.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingBadgeText}>{shop.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.shopInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {shop.name}
        </Text>
        
        {showCategory && shop.category && (
          <Text style={styles.category} numberOfLines={1}>
            {shop.category}
          </Text>
        )}
        
        <View style={styles.shopFooter}>
          {showRating && shop.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>
                {shop.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ShopCard;
