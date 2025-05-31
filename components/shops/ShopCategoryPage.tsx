import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
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
import ShopCard from './ShopCard';

interface ShopCategoryPageProps {
  category: {
    id: string;
    name: string;
    icon: string;
  } | null;
  shops: ShopData[];
}

const ShopCategoryPage: React.FC<ShopCategoryPageProps> = ({ 
  category, 
  shops 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Beautiful color scheme matching the enhanced design
  const colors = {
    textColor: isDark ? '#ffffff' : '#1A1A1A',
    subtextColor: isDark ? '#94A3B8' : '#6B7280',
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    cardBackground: isDark ? '#1E293B' : '#FFFFFF',
    borderColor: isDark ? '#475569' : '#E5E7EB',
    accentColor: '#3B82F6',
    accentBackground: isDark ? '#1E40AF' : '#DBEAFE',
  };

  // Handle case where category is not found
  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
          backgroundColor: colors.cardBackground,
        }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.textColor} />
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontFamily: 'Poppins-SemiBold',
            color: colors.textColor,
          }}>
            Category Not Found
          </Text>
        </View>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: 20 
        }}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'Poppins-SemiBold',
            color: colors.textColor,
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Category Not Found
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Poppins-Regular',
            color: colors.subtextColor,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            The category you are looking for does not exist.
          </Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.accentColor,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ 
              color: '#FFFFFF', 
              fontFamily: 'Poppins-Medium',
              fontSize: 16,
            }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    backButton: {
      marginRight: 16,
      padding: 4,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
      flex: 1,
    },
    categoryIcon: {
      backgroundColor: colors.accentBackground,
      borderRadius: 24,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    statsContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    shopCount: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: colors.textColor,
      marginBottom: 4,
    },
    shopCountSubtext: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
    },
    gridContainer: {
      justifyContent: 'space-between',
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
    emptyIcon: {
      backgroundColor: colors.cardBackground,
      borderRadius: 32,
      width: 64,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  const handleBack = () => {
    router.back();
  };

  const handleShopPress = (shopId: string) => {
    router.push(`/(tabs)/(home)/(shops)/(details)/${shopId}`);
  };

  const renderShopCard = ({ item }: { item: ShopData }) => (
    <View style={styles.shopCard}>
      <ShopCard
        shop={item}
        onPress={handleShopPress}
        showRating={true}
        showCategory={false}
      />
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={colors.textColor} 
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <View style={styles.categoryIcon}>
            <Ionicons 
              name={category.icon as any} 
              size={24} 
              color={colors.accentColor} 
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <Text style={styles.shopCount}>
            {shops.length} {shops.length === 1 ? 'Shop' : 'Shops'}
          </Text>
          <Text style={styles.shopCountSubtext}>
            Browse all {category.name.toLowerCase()} shops in your area
          </Text>
        </View>

        {shops.length > 0 ? (
          <FlatList
            data={shops}
            renderItem={renderShopCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons 
                name="storefront-outline" 
                size={32} 
                color={colors.subtextColor} 
              />
            </View>
            <Text style={styles.emptyTitle}>No Shops Found</Text>
            <Text style={styles.emptyText}>
              There are currently no shops available in the {category.name.toLowerCase()} category. Please check back later or explore other categories.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ShopCategoryPage;
