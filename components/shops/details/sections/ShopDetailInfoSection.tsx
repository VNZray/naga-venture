import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShopColors } from '@/constants/ShopColors';
import type { ShopData } from '@/types/shop';
import {
  ShopDetailContactInfo,
  ShopDetailBusinessHours,
  ShopDetailAmenityGrid,
} from '../elements';

interface ShopDetailInfoSectionProps {
  shop: ShopData;
  onDirectionsPress: () => void;
}

const ShopDetailInfoSection: React.FC<ShopDetailInfoSectionProps> = ({
  shop,
  onDirectionsPress
}) => {
  const getCurrentDayStatus = () => {
    if (!shop.businessHours) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = shop.businessHours[today as keyof typeof shop.businessHours];
    
    if (!todayHours) return null;
    
    if (todayHours.isClosed) {
      return { text: 'Closed Today', isOpen: false };
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    const isCurrentlyOpen = currentTime >= openTime && currentTime <= closeTime;
    
    const formatTime = (time: string) => {
      try {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      } catch {
        return time;
      }
    };
    
    return {
      text: `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`,
      isOpen: isCurrentlyOpen,
      status: isCurrentlyOpen ? 'Open' : 'Closed'
    };
  };

  const currentStatus = getCurrentDayStatus();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Contact & Location Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={20} color={ShopColors.accent} />
          <Text style={styles.sectionTitle}>Contact & Location</Text>
        </View>
        <ShopDetailContactInfo
          location={shop.location}
          contact={shop.contact}
          email={shop.email}
          socialLinks={shop.socialLinks}
          onDirectionsPress={onDirectionsPress}
        />
      </View>

      {/* Business Hours Section */}
      {shop.businessHours && (
        <>
          <View style={styles.separator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color={ShopColors.accent} />
              <Text style={styles.sectionTitle}>Hours</Text>
              {currentStatus && (
                <View style={styles.statusBadge}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: currentStatus.isOpen ? ShopColors.success : ShopColors.error }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: currentStatus.isOpen ? ShopColors.success : ShopColors.error }
                  ]}>
                    {currentStatus.status}
                  </Text>
                </View>
              )}
            </View>
            <ShopDetailBusinessHours businessHours={shop.businessHours} />
          </View>
        </>
      )}

      {/* Amenities Section */}
      {shop.amenities && shop.amenities.length > 0 && (
        <>
          <View style={styles.separator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={20} color={ShopColors.accent} />
              <Text style={styles.sectionTitle}>Amenities</Text>
              <Text style={styles.sectionCounter}>
                {shop.amenities.filter(a => a.available).length}/{shop.amenities.length}
              </Text>
            </View>
            <ShopDetailAmenityGrid amenities={shop.amenities} />
          </View>
        </>
      )}

      {/* About Section */}
      {(shop.description || shop.story) && (
        <>
          <View style={styles.separator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color={ShopColors.accent} />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.aboutText}>
              {shop.story || shop.description}
            </Text>
          </View>
        </>
      )}

      {/* Business Details Section */}
      <View style={styles.separator} />
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="storefront" size={20} color={ShopColors.accent} />
          <Text style={styles.sectionTitle}>Details</Text>
        </View>
        
        <View style={styles.detailsList}>
          {shop.category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}
              </Text>
            </View>
          )}
          
          {shop.priceRange && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price Range</Text>
              <Text style={styles.detailValue}>{shop.priceRange}</Text>
            </View>
          )}
          
          {shop.distance && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{shop.distance.toFixed(1)} km away</Text>
            </View>
          )}
        </View>
      </View>

      {/* Verification Section */}
      {shop.verification?.isVerified && (
        <>
          <View style={styles.separator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={20} color={ShopColors.success} />
              <Text style={styles.sectionTitle}>Verified</Text>
            </View>
            
            <View style={styles.verificationList}>
              <View style={styles.verifiedItem}>
                <Ionicons name="checkmark-circle" size={16} color={ShopColors.success} />
                <Text style={styles.verifiedText}>Verified Business</Text>
              </View>
              
              {shop.verification.verificationBadges?.map((badge, index) => (
                <View key={index} style={styles.verifiedItem}>
                  <Ionicons name="ribbon" size={16} color={ShopColors.accent} />
                  <Text style={styles.verifiedText}>{badge}</Text>
                </View>
              ))}
            </View>

            {/* Trust Stats */}
            {shop.stats && (
              <View style={styles.statsContainer}>
                {shop.stats.responseRate && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{shop.stats.responseRate}%</Text>
                    <Text style={styles.statLabel}>Response Rate</Text>
                  </View>
                )}
                {shop.stats.averageResponseTime && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{shop.stats.averageResponseTime}</Text>
                    <Text style={styles.statLabel}>Response Time</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </>
      )}

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ShopColors.background,
  },
  
  // Section Styles - Clean and minimal
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
  },
  
  sectionCounter: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: ShopColors.textSecondary,
  },
  
  // Clean separator line
  separator: {
    height: 1,
    backgroundColor: ShopColors.border,
    marginHorizontal: 20,
  },
  
  // Status badge for hours
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  
  // About text
  aboutText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    lineHeight: 24,
  },
  
  // Details list - simple rows
  detailsList: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: ShopColors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  
  // Verification
  verificationList: {
    gap: 12,
    marginBottom: 16,
  },
  verifiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifiedText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textPrimary,
  },
  
  // Stats - horizontal layout
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: ShopColors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: ShopColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: ShopColors.textSecondary,
    marginTop: 4,
  },
  
  bottomPadding: {
    height: 20,
  },
});

export default React.memo(ShopDetailInfoSection);