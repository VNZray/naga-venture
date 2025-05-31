import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import type { ShopCategoriesProps } from './types';

const ShopCategories: React.FC<ShopCategoriesProps> = ({ 
  categories, 
  onCategoryPress,
  onViewAllPress
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
    accentBackground: isDark ? '#1E40AF' : '#DBEAFE',
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
    title: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: colors.textColor,
    },    subtitle: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.subtextColor,
      marginTop: 2,
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
    list: {
      paddingHorizontal: 20,
    },
    categoryCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginRight: 16,
      alignItems: 'center',
      minWidth: 90,
      borderWidth: 1,
      borderColor: colors.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    iconContainer: {
      backgroundColor: colors.accentBackground,
      borderRadius: 24,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: colors.accentColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryName: {
      fontSize: 13,
      fontFamily: 'Poppins-Medium',
      color: colors.textColor,
      textAlign: 'center',
      lineHeight: 16,
    },
  });
  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => onCategoryPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={colors.accentColor} 
        />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Shop Categories</Text>
          <Text style={styles.subtitle}>Browse by category</Text>
        </View>
        {onViewAllPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default ShopCategories;
