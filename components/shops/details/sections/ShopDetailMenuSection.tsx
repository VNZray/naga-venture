import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopColors } from '@/constants/ShopColors';
import type { ShopData, MenuItem } from '@/types/shop';
import { ShopDetailMenuItemCard } from '../elements';

interface ShopDetailMenuSectionProps {
  shop: ShopData;
  onMenuItemPress: (item: MenuItem) => void;
}

const ShopDetailMenuSection: React.FC<ShopDetailMenuSectionProps> = ({
  shop,
  onMenuItemPress
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Extract categories and featured items
  const { categories, featuredItems, filteredItems } = useMemo(() => {
    if (!shop.menu || shop.menu.length === 0) {
      return { categories: [], featuredItems: [], filteredItems: [] };
    }

    const categories = ['all', ...new Set(shop.menu.map(item => item.category).filter(Boolean))];
    
    const featuredItems = shop.menu.filter(item => 
      shop.featuredItems?.includes(item.id) || item.isPopular || item.isBestseller
    );

    let filteredItems = shop.menu;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    
    // Filter by availability
    if (showAvailableOnly) {
      filteredItems = filteredItems.filter(item => item.isAvailable !== false);
    }

    return { categories, featuredItems, filteredItems };
  }, [shop.menu, shop.featuredItems, selectedCategory, showAvailableOnly]);

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const toggleAvailabilityFilter = useCallback(() => {
    setShowAvailableOnly(!showAvailableOnly);
  }, [showAvailableOnly]);

  // Empty state
  if (!shop.menu || shop.menu.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="restaurant-outline" size={48} color={ShopColors.textSecondary} />
        <Text style={styles.emptyStateTitle}>No Menu Available</Text>
        <Text style={styles.emptyStateText}>This business hasn&apos;t uploaded their menu yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Filters Section */}
      <View style={styles.filtersSection}>
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Availability Filter */}
        <View style={styles.availabilityFilter}>
          <TouchableOpacity
            style={styles.availabilityToggle}
            onPress={toggleAvailabilityFilter}
          >
            <Ionicons
              name={showAvailableOnly ? "checkbox" : "square-outline"}
              size={20}
              color={showAvailableOnly ? ShopColors.accent : ShopColors.textSecondary}
            />
            <Text style={styles.availabilityToggleText}>Available only</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Items Section */}
      {featuredItems.length > 0 && selectedCategory === 'all' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Items</Text>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color={ShopColors.warning} />
              <Text style={styles.featuredBadgeText}>Popular</Text>
            </View>
          </View>
          {featuredItems.map(item => (
            <ShopDetailMenuItemCard 
              key={`featured-${item.id}`}
              item={item} 
              onPress={onMenuItemPress} 
            />
          ))}
        </View>
      )}

      {/* Menu Items Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' 
              ? 'All Menu Items' 
              : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
            }
          </Text>
          <Text style={styles.itemCount}>
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ShopDetailMenuItemCard 
              key={item.id}
              item={item} 
              onPress={onMenuItemPress} 
            />
          ))
        ) : (
          <View style={styles.noItemsState}>
            <Ionicons name="search-outline" size={32} color={ShopColors.textSecondary} />
            <Text style={styles.noItemsTitle}>No Items Found</Text>
            <Text style={styles.noItemsText}>
              {showAvailableOnly 
                ? 'No available items in this category.' 
                : 'No items found for the selected filters.'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Menu Statistics */}
      <View style={styles.menuStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{shop.menu.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{categories.length - 1}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{featuredItems.length}</Text>
          <Text style={styles.statLabel}>Featured</Text>
        </View>
        {shop.priceRange && (
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{shop.priceRange}</Text>
            <Text style={styles.statLabel}>Price Range</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },
  
  // Filters Section
  filtersSection: {
    backgroundColor: ShopColors.cardBackground,
    paddingVertical: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  categoryFilter: {
    marginBottom: 12,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ShopColors.background,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  categoryButtonActive: {
    backgroundColor: ShopColors.accent,
    borderColor: ShopColors.accent,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  availabilityFilter: {
    paddingHorizontal: 20,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityToggleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.warning,
  },
  itemCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },

  // Empty States
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  noItemsState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noItemsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  noItemsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
  },

  // Menu Statistics
  menuStats: {
    flexDirection: 'row',
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
  },
});

export default React.memo(ShopDetailMenuSection);