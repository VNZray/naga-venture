// Special Offers Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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
  onOfferPress?: (offerId: string) => void;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ 
  shops, 
  onShopPress,
  onOfferPress 
}) => {
  const colorScheme = useColorScheme();
  
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';
  const cardBg = colorScheme === 'dark' ? '#334155' : '#F8FAFB';

  // Generate mock special offers from shops
  const generateOffers = (): SpecialOffer[] => {
    const offerTemplates = [
      { text: "Flash Sale - {discount} off!", category: 'flash' as const, discount: '20%' },
      { text: "Weekend Special - {discount} discount", category: 'weekend' as const, discount: '15%' },
      { text: "New Customer Offer - {discount} off first order", category: 'new' as const, discount: '25%' },
      { text: "Limited Time - {discount} discount", category: 'limited' as const, discount: '30%' },
      { text: "Happy Hour - {discount} off selected items", category: 'flash' as const, discount: '10%' },
    ];

    return shops.slice(0, 5).map((shop, index) => {
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
  };

  const offers = generateOffers();

  const getOfferColor = (category: SpecialOffer['category']) => {
    switch (category) {
      case 'flash': return '#EF4444';
      case 'weekend': return '#10B981';
      case 'new': return '#3B82F6';
      case 'limited': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getOfferIcon = (category: SpecialOffer['category']) => {
    switch (category) {
      case 'flash': return 'flash';
      case 'weekend': return 'calendar';
      case 'new': return 'star';
      case 'limited': return 'time';
      default: return 'pricetag';
    }
  };

  if (offers.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>Special Offers</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => console.log('View all offers')}
        >
          <Text style={styles.seeAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            style={[styles.offerCard, { backgroundColor: cardBg }]}
            onPress={() => onShopPress(offer.shop.id)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: offer.shop.image }}
              style={styles.shopImage}
              resizeMode="cover"
            />
            
            {/* Offer Badge */}
            <View 
              style={[
                styles.offerBadge, 
                { backgroundColor: getOfferColor(offer.category) }
              ]}
            >
              <Ionicons 
                name={getOfferIcon(offer.category)} 
                size={12} 
                color="#fff" 
              />
              <Text style={styles.discountText}>{offer.discount}</Text>
            </View>
            
            <View style={styles.offerContent}>
              <Text style={[styles.shopName, { color: textColor }]} numberOfLines={1}>
                {offer.shop.name}
              </Text>
              
              <Text style={[styles.offerText, { color: subtextColor }]} numberOfLines={2}>
                {offer.offerText}
              </Text>
              
              <View style={styles.offerFooter}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: textColor }]}>
                    {offer.shop.rating.toFixed(1)}
                  </Text>
                </View>
                
                <Text style={[styles.validText, { color: subtextColor }]}>
                  Until {offer.validUntil}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#2E5AA7',
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  offerCard: {
    width: 160,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shopImage: {
    width: '100%',
    height: 90,
  },
  offerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
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
  offerContent: {
    padding: 12,
  },
  shopName: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  offerText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    lineHeight: 14,
    marginBottom: 6,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 2,
  },
  validText: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
  },
});

export default SpecialOffers;
