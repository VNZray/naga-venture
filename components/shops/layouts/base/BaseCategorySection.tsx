// Base Category Section Component - Unified pattern for all category displays
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
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
 * BaseCategorySection - Unified base component for all category displays
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
const BaseCategorySection: React.FC<BaseCategorySectionProps> = React.memo(({
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
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Internal state for hierarchical expansion
  const [internalExpandedCategories, setInternalExpandedCategories] = useState<Set<string>>(new Set());
  const expandedCategories = externalExpandedCategories || internalExpandedCategories;
  
  // Memoized color scheme
  const colors: CategoryColorScheme = useMemo(() => ({
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    textColor: isDark ? "#ffffff" : "#1f2937",
    cardBackgroundColor: isDark ? "#2a2a2a" : "#f8f9fa",
    cardBorderColor: isDark ? "#404040" : "#e9ecef",
    iconColor: isDark ? "#60a5fa" : "#3b82f6",
    shadowColor: isDark ? "#000000" : "#6b7280",
    headerTextColor: isDark ? "#ffffff" : "#000000",
    viewAllColor: "#2E5AA7",
  }), [isDark]);
  
  // Memoized styles
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
  }), [colors, customStyles]);
  
  // Handle category toggle for hierarchical layout
  const handleToggleCategory = useCallback((categoryId: string) => {
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
  }, [expandedCategories, onToggleCategory]);
  
  // Handle main category press for hierarchical layout
  const handleMainCategoryPress = useCallback((category: BaseCategoryItem) => {
    if (onMainCategoryPress) {
      onMainCategoryPress(category.id);
    } else {
      handleToggleCategory(category.id);
    }
  }, [onMainCategoryPress, handleToggleCategory]);
  
  // Default category item renderers
  const renderHorizontalItem = useCallback((item: BaseCategoryItem, index: number) => {
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
  }, [customRender, colors, onCategoryPress, displayMode, dynamicStyles.item]);
  
  const renderGridItem = useCallback((item: BaseCategoryItem, index: number) => {
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
  }, [customRender, colors, onCategoryPress, displayMode, itemsPerRow, dynamicStyles.item]);
  
  const renderHierarchicalItem = useCallback((item: BaseCategoryItem, index: number) => {
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
  }, [customRender, colors, onCategoryPress, expandedCategories, handleMainCategoryPress]);
  
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
});

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
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  baseItem: {
    // Base styles that can be extended by layout-specific styles
  },
  
  // Horizontal layout styles
  horizontalContent: {
    paddingRight: 16,
    gap: 12,
  },
  horizontalItem: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Grid layout styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 80,
  },
  gridItemText: {
    fontSize: 12,
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
  },
  mainCategoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  mainCategoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  subcategoriesContainer: {
    marginTop: 8,
    marginLeft: 16,
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

// Add display name for debugging
BaseCategorySection.displayName = 'BaseCategorySection';

export default BaseCategorySection;
