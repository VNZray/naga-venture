import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface CompactCategoriesGridProps {
  categories: CategoryItem[];
  onCategoryPress: (categoryId: string) => void;
  title?: string;
  itemsPerRow?: number;
}

/**
 * CompactCategoriesGrid - Clean grid layout for shop categories
 * 
 * Features:
 * - Grid layout with customizable items per row
 * - Clean, modern design with icons
 * - Optimized for mobile screens
 * - Support for dark/light themes
 * - Consistent spacing and alignment
 */
const CompactCategoriesGrid: React.FC<CompactCategoriesGridProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
  itemsPerRow = 4,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Theme colors
  const backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const categoryBgColor = isDark ? "#2a2a2a" : "#f8f9fa";
  const categoryBorderColor = isDark ? "#404040" : "#e9ecef";
  const shadowColor = isDark ? "#000000" : "#000000";

  // Calculate item width based on screen and items per row
  const itemWidth = `${100 / itemsPerRow - 2}%` as any;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {title}
      </Text>
      
      <View style={styles.gridContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              {
                width: itemWidth,
                backgroundColor: categoryBgColor,
                borderColor: categoryBorderColor,
                shadowColor: shadowColor,
              },
            ]}
            onPress={() => onCategoryPress(category.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { 
              backgroundColor: isDark ? "#3a3a3a" : "#ffffff",
              shadowColor: shadowColor,
            }]}>
              <Ionicons
                name={category.icon as any}
                size={24}
                color={isDark ? "#60a5fa" : "#3b82f6"}
              />
            </View>
            <Text
              style={[styles.categoryText, { color: textColor }]}
              numberOfLines={2}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    flexShrink: 1,
  },
});

export default CompactCategoriesGrid;
