import { ShopColors } from '@/constants/ShopColors';
import type { ShopData, ShopPromotion } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ShopDetailPromotionCard } from '../elements';

interface ShopDetailPromotionsSectionProps {
  shop: ShopData;
}

const ShopDetailPromotionsSection: React.FC<
  ShopDetailPromotionsSectionProps
> = ({ shop }) => {
  const [selectedPromotion, setSelectedPromotion] =
    useState<ShopPromotion | null>(null);

  // Helper function to check if promotion is expired
  const isPromotionExpired = (promotion: ShopPromotion): boolean => {
    if (!promotion.validUntil) return false;

    const today = new Date();
    const expiry = new Date(promotion.validUntil);

    // Set time to end of day for expiry date to be more lenient
    expiry.setHours(23, 59, 59, 999);

    return today > expiry;
  };

  // Process promotions with fixed logic
  const promotions = useMemo(() => {
    if (!shop?.promotions || !Array.isArray(shop.promotions)) {
      return [];
    }

    console.log('Processing promotions:', shop.promotions);

    // Sort promotions: active and not expired first, then by expiry date
    return shop.promotions.sort((a, b) => {
      const aExpired = isPromotionExpired(a);
      const bExpired = isPromotionExpired(b);
      const aActive = a.isActive && !aExpired;
      const bActive = b.isActive && !bExpired;

      console.log(
        `Promotion ${a.id}: isActive=${a.isActive}, expired=${aExpired}, final active=${aActive}`
      );
      console.log(
        `Promotion ${b.id}: isActive=${b.isActive}, expired=${bExpired}, final active=${bActive}`
      );

      // Active promotions first
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // Then sort by expiry date (closest expiry first for active ones)
      if (a.validUntil && b.validUntil) {
        return (
          new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
        );
      }
      if (a.validUntil && !b.validUntil) return -1;
      if (!a.validUntil && b.validUntil) return 1;

      return 0;
    });
  }, [shop?.promotions]);

  const activePromotions = useMemo(() => {
    const active = promotions.filter(
      (promo) => promo.isActive && !isPromotionExpired(promo)
    );
    console.log('Active promotions:', active);
    return active;
  }, [promotions]);

  const expiredPromotions = useMemo(() => {
    const expired = promotions.filter(
      (promo) => !promo.isActive || isPromotionExpired(promo)
    );
    console.log('Expired promotions:', expired);
    return expired;
  }, [promotions]);

  // Empty state
  if (!shop?.promotions || shop.promotions.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="pricetag-outline"
          size={48}
          color={ShopColors.textSecondary}
        />
        <Text style={styles.emptyStateTitle}>No Promotions Available</Text>
        <Text style={styles.emptyStateText}>
          This business doesn&apos;t have any promotions at the moment. Check
          back later for great deals!
        </Text>
      </View>
    );
  }

  const handlePromotionPress = (promotion: ShopPromotion) => {
    setSelectedPromotion(promotion);
  };

  const renderPromotion = ({ item }: { item: ShopPromotion }) => {
    return (
      <ShopDetailPromotionCard
        promotion={item}
        onPress={handlePromotionPress}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Active Promotions Section */}
        {activePromotions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={20} color={ShopColors.accent} />
              <Text style={styles.sectionTitle}>
                Active Promotions ({activePromotions.length})
              </Text>
            </View>

            <FlatList
              data={activePromotions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={renderPromotion}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}

        {/* Expired/Inactive Promotions Section */}
        {expiredPromotions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="time-outline"
                size={20}
                color={ShopColors.textSecondary}
              />
              <Text style={[styles.sectionTitle, styles.expiredSectionTitle]}>
                Past Promotions ({expiredPromotions.length})
              </Text>
            </View>

            <FlatList
              data={expiredPromotions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={renderPromotion}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}

        {/* Show message if no active promotions */}
        {activePromotions.length === 0 && expiredPromotions.length > 0 && (
          <View style={styles.noActivePromotions}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={ShopColors.textSecondary}
            />
            <Text style={styles.noActivePromotionsText}>
              No active promotions at the moment. Check out past promotions
              below!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Promotion Detail Modal */}
      <Modal
        visible={!!selectedPromotion}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPromotion(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Promotion Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedPromotion(null)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={ShopColors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView style={styles.modalScrollView}>
              {selectedPromotion && (
                <View style={styles.modalContent}>
                  {/* Promotion Image */}
                  {selectedPromotion.image && (
                    <Image
                      source={{ uri: selectedPromotion.image }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  )}

                  {/* Promotion Info */}
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalPromotionTitle}>
                      {selectedPromotion.title}
                    </Text>

                    {selectedPromotion.discountPercent &&
                      selectedPromotion.discountPercent > 0 && (
                        <View style={styles.modalDiscountBadge}>
                          <Text style={styles.modalDiscountText}>
                            {selectedPromotion.discountPercent}% OFF
                          </Text>
                        </View>
                      )}

                    <Text style={styles.modalDescription}>
                      {selectedPromotion.description}
                    </Text>

                    {selectedPromotion.validUntil && (
                      <View style={styles.modalExpiryInfo}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color={ShopColors.textSecondary}
                        />
                        <Text style={styles.modalExpiryText}>
                          Valid until:{' '}
                          {new Date(
                            selectedPromotion.validUntil
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                    )}

                    {selectedPromotion.terms && (
                      <View style={styles.modalTermsSection}>
                        <Text style={styles.modalTermsTitle}>
                          Terms & Conditions:
                        </Text>
                        <Text style={styles.modalTermsText}>
                          {selectedPromotion.terms}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  expiredSectionTitle: {
    color: ShopColors.textSecondary,
  },
  listContainer: {
    paddingBottom: 0,
  },

  // No Active Promotions Message
  noActivePromotions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  noActivePromotionsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
  },

  // Empty State
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: ShopColors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: ShopColors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: ShopColors.background,
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    backgroundColor: ShopColors.background,
  },
  modalInfo: {
    padding: 20,
  },
  modalPromotionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
    marginBottom: 12,
    lineHeight: 26,
  },
  modalDiscountBadge: {
    backgroundColor: ShopColors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDiscountText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
    lineHeight: 24,
    marginBottom: 16,
  },
  modalExpiryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalExpiryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textSecondary,
  },
  modalTermsSection: {
    backgroundColor: ShopColors.background,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  modalTermsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 8,
  },
  modalTermsText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 18,
  },
});

export default React.memo(ShopDetailPromotionsSection);
