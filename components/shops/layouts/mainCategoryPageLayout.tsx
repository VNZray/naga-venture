// Hierarchical Categories Section Component for Shops
import CardContainer from '@/components/CardContainer';
import PressableButton from '@/components/PressableButton';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopCategory } from '@/types/shop';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MainCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: ShopCategory[];
}

interface HierarchicalCategoriesSectionProps {
  mainCategories: MainCategory[];
  onCategoryPress: (categoryId: string) => void;
  onMainCategoryPress?: (mainCategoryId: string) => void;
  title?: string;
}

/**
 * HierarchicalCategoriesSection - Advanced categories component with main categories and subcategories
 * 
 * This component provides a two-level category system:
 * - Main categories (Food & Beverage, Health & Beauty, etc.)
 * - Subcategories (Restaurants, Cafes, Bars, etc.) * 
 * Features:
 * - Expandable main categories
 * - Click on main category to see all subcategories
 * - Click on subcategory to go to that specific category
 * - Responsive layout with proper spacing
 */
const HierarchicalCategoriesSection: React.FC<HierarchicalCategoriesSectionProps> = ({
  mainCategories,
  onCategoryPress,
  onMainCategoryPress,
  title = "Shop Categories",
}) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = colorScheme === "dark" ? "#1a1a1a" : "#f5f5f5";
  const borderColor = colorScheme === "dark" ? "#333" : "#e0e0e0";
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleMainCategoryPress = (mainCategory: MainCategory) => {
    if (onMainCategoryPress) {
      onMainCategoryPress(mainCategory.id);
    } else {
      // Default behavior: toggle expansion
      toggleCategory(mainCategory.id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color }]}>
        {title}
      </Text>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {mainCategories.map((mainCategory) => {
          const isExpanded = expandedCategories.has(mainCategory.id);
          
          return (
            <View key={mainCategory.id} style={[styles.categoryContainer, { borderColor }]}>
              {/* Main Category Header */}
              <TouchableOpacity
                style={[styles.mainCategoryHeader, { backgroundColor }]}
                onPress={() => handleMainCategoryPress(mainCategory)}
                activeOpacity={0.7}
              >
                <View style={styles.mainCategoryContent}>
                  <PressableButton
                    IconSize={28}
                    color={color}
                    direction="row"
                    Title={mainCategory.name}
                    Icon={mainCategory.icon}
                    onPress={() => handleMainCategoryPress(mainCategory)}
                    style={styles.mainCategoryButton}
                  />
                  <Text style={[styles.categoryDescription, { color: color + '80' }]}>
                    {mainCategory.description}
                  </Text>
                </View>
                
                {/* Expansion indicator */}
                <Text style={[styles.expandIcon, { color }]}>
                  {isExpanded ? '−' : '+'}
                </Text>
              </TouchableOpacity>

              {/* Subcategories - Show when expanded */}
              {isExpanded && (
                <CardContainer style={styles.subcategoriesContainer} height="auto">
                  {mainCategory.subcategories.map((subcategory) => (
                    <PressableButton
                      key={subcategory.id}
                      IconSize={22}
                      color={color}
                      direction="column"
                      Title={subcategory.name}
                      Icon={subcategory.icon}
                      onPress={() => onCategoryPress(subcategory.id)}
                      style={styles.subcategoryButton}
                    />
                  ))}
                </CardContainer>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
  },
  scrollContainer: {
    maxHeight: 400, // Limit height to keep it from taking too much space
  },
  categoryContainer: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mainCategoryHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainCategoryContent: {
    flex: 1,
  },
  mainCategoryButton: {
    padding: 0,
    margin: 0,
  },
  categoryDescription: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
    marginLeft: 40, // Align with title
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  subcategoriesContainer: {
    margin: 12,
    padding: 12,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: "space-between",
  },
  subcategoryButton: {
    minWidth: '30%',
    marginBottom: 8,
  },
});

export default HierarchicalCategoriesSection;
