// Base Category Section Component - Selective performance optimizations
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Base category item interface
export interface BaseCategoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subcategories?: BaseCategoryItem[];
}

// Layout type definitions
export type CategoryLayoutType = 'horizontal' | 'grid' | 'hierarchical' | 'vertical';
export type CategoryDisplayMode = 'compact' | 'detailed' | 'icon-only';

// Color scheme interface
interface CategoryColorScheme {
  backgroundColor: string;
  textColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  iconColor: string;
  shadowColor: string;
  headerTextColor: string;
  viewAllColor: string;
}

// Move color scheme creation outside component
const createCategoryColorScheme = (isDark: boolean): CategoryColorScheme => ({
  backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  textColor: isDark ? "#ffffff" : "#1f2937",
  cardBackgroundColor: isDark ? "#2a2a2a" : "#f8f9fa",
  cardBorderColor: isDark ? "#404040" : "#e9ecef",
  iconColor: isDark ? "#60a5fa" : "#3b82f6",
  shadowColor: isDark ? "#000000" : "#6b7280",
  headerTextColor: isDark ? "#ffffff" : "#000000",
  viewAllColor: "#2E5AA7",
});

// Custom render function types
export type CategoryRenderFunction = (
  item: BaseCategoryItem,
  index: number,
  colors: CategoryColorScheme,
  onPress: (id: string) => void
) => React.ReactElement;

interface BaseCategorySectionProps {
  // Core data
  categories: BaseCategoryItem[];
  onCategoryPress: (categoryId: string) => void;
  
  // Layout configuration
  layoutType?: CategoryLayoutType;
  displayMode?: CategoryDisplayMode;
  
  // Grid specific
  itemsPerRow?: number;
  
  // Header configuration
  title?: string;
  showViewAll?: boolean;
  onViewAllPress?: () => void;
  
  // Hierarchical specific
  onMainCategoryPress?: (categoryId: string) => void;
  expandedCategories?: Set<string>;
  onToggleCategory?: (categoryId: string) => void;
  
  // Customization
  customRender?: CategoryRenderFunction;
  customStyles?: {
    container?: any;
    header?: any;
    item?: any;
  };
  
  // Behavior
  snapToInterval?: boolean;
  showEmptyState?: boolean;
  emptyStateMessage?: string;
}

/**
 * BaseCategorySection - Simplified base component for all category displays
 * 
 * Supports 4 layout types:
 * - horizontal: FoodPanda-style horizontal scrolling
 * - grid: Compact grid layout with customizable columns
 * - hierarchical: Expandable main categories with subcategories
 * - vertical: Simple vertical list
 * 
 * 3 display modes:
 * - compact: Small icons with minimal text
 * - detailed: Larger cards with descriptions
 * - icon-only: Icons without text labels
 */
