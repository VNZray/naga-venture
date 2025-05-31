import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ShopCard from './ShopCard';
import type { ShopListProps } from './types';

const ShopList: React.FC<ShopListProps> = ({ 
  shops, 
  onShopPress, 
  title,
  horizontal = false,
  showRating = true,
  showCategory = true,
  showViewAll = true,
  onViewAllPress,
  emptyMessage = 'No shops found',
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
    container: {
      marginBottom: 32, // Standardized spacing for drop shadow
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 16,
    },
    title: {
      fontSize: 18, // Standardized title size
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
    },
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
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 8, // Standardized bottom padding for drop shadow
      gap: 12, // Standardized gap between cards
    },
    verticalContainer: {
      paddingHorizontal: 20,
    },
    verticalCard: {
      marginBottom: 16,
      width: '100%',
    },
    emptyContainer: {
      padding: 20,
      borderRadius: 12,
      marginHorizontal: 20,
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
      textAlign: 'center',
    },
  });
  // Handle empty state with beautiful design
  if (shops.length === 0) {
    return (
      <View style={styles.container}>
        {title && (
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Beautiful standardized header */}
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          {showViewAll && onViewAllPress && (
            <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Horizontal or vertical list with beautiful styling */}
      {horizontal ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onPress={onShopPress}
              showRating={showRating}
              showCategory={showCategory}
              width={horizontal ? width : undefined}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.verticalContainer}>
          {shops.map((shop) => (
            <View key={shop.id} style={styles.verticalCard}>
              <ShopCard
                shop={shop}
                onPress={onShopPress}
                showRating={showRating}
                showCategory={showCategory}
                width={undefined} // Full width for vertical
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ShopList;
