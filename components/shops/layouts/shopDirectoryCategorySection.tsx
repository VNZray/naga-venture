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
  onViewAllPress?: () => void;
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
const HorizontalCategoriesSection: React.FC<HorizontalCategoriesSectionProps> = ({
  categories,
  onCategoryPress,
  title = "Shop Categories",
  onViewAllPress,
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
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {title}
        </Text>
        {onViewAllPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
            <Text style={[styles.viewAllText, { color: '#2E5AA7' }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
          </TouchableOpacity>
        )}
      </View>
      
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
            }]}>              <Ionicons
                name={category.icon as any}
                size={24} // Reduced from 28 to 24
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
    paddingVertical: 12, // Reduced from 20 to 12
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18, // Consistent with other headers
    fontFamily: "Poppins-SemiBold",
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginRight: 4,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: 90, // Reduced from 100 to 90
    height: 100, // Reduced from 120 to 100
    marginHorizontal: 4,
    borderRadius: 12, // Reduced from 16 to 12
    borderWidth: 1,
    padding: 10, // Reduced from 12 to 10
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
    width: 48, // Reduced from 56 to 48
    height: 48, // Reduced from 56 to 48
    borderRadius: 24, // Reduced from 28 to 24
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6, // Reduced from 8 to 6
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 11, // Reduced from 12 to 11
    fontFamily: "Poppins-Medium",
    textAlign: 'center',
    lineHeight: 14, // Reduced from 16 to 14
    flexShrink: 1,
  },
  endSpacer: {
    width: 12,
  },
});

export default HorizontalCategoriesSection;
