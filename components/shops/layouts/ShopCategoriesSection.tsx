// Shop-specific Categories Section Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopCategory } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ShopCategoriesSectionProps {
  categories: ShopCategory[];
  onCategoryPress: (categoryId: string) => void;
  title?: string;
}

/**
 * ShopCategoriesSection - Shop-specific categories component
 * 
 * Improved UI with horizontal scrolling layout and compact design:
 * - Horizontal scrolling for better space efficiency
 * - Compact card-based design with smaller icons
 * - Modern visual design with shadows
 * - Better dark mode support
 * - Icon + text layout for better readability
 */
const ShopCategoriesSection: React.FC<ShopCategoriesSectionProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Theme colors
  const textColor = isDark ? "#ffffff" : "#1f2937";
  const backgroundColor = isDark ? "#1f2937" : "#ffffff";
  const cardBackgroundColor = isDark ? "#374151" : "#f9fafb";
  const borderColor = isDark ? "#4b5563" : "#e5e7eb";
  const iconColor = isDark ? "#60a5fa" : "#3b82f6";
  const shadowColor = isDark ? "#000000" : "#6b7280";

  const renderCategoryItem = ({ item }: { item: ShopCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        {
          backgroundColor: cardBackgroundColor,
          borderColor: borderColor,
          shadowColor: shadowColor,
        }
      ]}
      onPress={() => onCategoryPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDark ? "#4f46e5" : "#eef2ff" }]}>
        <Ionicons
          name={item.icon as any}
          size={20}
          color={iconColor}
        />
      </View>
      <Text
        style={[styles.categoryText, { color: textColor }]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {title}
      </Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContainer}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalListContainer: {
    paddingHorizontal: 20,
  },
  itemSeparator: {
    width: 12,
  },
  categoryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    width: 85,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default ShopCategoriesSection;
