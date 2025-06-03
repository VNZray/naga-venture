import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import {
  ShopDetailContactInfo,
  ShopDetailBusinessHours,
  ShopDetailAmenityGrid,
  ShopDetailPromotionCard,
} from '../elements';

interface ShopDetailInfoSectionProps {
  shop: ShopData;
  onDirectionsPress: () => void;
}

const ShopDetailInfoSection: React.FC<ShopDetailInfoSectionProps> = ({
  shop,
  onDirectionsPress
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('about');

  const toggleSection = useCallback((section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

  const renderExpandableSection = (
    title: string,
    sectionKey: string,
    content: React.ReactNode,
    icon: string,
    itemCount?: number
  ) => {
    const isExpanded = expandedSection === sectionKey;
    
    return (
      <View style={styles.expandableSection}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name={icon as any} size={20} color={ShopColors.accent} />
            <Text style={styles.sectionTitle}>{title}</Text>
            {itemCount !== undefined && (
              <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>{itemCount}</Text>
              </View>
            )}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={ShopColors.textSecondary}
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.sectionContent}>
            {content}
          </View>
        )}
      </View>
    );
  };

  const renderVerificationInfo = () => {
    if (!shop.verification?.isVerified) return null;

    return (
      <View style={styles.verificationContainer}>
        <View style={styles.verificationHeader}>
          <View style={styles.verifiedMainBadge}>
            <Ionicons name="checkmark-circle" size={20} color={ShopColors.success} />
            <Text style={styles.verifiedMainText}>Verified Business</Text>
          </View>
        </View>

        {shop.verification.verificationBadges && shop.verification.verificationBadges.length > 0 && (
          <View style={styles.verificationBadges}>
            {shop.verification.verificationBadges.map((badge, index) => (
              <View key={index} style={styles.verificationBadge}>
                <Ionicons name="ribbon" size={12} color={ShopColors.accent} />
                <Text style={styles.verificationBadgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        )}

        {shop.stats && (
          <View style={styles.trustMetrics}>
            {shop.stats.responseRate && (
              <View style={styles.trustMetric}>
                <Text style={styles.trustMetricValue}>{shop.stats.responseRate}%</Text>
                <Text style={styles.trustMetricLabel}>Response Rate</Text>
              </View>
            )}
            {shop.stats.averageResponseTime && (
              <View style={styles.trustMetric}>
                <Text style={styles.trustMetricValue}>{shop.stats.averageResponseTime}</Text>
                <Text style={styles.trustMetricLabel}>Response Time</Text>
              </View>
            )}
            {shop.stats.viewCount && (
              <View style={styles.trustMetric}>
                <Text style={styles.trustMetricValue}>{shop.stats.viewCount.toLocaleString()}</Text>
                <Text style={styles.trustMetricLabel}>Profile Views</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* About Section */}
      {renderExpandableSection(
        'About This Business',
        'about',
        <Text style={styles.aboutText}>
          {shop.story || shop.description || 'No description available.'}
        </Text>,
        'information-circle-outline'
      )}

      {/* Contact & Location Section */}
      {renderExpandableSection(
        'Contact & Location',
        'contact',
        <ShopDetailContactInfo
          location={shop.location}
          contact={shop.contact}
          email={shop.email}
          socialLinks={shop.socialLinks}
          onDirectionsPress={onDirectionsPress}
        />,
        'location-outline'
      )}

      {/* Business Hours Section */}
      {shop.businessHours && renderExpandableSection(
        'Business Hours',
        'hours',
        <ShopDetailBusinessHours businessHours={shop.businessHours} />,
        'time-outline'
      )}

      {/* Amenities Section */}
      {shop.amenities && shop.amenities.length > 0 && renderExpandableSection(
        'Amenities & Features',
        'amenities',
        <ShopDetailAmenityGrid amenities={shop.amenities} />,
        'list-outline',
        shop.amenities.length
      )}

      {/* Promotions Section */}
      {shop.promotions && shop.promotions.filter(p => p.isActive).length > 0 && renderExpandableSection(
        'Current Promotions',
        'promotions',
        <View style={styles.promotionsContainer}>
          {shop.promotions.filter(p => p.isActive).map(promotion => (
            <ShopDetailPromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </View>,
        'pricetag-outline',
        shop.promotions.filter(p => p.isActive).length
      )}

      {/* Verification & Trust Section */}
      {shop.verification?.isVerified && renderExpandableSection(
        'Verification & Trust',
        'verification',
        renderVerificationInfo(),
        'shield-checkmark-outline'
      )}

      {/* Business Information Summary */}
      <View style={styles.businessSummary}>
        <View style={styles.summaryItem}>
          <Ionicons name="calendar" size={16} color={ShopColors.textSecondary} />
          <Text style={styles.summaryText}>
            Established {shop.stats?.viewCount ? 'Recently' : 'Business'}
          </Text>
        </View>
        
        {shop.category && (
          <View style={styles.summaryItem}>
            <Ionicons name="storefront" size={16} color={ShopColors.textSecondary} />
            <Text style={styles.summaryText}>
              {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)} Business
            </Text>
          </View>
        )}
        
        {shop.priceRange && (
          <View style={styles.summaryItem}>
            <Ionicons name="card" size={16} color={ShopColors.textSecondary} />
            <Text style={styles.summaryText}>Price Range: {shop.priceRange}</Text>
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
  
  // Expandable Sections
  expandableSection: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ShopColors.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: ShopColors.cardBackground,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    flex: 1,
  },
  itemCountBadge: {
    backgroundColor: ShopColors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  itemCountText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.accent,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: ShopColors.border,
  },
  
  // About Section
  aboutText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 22,
    padding: 16,
  },
  
  // Promotions Container
  promotionsContainer: {
    paddingHorizontal: -20, // Counteract molecule's horizontal padding
  },
  
  // Verification Section
  verificationContainer: {
    padding: 16,
  },
  verificationHeader: {
    marginBottom: 16,
  },
  verifiedMainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.success + '15',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  verifiedMainText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.success,
  },
  verificationBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ShopColors.accent + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  verificationBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.accent,
  },
  trustMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: ShopColors.background,
    borderRadius: 8,
    padding: 12,
  },
  trustMetric: {
    alignItems: 'center',
  },
  trustMetricValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
  },
  trustMetricLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Business Summary
  businessSummary: {
    backgroundColor: ShopColors.cardBackground,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: ShopColors.border,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
});

export default React.memo(ShopDetailInfoSection);