import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopColors } from '@/constants/ShopColors';
import type { ShopData, ShopReview } from '@/types/shop';
import {
  ShopDetailRatingBreakdown,
  ShopDetailReviewCard,
} from '../elements';

interface ShopDetailReviewsSectionProps {
  shop: ShopData;
  onImagePress: (imageUrl: string) => void;
  onHelpfulPress: (reviewId: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'verified' | 'photos';

const ShopDetailReviewsSection: React.FC<ShopDetailReviewsSectionProps> = ({
  shop,
  onImagePress,
  onHelpfulPress
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Process and filter reviews
  const { sortedReviews, reviewStats } = useMemo(() => {
    if (!shop.reviews || shop.reviews.length === 0) {
      return { sortedReviews: [], reviewStats: null };
    }

    let filteredReviews = [...shop.reviews];

    // Apply filters
    switch (filterBy) {
      case '5':
      case '4':
      case '3':
      case '2':
      case '1':
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filterBy));
        break;
      case 'verified':
        filteredReviews = filteredReviews.filter(review => review.isVerifiedPurchase);
        break;
      case 'photos':
        filteredReviews = filteredReviews.filter(review => review.images && review.images.length > 0);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        filteredReviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filteredReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        break;
    }

    // Calculate stats
    const stats = {
      total: shop.reviews.length,
      filtered: filteredReviews.length,
      verified: shop.reviews.filter(r => r.isVerifiedPurchase).length,
      withPhotos: shop.reviews.filter(r => r.images && r.images.length > 0).length,
      withOwnerResponse: shop.reviews.filter(r => r.response).length,
    };

    return { sortedReviews: filteredReviews, reviewStats: stats };
  }, [shop.reviews, sortBy, filterBy]);

  const handleSortChange = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  const handleFilterChange = useCallback((option: FilterOption) => {
    setFilterBy(option);
  }, []);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'highest': return 'Highest Rating';
      case 'lowest': return 'Lowest Rating';
      case 'helpful': return 'Most Helpful';
    }
  };

  const getFilterLabel = (option: FilterOption) => {
    switch (option) {
      case 'all': return 'All Reviews';
      case 'verified': return 'Verified Only';
      case 'photos': return 'With Photos';
      default: return `${option} Stars`;
    }
  };

  // Empty state
  if (!shop.reviews || shop.reviews.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="chatbubbles-outline" size={48} color={ShopColors.textSecondary} />
        <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
        <Text style={styles.emptyStateText}>Be the first to leave a review!</Text>
        <TouchableOpacity style={styles.writeReviewButton}>
          <Ionicons name="create" size={16} color="#FFFFFF" />
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Reviews Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryHeader}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <TouchableOpacity style={styles.writeReviewButton}>
            <Ionicons name="create" size={14} color="#FFFFFF" />
            <Text style={styles.writeReviewButtonText}>Write Review</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewsSummary}>
          <View style={styles.reviewsSummaryLeft}>
            <Text style={styles.reviewsAverageRating}>{shop.rating.toFixed(1)}</Text>
            <View style={styles.reviewsStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={star <= shop.rating ? ShopColors.warning : ShopColors.border}
                />
              ))}
            </View>
            <Text style={styles.reviewsCount}>Based on {shop.ratingCount} reviews</Text>
          </View>
          
          <View style={styles.reviewsSummaryRight}>
            <ShopDetailRatingBreakdown 
              ratingBreakdown={shop.ratingBreakdown} 
              totalRatings={shop.ratingCount} 
            />
          </View>
        </View>

        {/* Review Statistics */}
        {reviewStats && (
          <View style={styles.reviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reviewStats.verified}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reviewStats.withPhotos}</Text>
              <Text style={styles.statLabel}>With Photos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reviewStats.withOwnerResponse}</Text>
              <Text style={styles.statLabel}>Owner Replied</Text>
            </View>
          </View>
        )}
      </View>

      {/* Filters and Sorting */}
      <View style={styles.filtersSection}>
        <View style={styles.filtersHeader}>
          <TouchableOpacity
            style={styles.filtersToggle}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={16} color={ShopColors.accent} />
            <Text style={styles.filtersToggleText}>Filters & Sort</Text>
            <Ionicons
              name={showFilters ? "chevron-up" : "chevron-down"}
              size={16}
              color={ShopColors.textSecondary}
            />
          </TouchableOpacity>
          
          <Text style={styles.resultCount}>
            {reviewStats?.filtered} of {reviewStats?.total} reviews
          </Text>
        </View>

        {showFilters && (
          <View style={styles.filtersContent}>
            {/* Sort Options */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Sort by</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                {(['newest', 'helpful', 'highest', 'lowest', 'oldest'] as SortOption[]).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      sortBy === option && styles.filterOptionActive
                    ]}
                    onPress={() => handleSortChange(option)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      sortBy === option && styles.filterOptionTextActive
                    ]}>
                      {getSortLabel(option)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Filter Options */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Filter by</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
                {(['all', '5', '4', '3', '2', '1', 'verified', 'photos'] as FilterOption[]).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      filterBy === option && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange(option)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filterBy === option && styles.filterOptionTextActive
                    ]}>
                      {getFilterLabel(option)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      {/* Reviews List */}
      <FlatList
        data={sortedReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShopDetailReviewCard 
            review={item} 
            onImagePress={onImagePress}
            onHelpfulPress={onHelpfulPress}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.noResultsState}>
            <Ionicons name="search-outline" size={32} color={ShopColors.textSecondary} />
            <Text style={styles.noResultsTitle}>No Reviews Found</Text>
            <Text style={styles.noResultsText}>
              No reviews match your current filters. Try adjusting your search criteria.
            </Text>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setFilterBy('all');
                setSortBy('newest');
              }}
            >
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },

  // Summary Section
  summarySection: {
    backgroundColor: ShopColors.cardBackground,
    marginBottom: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  summaryHeader: {
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
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  writeReviewButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  reviewsSummary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  reviewsSummaryLeft: {
    alignItems: 'center',
    marginRight: 24,
  },
  reviewsAverageRating: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
  },
  reviewsStars: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 2,
  },
  reviewsCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
  },
  reviewsSummaryRight: {
    flex: 1,
  },
  reviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ShopColors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    marginTop: 2,
  },

  // Filters Section
  filtersSection: {
    backgroundColor: ShopColors.cardBackground,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filtersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtersToggleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.accent,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: ShopColors.border,
    gap: 16,
  },
  filterGroup: {
    marginTop: 16,
  },
  filterGroupTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: ShopColors.background,
    borderWidth: 1,
    borderColor: ShopColors.border,
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: ShopColors.accent,
    borderColor: ShopColors.accent,
  },
  filterOptionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textPrimary,
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
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
    marginBottom: 20,
  },
  noResultsState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearFiltersButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});

export default React.memo(ShopDetailReviewsSection);