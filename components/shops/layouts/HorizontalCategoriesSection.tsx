import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
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

interface HorizontalCategoriesSectionProps {
  categories: CategoryItem[];
  onCategoryPress: (categoryId: string) => void;
  title?: string;
}

/**
 * HorizontalCategoriesSection - FoodPanda-style horizontal scrolling categories
 * 
 * Features:
 * - Horizontal scrolling with smooth navigation
 * - Icon-based design with beautiful styling
 * - Responsive layout that adapts to screen size
 * - Clean, modern UI with proper spacing
 * - Support for dark/light themes
 */
export const HorizontalCategoriesSection: React.FC<HorizontalCategoriesSectionProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Theme colors
  const backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const categoryBgColor = isDark ? "#2a2a2a" : "#f8f9fa";
  const categoryBorderColor = isDark ? "#404040" : "#e9ecef";
  const shadowColor = isDark ? "#000000" : "#000000";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {title}
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={120} // Snap to each item for smooth scrolling
        snapToAlignment="start"
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              {
                backgroundColor: categoryBgColor,
                borderColor: categoryBorderColor,
                shadowColor: shadowColor,
              },
              index === 0 && styles.firstItem,
              index === categories.length - 1 && styles.lastItem,
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
                size={28}
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
        
        {/* Spacer at the end for better scrolling experience */}
        <View style={styles.endSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: 100,
    height: 120,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
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
  firstItem: {
    marginLeft: 4,
  },
  lastItem: {
    marginRight: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    lineHeight: 16,
    flexShrink: 1,
  },
  endSpacer: {
    width: 12,
  },
});

export default HorizontalCategoriesSection;
