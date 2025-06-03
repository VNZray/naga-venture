import { ShopColors } from '@/constants/ShopColors';
import type { ShopPromotion } from '@/types/shop';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

interface ShopDetailPromotionCardProps {
  promotion: ShopPromotion;
}

const ShopDetailPromotionCard: React.FC<ShopDetailPromotionCardProps> = ({ promotion }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getBadgeText = () => {
    if (promotion.discountPercent && promotion.discountPercent > 0) {
      return `${promotion.discountPercent}% OFF`;
    }
    return 'SPECIAL OFFER';
  };

  return (
    <View style={styles.promotionCard}>
      {promotion.image && (
        <Image source={{ uri: promotion.image }} style={styles.promotionImage} />
      )}
      
      <View style={styles.promotionContent}>
        <View style={styles.promotionHeader}>
          <View style={styles.promotionBadge}>
            <Text style={styles.promotionBadgeText}>
              {getBadgeText()}
            </Text>
          </View>
          {promotion.validUntil && (
            <Text style={styles.promotionExpiry}>
              Until {formatDate(promotion.validUntil)}
            </Text>
          )}
        </View>
        
        <Text style={styles.promotionTitle}>{promotion.title}</Text>
        <Text style={styles.promotionDescription}>{promotion.description}</Text>
        
        {promotion.terms && (
          <Text style={styles.promotionTerms}>*{promotion.terms}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  promotionCard: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.accent + '30',
    borderLeftWidth: 4,
    borderLeftColor: ShopColors.accent,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: ShopColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promotionImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  promotionContent: {
    padding: 16,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionBadge: {
    backgroundColor: ShopColors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promotionBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  promotionExpiry: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  promotionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    marginBottom: 4,
  },
  promotionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  promotionTerms: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    fontStyle: 'italic',
  },
});

export default React.memo(ShopDetailPromotionCard);