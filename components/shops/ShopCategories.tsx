import { ShopColors } from '@/constants/ShopColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ShopCategoriesProps } from './types';

const ShopCategories: React.FC<ShopCategoriesProps> = ({
  categories,
  onCategoryPress,
  showViewAll = false,
  onViewAllPress,
}) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: 8,
      backgroundColor: ShopColors.background,
      paddingBottom: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 12, // Reduced from 16
    },
    title: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: ShopColors.textPrimary,
    },
    list: {
      paddingHorizontal: 20,
      paddingBottom: 8, // Reduced from 12
      paddingTop: 0, // Reduced from 4
    },
    categoryCard: {
      backgroundColor: ShopColors.cardBackground,
      borderRadius: 12,
      padding: 10, // Reduced from 14
      marginRight: 6,
      alignItems: 'center',
      justifyContent: 'center',
      width: 85, // Reduced from 100
      height: 95, // Reduced from 120
      borderWidth: 1,
      borderColor: ShopColors.border,
      shadowColor: ShopColors.shadow,
      shadowOffset: { width: 0, height: 2 }, // Reduced shadow
      shadowOpacity: 0.08, // Lighter shadow
      shadowRadius: 3,
      elevation: 2,
    },
    iconContainer: {
      backgroundColor: ShopColors.accent + '15',
      borderRadius: 20, // Reduced from 26
      width: 40, // Reduced from 52
      height: 40, // Reduced from 52
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6, // Reduced from 10
    },
    categoryName: {
      fontSize: 11, // Reduced from 12
      fontFamily: 'Poppins-Medium',
      color: ShopColors.textPrimary,
      textAlign: 'center',
      lineHeight: 14, // Reduced from 16
      maxWidth: 75, // Reduced from 80
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
  });

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => onCategoryPress(item.id)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Browse ${item.name} shops`}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={22} color={ShopColors.accent} />{' '}
        {/* Reduced from 26 */}
      </View>
      <Text style={styles.categoryName} numberOfLines={2} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Shop Categories</Text>
        </View>
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
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
        getItemLayout={(data, index) => ({
          length: 101, // width (85) + marginRight (16)
          offset: 101 * index,
          index,
        })}
      />
    </View>
  );
};

export default ShopCategories;
