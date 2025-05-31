// Special Offers Component - Refactored to use BaseShopSection
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseShopSection, { ColorScheme } from '../core/BaseShopSection';

interface SpecialOffer {
  id: string;
  shop: ShopData;
  offerText: string;
  discount: string;
  validUntil: string;
  category: 'flash' | 'weekend' | 'new' | 'limited';
}

interface SpecialOffersProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  onViewAllPress?: () => void;
  onOfferPress?: (offerId: string) => void;
  limit?: number;
}

const SpecialOffers: React.FC<SpecialOffersProps> = React.memo(({
  shops, 
  onShopPress,
  onViewAllPress,
  onOfferPress,
  limit = 5 
}) => {
  // Memoized offers generation - only recalculates when shops or limit changes
  const offers = useMemo((): SpecialOffer[] => {
    const offerTemplates = [
      { text: "Flash Sale - {discount} off!", category: 'flash' as const, discount: '20%' },
      { text: "Weekend Special - {discount} discount", category: 'weekend' as const, discount: '15%' },
      { text: "New Customer Offer - {discount} off first order", category: 'new' as const, discount: '25%' },
      { text: "Limited Time - {discount} discount", category: 'limited' as const, discount: '30%' },
      { text: "Happy Hour - {discount} off selected items", category: 'flash' as const, discount: '10%' },
    ];

    return shops.slice(0, limit).map((shop, index) => {
      const template = offerTemplates[index % offerTemplates.length];
      return {
        id: `offer-${shop.id}`,
        shop,
        offerText: template.text.replace('{discount}', template.discount),
        discount: template.discount,
        validUntil: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        category: template.category,
      };
    });
  }, [shops, limit]);

  // Memoized offer color function

  const getOfferColor = useCallback((category: SpecialOffer['category']) => {
    switch (category) {
      case 'flash': return '#EF4444';
      case 'weekend': return '#10B981';
      case 'new': return '#3B82F6';
      case 'limited': return '#F59E0B';
      default: return '#6B7280';
    }
  }, []);

  const getOfferIcon = useCallback((category: SpecialOffer['category']) => {
    switch (category) {
      case 'flash': return 'flash' as any;
      case 'weekend': return 'calendar' as any;
      case 'new': return 'star' as any;
      case 'limited': return 'time' as any;
      default: return 'pricetag' as any;
    }
  }, []);

  // Convert offers to a shop-like array for BaseShopSection
  const shopOffers = useMemo(() => 
    offers.map(offer => ({
      ...offer.shop,
      id: offer.id, // Use offer ID so cards are unique
      _offer: offer // Add offer data to each shop
    })), [offers]);  

  // Render custom offer card
  const renderOfferCard = useCallback((shopWithOffer: ShopData & { _offer?: SpecialOffer }, index: number, styles: any, colors: ColorScheme) => {
    const offer = shopWithOffer._offer as SpecialOffer;
    if (!offer) return null;
    
    return (
      <TouchableOpacity
        style={[
          styles.shopCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.borderColor,
            width: 180,
          },
        ]}
        onPress={() => onShopPress(offer.shop.id)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: offer.shop.image }}
            style={styles.shopImage}
            resizeMode="cover"
          />
          
          {/* Offer Badge */}
          <View 
            style={[
              offerStyles.offerBadge, 
              { backgroundColor: getOfferColor(offer.category) }
            ]}
          >
            <Ionicons 
              name={getOfferIcon(offer.category)} 
              size={12} 
              color="#fff" 
            />
            <Text style={offerStyles.discountText}>{offer.discount}</Text>
          </View>
        </View>
        
        <View style={styles.shopInfo}>
          <Text style={[styles.shopName, { color: colors.textColor }]} numberOfLines={1}>
            {offer.shop.name}
          </Text>
          
          <Text style={[offerStyles.offerText, { color: colors.subtextColor }]} numberOfLines={2}>
            {offer.offerText}
          </Text>
          
          <View style={offerStyles.footer}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={[styles.ratingText, { color: colors.textColor }]}>
                {offer.shop.rating.toFixed(1)}
              </Text>
            </View>
            
            <Text style={[offerStyles.validText, { color: colors.subtextColor }]}>
              Until {offer.validUntil}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [onShopPress, getOfferColor, getOfferIcon]);

  return (
    <BaseShopSection
      title="Special Offers"
      shops={shopOffers}
      onShopPress={onShopPress}
      onViewAllPress={onViewAllPress}
      renderCustomCard={renderOfferCard}
    />  );
});

// Add display name for debugging
SpecialOffers.displayName = 'SpecialOffers';

const offerStyles = StyleSheet.create({
  offerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    marginLeft: 2,
  },
  offerText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    lineHeight: 14,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validText: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
  },
});

export default SpecialOffers;
