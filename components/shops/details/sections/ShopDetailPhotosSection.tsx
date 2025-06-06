import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ShopDetailPhotoGallery } from '../elements';

const { width: screenWidth } = Dimensions.get('window');

interface ShopDetailPhotosSectionProps {
  shop: ShopData;
  onImagePress: (imageUrl: string) => void;
}

type PhotoFilter = 'all' | 'shop' | 'product' | 'customer' | 'ambiance';

const ShopDetailPhotosSection: React.FC<ShopDetailPhotosSectionProps> = ({
  shop,
  onImagePress,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Process all images
  const { allImages, filteredImages, photoStats } = useMemo(() => {
    const gallery = shop.gallery || [];
    const additional = (shop.additionalImages || []).map((url, index) => ({
      id: `additional-${index}`,
      url,
      type: 'shop' as const,
      caption: '',
    }));

    const allImages = [...gallery, ...additional];

    // Filter images
    let filtered = allImages;
    if (selectedFilter !== 'all') {
      filtered = allImages.filter((img) => img.type === selectedFilter);
    }

    // Calculate stats
    const stats = {
      total: allImages.length,
      shop: allImages.filter((img) => img.type === 'shop').length,
      product: allImages.filter((img) => img.type === 'product').length,
      customer: allImages.filter(
        (img) =>
          img.type === 'customer' ||
          ('isCustomerPhoto' in img && img.isCustomerPhoto)
      ).length,
      ambiance: allImages.filter((img) => img.type === 'ambiance').length,
    };

    return { allImages, filteredImages: filtered, photoStats: stats };
  }, [shop.gallery, shop.additionalImages, selectedFilter]);

  const handleFilterChange = useCallback((filter: PhotoFilter) => {
    setSelectedFilter(filter);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  }, [viewMode]);

  const getFilterLabel = (filter: PhotoFilter) => {
    switch (filter) {
      case 'all':
        return 'All Photos';
      case 'shop':
        return 'Shop';
      case 'product':
        return 'Products';
      case 'customer':
        return 'Customer';
      case 'ambiance':
        return 'Ambiance';
    }
  };

  const getFilterIcon = (filter: PhotoFilter) => {
    switch (filter) {
      case 'all':
        return 'images';
      case 'shop':
        return 'storefront';
      case 'product':
        return 'cube';
      case 'customer':
        return 'people';
      case 'ambiance':
        return 'color-palette';
    }
  };

  // Empty state
  if (allImages.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="images-outline"
          size={48}
          color={ShopColors.textSecondary}
        />
        <Text style={styles.emptyStateTitle}>No Photos Available</Text>
        <Text style={styles.emptyStateText}>
          This business hasn&apos;t uploaded photos yet.
        </Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload Photos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text style={styles.sectionTitle}>Photo Gallery</Text>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={toggleViewMode}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={20}
              color={ShopColors.accent}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.photoStats}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatNumber}>{allImages.length}</Text>
            <Text style={styles.mainStatLabel}>Total Photos</Text>
          </View>

          <View style={styles.statsGrid}>
            {photoStats.shop > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{photoStats.shop}</Text>
                <Text style={styles.statLabel}>Shop</Text>
              </View>
            )}
            {photoStats.product > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{photoStats.product}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
            )}
            {photoStats.customer > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{photoStats.customer}</Text>
                <Text style={styles.statLabel}>Customer</Text>
              </View>
            )}
            {photoStats.ambiance > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{photoStats.ambiance}</Text>
                <Text style={styles.statLabel}>Ambiance</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={
            ['all', 'shop', 'product', 'customer', 'ambiance'] as PhotoFilter[]
          }
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterTabs}
          renderItem={({ item }) => {
            const count = item === 'all' ? allImages.length : photoStats[item];
            if (item !== 'all' && count === 0) return null;

            return (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  selectedFilter === item && styles.filterTabActive,
                ]}
                onPress={() => handleFilterChange(item)}
              >
                <Ionicons
                  name={getFilterIcon(item) as any}
                  size={16}
                  color={
                    selectedFilter === item
                      ? '#FFFFFF'
                      : ShopColors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === item && styles.filterTabTextActive,
                  ]}
                >
                  {getFilterLabel(item)}
                </Text>
                <View
                  style={[
                    styles.filterTabBadge,
                    selectedFilter === item && styles.filterTabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterTabBadgeText,
                      selectedFilter === item &&
                        styles.filterTabBadgeTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Photo Gallery */}
      {filteredImages.length > 0 ? (
        <ShopDetailPhotoGallery
          gallery={filteredImages}
          onImagePress={onImagePress}
        />
      ) : (
        <View style={styles.noPhotosState}>
          <Ionicons
            name="images-outline"
            size={32}
            color={ShopColors.textSecondary}
          />
          <Text style={styles.noPhotosTitle}>
            No {getFilterLabel(selectedFilter)}
          </Text>
          <Text style={styles.noPhotosText}>
            No photos found in this category. Try selecting a different filter.
          </Text>
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={styles.clearFilterButtonText}>View All Photos</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <View style={styles.uploadPrompt}>
          <Ionicons name="camera" size={20} color={ShopColors.accent} />
          <Text style={styles.uploadPromptText}>
            Have photos of this business?
          </Text>
        </View>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Add Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },

  // Header Section
  headerSection: {
    backgroundColor: ShopColors.cardBackground,
    paddingVertical: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  headerTop: {
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
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: ShopColors.accent + '15',
  },
  photoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainStat: {
    alignItems: 'center',
    marginRight: 24,
  },
  mainStatNumber: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.accent,
  },
  mainStatLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  statsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },

  // Filter Section
  filterSection: {
    backgroundColor: ShopColors.cardBackground,
    paddingVertical: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  filterTabs: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: ShopColors.background,
    borderWidth: 1,
    borderColor: ShopColors.border,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: ShopColors.accent,
    borderColor: ShopColors.accent,
  },
  filterTabText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabBadge: {
    backgroundColor: ShopColors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  filterTabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterTabBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textSecondary,
  },
  filterTabBadgeTextActive: {
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
  noPhotosState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  noPhotosTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  noPhotosText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterButton: {
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearFilterButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },

  // Upload Section
  uploadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  uploadPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  uploadPromptText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  uploadButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});

export default React.memo(ShopDetailPhotosSection);
