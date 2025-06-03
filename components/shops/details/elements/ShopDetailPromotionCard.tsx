import { ShopColors } from '@/constants/ShopColors';
import type { ShopPromotion } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ShopDetailPromotionCardProps {
  promotion: ShopPromotion;
  onPress?: (promotion: ShopPromotion) => void;
}

const ShopDetailPromotionCard: React.FC<ShopDetailPromotionCardProps> = ({
  promotion,
  onPress,
}) => {
  if (!promotion) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress(promotion);
    }
  };

  const isExpiringSoon = () => {
    if (!promotion.validUntil) return false;

    const today = new Date();
    const expiry = new Date(promotion.validUntil);

    // Set expiry to end of day for fair comparison
    expiry.setHours(23, 59, 59, 999);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(
      `Promotion ${promotion.id} - Today: ${today}, Expiry: ${expiry}, Diff Days: ${diffDays}`
    );

    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = () => {
    if (!promotion.validUntil) return false;

    const today = new Date();
    const expiry = new Date(promotion.validUntil);

    // Set expiry to end of day for fair comparison
    expiry.setHours(23, 59, 59, 999);

    const expired = today > expiry;
    console.log(`Promotion ${promotion.id} expired check: ${expired}`);

    return expired;
  };

  const formatExpiryDate = () => {
    if (!promotion.validUntil) return 'No expiry';

    const expiry = new Date(promotion.validUntil);
    return expiry.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    if (!promotion.validUntil) return null;

    const today = new Date();
    const expiry = new Date(promotion.validUntil);

    // Set expiry to end of day for fair comparison
    expiry.setHours(23, 59, 59, 999);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    return `${diffDays} days left`;
  };

  const promotionExpired = isExpired();
  const promotionExpiringSoon = isExpiringSoon();
  const isInactive = !promotion.isActive || promotionExpired;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isInactive && styles.inactiveCard,
        promotionExpired && styles.expiredCard,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={isInactive}
    >
      {/* Promotion Image */}
      {promotion.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: promotion.image }}
            style={styles.promotionImage}
            resizeMode="cover"
          />
          {!promotion.isActive && (
            <View style={styles.inactiveOverlay}>
              <Text style={styles.inactiveText}>Inactive</Text>
            </View>
          )}
          {promotionExpired && (
            <View style={styles.expiredOverlay}>
              <Text style={styles.expiredText}>Expired</Text>
            </View>
          )}
        </View>
      )}

      {/* Promotion Content */}
      <View style={styles.content}>
        {/* Header with title and discount */}
        <View style={styles.header}>
          <Text
            style={[styles.title, isInactive && styles.disabledText]}
            numberOfLines={2}
          >
            {promotion.title}
          </Text>

          {promotion.discountPercent && promotion.discountPercent > 0 && (
            <View
              style={[styles.discountBadge, isInactive && styles.disabledBadge]}
            >
              <Text style={styles.discountText}>
                {promotion.discountPercent}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text
          style={[styles.description, isInactive && styles.disabledText]}
          numberOfLines={3}
        >
          {promotion.description}
        </Text>

        {/* Footer with expiry and status */}
        <View style={styles.footer}>
          <View style={styles.expiryInfo}>
            <Ionicons
              name="time-outline"
              size={14}
              color={
                promotionExpired
                  ? ShopColors.error
                  : promotionExpiringSoon
                    ? ShopColors.warning
                    : ShopColors.textSecondary
              }
            />
            <Text
              style={[
                styles.expiryText,
                promotionExpired && styles.expiredExpiryText,
                promotionExpiringSoon && styles.expiringSoonText,
              ]}
            >
              {getDaysRemaining()}
            </Text>
          </View>

          {promotionExpiringSoon && !promotionExpired && (
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyText}>Hurry!</Text>
            </View>
          )}
        </View>

        {/* Terms (if available) */}
        {promotion.terms && (
          <Text style={styles.terms} numberOfLines={2}>
            Terms: {promotion.terms}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ShopColors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ShopColors.border,
  },
  inactiveCard: {
    opacity: 0.6,
    backgroundColor: ShopColors.background,
  },
  expiredCard: {
    opacity: 0.5,
    borderColor: ShopColors.error,
  },

  // Image Section
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
    backgroundColor: ShopColors.background,
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  expiredText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },

  // Content Section
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginRight: 12,
    lineHeight: 22,
  },
  discountBadge: {
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  disabledBadge: {
    backgroundColor: ShopColors.disabled,
  },
  discountText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },

  // Description
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expiryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textSecondary,
  },
  expiredExpiryText: {
    color: ShopColors.error,
    fontFamily: 'Poppins-SemiBold',
  },
  expiringSoonText: {
    color: ShopColors.warning,
    fontFamily: 'Poppins-SemiBold',
  },
  urgencyBadge: {
    backgroundColor: ShopColors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
  },

  // Terms
  terms: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },

  // Disabled states
  disabledText: {
    color: ShopColors.disabled,
  },
});

export default React.memo(ShopDetailPromotionCard);
