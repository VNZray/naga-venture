import { ShopColors } from '@/constants/ShopColors';
import type { ShopGallery } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ShopDetailPhotoGalleryProps {
  gallery?: ShopGallery[];
  additionalImages?: string[];
  onImagePress?: (imageUrl: string) => void;
}

const ShopDetailPhotoGallery: React.FC<ShopDetailPhotoGalleryProps> = ({
  gallery = [],
  additionalImages = [],
  onImagePress
}) => {
  // Combine gallery and additional images
  const allImages: (ShopGallery | { id: string; url: string; caption?: string; type: 'additional' })[] = [
    ...gallery,
    ...additionalImages.map((url, index) => ({
      id: `additional-${index}`,
      url,
      type: 'additional' as const,
      caption: ''
    }))
  ];

  if (allImages.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="images-outline" size={48} color={ShopColors.textSecondary} />
        <Text style={styles.emptyStateTitle}>No Photos Available</Text>
        <Text style={styles.emptyStateText}>This business hasn&apos;t uploaded photos yet.</Text>
      </View>
    );
  }

  const renderPhotoItem = ({ item }: { item: typeof allImages[0] }) => (
    <TouchableOpacity 
      style={styles.photoItem}
      onPress={() => onImagePress?.(item.url)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.url }} style={styles.photoImage} />
      
      {/* Photo Type Badge */}
      {item.type && (
        <View style={[
          styles.typeBadge,
          item.type === 'customer' && styles.customerBadge,
          item.type === 'product' && styles.productBadge,
          item.type === 'ambiance' && styles.ambianceBadge,
        ]}>
          <Text style={styles.typeBadgeText}>
            {item.type === 'customer' ? 'Customer' : 
             item.type === 'product' ? 'Product' :
             item.type === 'ambiance' ? 'Ambiance' : 'Shop'}
          </Text>
        </View>
      )}
      
      {/* Caption */}
      {item.caption && (
        <View style={styles.photoCaption}>
          <Text style={styles.photoCaptionText} numberOfLines={2}>
            {item.caption}
          </Text>
        </View>
      )}
      
      {/* Customer Photo Indicator */}
      {'isCustomerPhoto' in item && item.isCustomerPhoto && (
        <View style={styles.customerPhotoIndicator}>
          <Ionicons name="people" size={12} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={allImages}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.photosGridContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photosGridContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 12,
  },
  photoItem: {
    width: (screenWidth - 48) / 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: ShopColors.cardBackground,
    elevation: 2,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  customerBadge: {
    backgroundColor: ShopColors.success + 'CC',
  },
  productBadge: {
    backgroundColor: ShopColors.accent + 'CC',
  },
  ambianceBadge: {
    backgroundColor: ShopColors.warning + 'CC',
  },
  typeBadgeText: {
    fontSize: 8,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  photoCaption: {
    padding: 8,
    backgroundColor: ShopColors.cardBackground,
  },
  photoCaptionText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 14,
  },
  customerPhotoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: ShopColors.success,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});

export default React.memo(ShopDetailPhotoGallery);