export default function BaseCategorySection({
  categories,
  onCategoryPress,
  layoutType = 'horizontal',
  displayMode = 'compact',
  itemsPerRow = 4,
  title = "Categories",
  showViewAll = false,
  onViewAllPress,
  onMainCategoryPress,
  expandedCategories: externalExpandedCategories,
  onToggleCategory,
  customRender,
  customStyles = {},
  snapToInterval = true,
  showEmptyState = true,
  emptyStateMessage = "No categories available",
}: BaseCategorySectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Internal state for hierarchical expansion
  const [internalExpandedCategories, setInternalExpandedCategories] = useState<Set<string>>(new Set());
  const expandedCategories = externalExpandedCategories || internalExpandedCategories;
  
  // Memoize color scheme and styles
  const colors = useMemo(() => createCategoryColorScheme(isDark), [isDark]);
  const dynamicStyles = useMemo(() => ({
    container: [
      styles.container,
      { backgroundColor: colors.backgroundColor },
      customStyles.container,
    ],
    header: [
      styles.headerContainer,
      customStyles.header,
    ],
    item: [
      styles.baseItem,
      customStyles.item,
    ],
  }), [colors.backgroundColor, customStyles.container, customStyles.header, customStyles.item]);
  
  // Handle category toggle for hierarchical layout
  const handleToggleCategory = (categoryId: string) => {
    if (onToggleCategory) {
      onToggleCategory(categoryId);
    } else {
      const newExpanded = new Set(expandedCategories);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      setInternalExpandedCategories(newExpanded);
    }
  };
  
  // Handle main category press for hierarchical layout
  const handleMainCategoryPress = (category: BaseCategoryItem) => {
    if (onMainCategoryPress) {
      onMainCategoryPress(category.id);
    } else {
      handleToggleCategory(category.id);
    }
  };
  
  // Default category item renderers
  const renderHorizontalItem = (item: BaseCategoryItem, index: number) => {
    if (customRender) {
      return customRender(item, index, colors, onCategoryPress);
    }
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.horizontalItem,
          {
            backgroundColor: colors.cardBackgroundColor,
            borderColor: colors.cardBorderColor,
            shadowColor: colors.shadowColor,
          },
          dynamicStyles.item,
        ]}
        onPress={() => onCategoryPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.cardBackgroundColor }]}>
          <Ionicons
            name={item.icon as any}
            size={displayMode === 'compact' ? 24 : 32}
            color={colors.iconColor}
          />
        </View>
        {displayMode !== 'icon-only' && (
          <Text
            style={[styles.itemText, { color: colors.textColor }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderGridItem = (item: BaseCategoryItem, index: number) => {
    if (customRender) {
      return customRender(item, index, colors, onCategoryPress);
    }
    
    const itemWidth = `${100 / itemsPerRow - 2}%` as any;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.gridItem,
          {
            width: itemWidth,
            backgroundColor: colors.cardBackgroundColor,
            borderColor: colors.cardBorderColor,
            shadowColor: colors.shadowColor,
          },
          dynamicStyles.item,
        ]}
        onPress={() => onCategoryPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.backgroundColor }]}>
          <Ionicons
            name={item.icon as any}
            size={displayMode === 'compact' ? 20 : 28}
            color={colors.iconColor}
          />
        </View>
        {displayMode !== 'icon-only' && (
          <Text
            style={[styles.gridItemText, { color: colors.textColor }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderHierarchicalItem = (item: BaseCategoryItem, index: number) => {
    if (customRender) {
      return customRender(item, index, colors, onCategoryPress);
    }
    
    const isExpanded = expandedCategories.has(item.id);
    const hasSubcategories = item.subcategories && item.subcategories.length > 0;
    
    return (
      <View key={item.id} style={styles.hierarchicalItem}>
        <TouchableOpacity
          style={[
            styles.mainCategoryItem,
            {
              backgroundColor: colors.cardBackgroundColor,
              borderColor: colors.cardBorderColor,
            },
          ]}
          onPress={() => handleMainCategoryPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.mainCategoryLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.backgroundColor }]}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.iconColor}
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={[styles.mainCategoryText, { color: colors.textColor }]}>
                {item.name}
              </Text>
              {item.description && (
                <Text style={[styles.categoryDescription, { color: colors.textColor + '80' }]}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
          {hasSubcategories && (
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.textColor}
            />
          )}
        </TouchableOpacity>
        
        {hasSubcategories && isExpanded && (
          <View style={styles.subcategoriesContainer}>
            {item.subcategories!.map((subcategory) => (
              <TouchableOpacity
                key={subcategory.id}
                style={[
                  styles.subcategoryItem,
                  {
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.cardBorderColor,
                  },
                ]}
                onPress={() => onCategoryPress(subcategory.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={subcategory.icon as any}
                  size={16}
                  color={colors.iconColor}
                />
                <Text style={[styles.subcategoryText, { color: colors.textColor }]}>
                  {subcategory.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };
  
  // Render header
  const renderHeader = () => (
    <View style={dynamicStyles.header}>
      <Text style={[styles.sectionTitle, { color: colors.headerTextColor }]}>
        {title}
      </Text>
      {showViewAll && onViewAllPress && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
          <Text style={[styles.viewAllText, { color: colors.viewAllColor }]}>
            View All
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.viewAllColor} />
        </TouchableOpacity>
      )}
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    showEmptyState && (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyStateText, { color: colors.textColor }]}>
          {emptyStateMessage}
        </Text>
      </View>
    )
  );
  
  // Early return for empty categories
  if (categories.length === 0) {
    return (
      <View style={dynamicStyles.container}>
        {renderHeader()}
        {renderEmptyState()}
      </View>
    );
  }
  
  // Render based on layout type
  const renderContent = () => {
    switch (layoutType) {
      case 'horizontal':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalContent}
            decelerationRate="fast"
            {...(snapToInterval && {
              snapToInterval: 120,
              snapToAlignment: "start",
            })}
          >
            {categories.map((item, index) => renderHorizontalItem(item, index))}
          </ScrollView>
        );
      
      case 'grid':
        return (
          <View style={styles.gridContainer}>
            {categories.map((item, index) => renderGridItem(item, index))}
          </View>
        );
      
      case 'hierarchical':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((item, index) => renderHierarchicalItem(item, index))}
          </ScrollView>
        );
      
      case 'vertical':
        return (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => renderHorizontalItem(item, index)}
            showsVerticalScrollIndicator={false}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={dynamicStyles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },  viewAllText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginRight: 4,
  },
  baseItem: {
    // Base styles for custom items
  },
  
  // Horizontal layout styles
  horizontalContent: {
    paddingVertical: 4,
  },
  horizontalItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: 100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  // Grid layout styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    aspectRatio: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gridItemText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
  },
  
  // Hierarchical layout styles
  hierarchicalItem: {
    marginBottom: 8,
  },
  mainCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  mainCategoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mainCategoryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  subcategoriesContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 6,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Common styles
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
