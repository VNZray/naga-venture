// Enhanced Search Bar with Filters for Shop Directory
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export interface FilterOptions {
  categories: string[];
  minRating: number;
  maxRating: number;
  priceRanges: string[];
  openNow: boolean;
  sortBy: 'name' | 'rating' | 'distance' | 'price';
}

interface EnhancedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: { id: string; name: string }[];
  availablePriceRanges: string[];
}

const RECENT_SEARCHES_KEY = 'shop_recent_searches';
const MAX_RECENT_SEARCHES = 5;

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search shops...",
  suggestions = [],
  filters,
  onFiltersChange,
  availableCategories,
  availablePriceRanges,
}) => {
  const colorScheme = useColorScheme();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Theme colors
  const backgroundColor = colorScheme === 'dark' ? '#0A1B47' : '#F8F8F8';
  const cardBackground = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  const placeholderColor = colorScheme === 'dark' ? '#8E9196' : '#9F9EA1';

  // Load recent searches on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Animate suggestions appearance
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showSuggestions ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSuggestions]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)]
        .slice(0, MAX_RECENT_SEARCHES);
      
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return suggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchQuery, suggestions]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onSearchChange(suggestion);
    saveRecentSearch(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleRecentSearchSelect = (recent: string) => {
    onSearchChange(recent);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const resetFilters = () => {
    onFiltersChange({
      categories: [],
      minRating: 0,
      maxRating: 5,
      priceRanges: [],
      openNow: false,
      sortBy: 'name',
    });
  };

  const hasActiveFilters = () => {
    return filters.categories.length > 0 || 
           filters.priceRanges.length > 0 || 
           filters.openNow || 
           filters.minRating > 0 || 
           filters.sortBy !== 'name';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRanges.length > 0) count++;
    if (filters.openNow) count++;
    if (filters.minRating > 0) count++;
    if (filters.sortBy !== 'name') count++;
    return count;
  };

  return (
    <View style={styles.container}>
      {/* Main Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: cardBackground, borderColor }]}>
        <Ionicons name="search" size={20} color={placeholderColor} style={styles.searchIcon} />
        
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow for selection
            setTimeout(() => {
              setIsFocused(false);
              setShowSuggestions(false);
            }, 200);
          }}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />

        {/* Clear Search Button */}
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onSearchChange('')}
          >
            <Ionicons name="close-circle" size={20} color={placeholderColor} />
          </TouchableOpacity>
        )}

        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: '#2E5AA7' }]}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons name="options" size={18} color="#FFFFFF" />
          {hasActiveFilters() && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Suggestions Dropdown */}
      {(showSuggestions && isFocused) && (
        <Animated.View 
          style={[
            styles.suggestionsContainer, 
            { backgroundColor: cardBackground, borderColor, opacity: fadeAnim }
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchQuery.trim() && (
              <View style={styles.suggestionsSection}>
                <View style={styles.suggestionsSectionHeader}>
                  <Text style={[styles.suggestionsSectionTitle, { color: textColor }]}>
                    Recent Searches
                  </Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={[styles.clearRecentText, { color: '#2E5AA7' }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((recent, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleRecentSearchSelect(recent)}
                  >
                    <Ionicons name="time-outline" size={16} color={placeholderColor} />
                    <Text style={[styles.suggestionText, { color: textColor }]}>
                      {recent}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Filtered Suggestions */}
            {filteredSuggestions.length > 0 && (
              <View style={styles.suggestionsSection}>
                <Text style={[styles.suggestionsSectionTitle, { color: textColor }]}>
                  Suggestions
                </Text>
                {filteredSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(suggestion)}
                  >
                    <Ionicons name="search" size={16} color={placeholderColor} />
                    <Text style={[styles.suggestionText, { color: textColor }]}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
              <Text style={[styles.modalCancelText, { color: '#2E5AA7' }]}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: textColor }]}>Filters</Text>
            
            <TouchableOpacity onPress={resetFilters}>
              <Text style={[styles.modalResetText, { color: '#2E5AA7' }]}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Categories Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>Categories</Text>
              <View style={styles.categoriesGrid}>
                {availableCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: filters.categories.includes(category.id)
                          ? '#2E5AA7'
                          : cardBackground,
                        borderColor: filters.categories.includes(category.id)
                          ? '#2E5AA7'
                          : borderColor,
                      },
                    ]}
                    onPress={() => {
                      const newCategories = filters.categories.includes(category.id)
                        ? filters.categories.filter(c => c !== category.id)
                        : [...filters.categories, category.id];
                      onFiltersChange({ ...filters, categories: newCategories });
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color: filters.categories.includes(category.id)
                            ? '#FFFFFF'
                            : textColor,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>Minimum Rating</Text>
              <View style={styles.ratingOptions}>
                {[0, 3, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      {
                        backgroundColor: filters.minRating === rating
                          ? '#2E5AA7'
                          : cardBackground,
                        borderColor: filters.minRating === rating
                          ? '#2E5AA7'
                          : borderColor,
                      },
                    ]}
                    onPress={() => onFiltersChange({ ...filters, minRating: rating })}
                  >
                    <Text
                      style={[
                        styles.ratingOptionText,
                        {
                          color: filters.minRating === rating ? '#FFFFFF' : textColor,
                        },
                      ]}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>Price Range</Text>
              <View style={styles.priceRangesGrid}>
                {availablePriceRanges.map((priceRange) => (
                  <TouchableOpacity
                    key={priceRange}
                    style={[
                      styles.priceRangeChip,
                      {
                        backgroundColor: filters.priceRanges.includes(priceRange)
                          ? '#2E5AA7'
                          : cardBackground,
                        borderColor: filters.priceRanges.includes(priceRange)
                          ? '#2E5AA7'
                          : borderColor,
                      },
                    ]}
                    onPress={() => {
                      const newPriceRanges = filters.priceRanges.includes(priceRange)
                        ? filters.priceRanges.filter(p => p !== priceRange)
                        : [...filters.priceRanges, priceRange];
                      onFiltersChange({ ...filters, priceRanges: newPriceRanges });
                    }}
                  >
                    <Text
                      style={[
                        styles.priceRangeChipText,
                        {
                          color: filters.priceRanges.includes(priceRange)
                            ? '#FFFFFF'
                            : textColor,
                        },
                      ]}
                    >
                      {priceRange}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Open Now Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.openNowToggle}
                onPress={() => onFiltersChange({ ...filters, openNow: !filters.openNow })}
              >
                <View style={styles.openNowLeft}>
                  <Text style={[styles.filterSectionTitle, { color: textColor }]}>Open Now</Text>
                  <Text style={[styles.openNowSubtext, { color: placeholderColor }]}>
                    Show only shops that are currently open
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: filters.openNow ? '#2E5AA7' : borderColor,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      {
                        transform: [{ translateX: filters.openNow ? 20 : 2 }],
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Sort By Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: textColor }]}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'rating', label: 'Rating' },
                  { key: 'distance', label: 'Distance' },
                  { key: 'price', label: 'Price' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOption,
                      {
                        backgroundColor: filters.sortBy === option.key
                          ? '#2E5AA7'
                          : cardBackground,
                        borderColor: filters.sortBy === option.key
                          ? '#2E5AA7'
                          : borderColor,
                      },
                    ]}
                    onPress={() => onFiltersChange({ ...filters, sortBy: option.key as any })}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        {
                          color: filters.sortBy === option.key ? '#FFFFFF' : textColor,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={[styles.modalFooter, { borderTopColor: borderColor }]}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: '#2E5AA7' }]}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filterButton: {
    position: 'relative',
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 20,
    right: 20,
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionsSection: {
    paddingVertical: 8,
  },
  suggestionsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  clearRecentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  modalResetText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  ratingOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  priceRangesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceRangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  priceRangeChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  openNowToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openNowLeft: {
    flex: 1,
  },
  openNowSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default EnhancedSearchBar;
