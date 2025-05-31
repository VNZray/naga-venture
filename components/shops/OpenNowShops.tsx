// Open Now Shops Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OpenNowShopsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  limit?: number;
}

const OpenNowShops: React.FC<OpenNowShopsProps> = ({ 
  shops, 
  onShopPress,
  limit = 6
}) => {
  const colorScheme = useColorScheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const backgroundColor = colorScheme === 'dark' ? '#1E293B' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';
  const cardBg = colorScheme === 'dark' ? '#334155' : '#F8FAFB';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const parseOpeningHours = (openingHours: string): { open: number; close: number } | null => {
    // Handle 24 hours case
    if (openingHours.toLowerCase().includes('24 hours') || openingHours.toLowerCase().includes('24/7')) {
      return { open: 0, close: 24 };
    }

    // Parse time format like "8:00 AM - 6:00 PM"
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const match = openingHours.match(timeRegex);
    
    if (!match) return null;

    const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = match;
    
    const convertTo24Hour = (hour: string, minute: string, period: string): number => {
      let h = parseInt(hour);
      const m = parseInt(minute);
      
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (period.toUpperCase() === 'AM' && h === 12) h = 0;
      
      return h + (m / 60);
    };

    return {
      open: convertTo24Hour(openHour, openMin, openPeriod),
      close: convertTo24Hour(closeHour, closeMin, closePeriod),
    };
  };

  const isShopOpen = (shop: ShopData): boolean => {
    const hours = parseOpeningHours(shop.openingHours);
    if (!hours) return false; // Default to closed if we can't parse

    const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
    
    // Handle shops that close past midnight
    if (hours.close < hours.open) {
      return currentHour >= hours.open || currentHour < hours.close;
    }
    
    return currentHour >= hours.open && currentHour < hours.close;
  };

  const getClosingTime = (shop: ShopData): string => {
    const hours = parseOpeningHours(shop.openingHours);
    if (!hours) return '';

    if (hours.close === 24 || hours.close === 0) return '24 Hours';
    
    const closeHour = Math.floor(hours.close);
    const closeMin = Math.round((hours.close - closeHour) * 60);
    const period = closeHour >= 12 ? 'PM' : 'AM';
    const displayHour = closeHour > 12 ? closeHour - 12 : closeHour === 0 ? 12 : closeHour;
    
    return `Closes ${displayHour}:${closeMin.toString().padStart(2, '0')} ${period}`;
  };

  const openShops = shops
    .filter(isShopOpen)
    .slice(0, limit);

  if (openShops.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Ionicons name="time" size={18} color="#10B981" />
            <Text style={[styles.title, { color: textColor }]}>Open Now</Text>
          </View>
        </View>
        <View style={[styles.emptyContainer, { backgroundColor: cardBg }]}>
          <Ionicons name="moon" size={32} color={subtextColor} />
          <Text style={[styles.emptyText, { color: subtextColor }]}>
            Most shops are closed right now
          </Text>
          <Text style={[styles.emptySubtext, { color: subtextColor }]}>
            Come back during business hours
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Ionicons name="time" size={18} color="#10B981" />
          <Text style={[styles.title, { color: textColor }]}>Open Now</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            ({openShops.length} shops open)
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => setCurrentTime(new Date())}
        >
          <Ionicons name="refresh" size={16} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {openShops.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={[styles.shopCard, { backgroundColor: cardBg }]}
            onPress={() => onShopPress(shop.id)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: shop.image }}
              style={styles.shopImage}
              resizeMode="cover"
            />
            
            {/* Open Badge */}
            <View style={styles.openBadge}>
              <View style={styles.openDot} />
              <Text style={styles.openText}>OPEN</Text>
            </View>
            
            <View style={styles.shopInfo}>
              <Text style={[styles.shopName, { color: textColor }]} numberOfLines={1}>
                {shop.name}
              </Text>
              <Text style={[styles.shopCategory, { color: subtextColor }]} numberOfLines={1}>
                {shop.category}
              </Text>
              
              <View style={styles.shopFooter}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: textColor }]}>
                    {shop.rating.toFixed(1)}
                  </Text>
                </View>
                
                <Text style={[styles.closingTime, { color: subtextColor }]} numberOfLines={1}>
                  {getClosingTime(shop)}
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
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginLeft: 4,
  },
  refreshButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },  shopCard: {
    width: 180,
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
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 85,
  },
  openBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  openText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
  },
  shopInfo: {
    padding: 10,
  },
  shopName: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 3,
  },
  shopCategory: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  shopFooter: {
    flexDirection: 'column',
    gap: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 2,
  },
  closingTime: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
  },
});

export default OpenNowShops;
