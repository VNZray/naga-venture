// Personalized Recommendations Component
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ShopData } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PersonalizedRecommendationsProps {
  shops: ShopData[];
  onShopPress: (shopId: string) => void;
  userPreferences?: {
    favoriteCategories?: string[];
    visitedShops?: string[];
    searchHistory?: string[];
  };
  limit?: number;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ 
  shops, 
  onShopPress,
  userPreferences = {},
  limit = 6
}) => {  const colorScheme = useColorScheme();
  
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#1A1A1A';
  const subtextColor = colorScheme === 'dark' ? '#94A3B8' : '#6B7280';
  const cardBackground = colorScheme === 'dark' ? '#334155' : '#F8FAFB';
  const borderColor = colorScheme === 'dark' ? '#475569' : '#E5E7EB';

  // Generate personalized recommendations based on user preferences
  const recommendations = useMemo(() => {
    const { favoriteCategories = [], visitedShops = [], searchHistory = [] } = userPreferences;
    
    // Score shops based on various factors
    const scoredShops = shops.map(shop => {
      let score = shop.rating || 0;
      
      // Boost score for favorite categories
      if (favoriteCategories.includes(shop.category)) {
        score += 2;
      }
      
      // Boost score for similar shops to visited ones
      const visitedCategories = shops
        .filter(s => visitedShops.includes(s.id))
        .map(s => s.category);
      if (visitedCategories.includes(shop.category)) {
        score += 1.5;
      }
      
      // Boost score for shops matching search history
      const searchTerms = searchHistory.join(' ').toLowerCase();
      if (searchTerms.includes(shop.name.toLowerCase()) || 
          searchTerms.includes(shop.category.toLowerCase()) ||
          searchTerms.includes(shop.description?.toLowerCase() || '')) {
        score += 1;
      }
      
      // Boost score for highly rated shops
      if (shop.rating >= 4.5) {
        score += 0.5;
      }
      
      // Reduce score for already visited shops
      if (visitedShops.includes(shop.id)) {
        score -= 1;
      }
      
      return { ...shop, recommendationScore: score };
    });
    
    // Sort by score and return top recommendations
    return scoredShops
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }, [shops, userPreferences, limit]);

  // Get recommendation reasons
  const getRecommendationReason = (shop: ShopData) => {
    const { favoriteCategories = [], visitedShops = [] } = userPreferences;
    
    if (favoriteCategories.includes(shop.category)) {
      return `Based on your interest in ${shop.category}`;
    }
    
    const visitedCategories = shops
      .filter(s => visitedShops.includes(s.id))
      .map(s => s.category);
    if (visitedCategories.includes(shop.category)) {
      return `Similar to places you've visited`;
    }
    
    if (shop.rating >= 4.5) {
      return `Highly rated (${shop.rating}⭐)`;
    }
    
    return `Recommended for you`;
  };

  if (recommendations.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          Recommended for You
        </Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: '#2E5AA7' }]}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#2E5AA7" />
        </TouchableOpacity>
      </View>      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {recommendations.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={[styles.shopCard, { backgroundColor: cardBackground, borderColor }]}
            onPress={() => onShopPress(shop.id)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: shop.image }} style={styles.shopImage} />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{shop.rating}</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={[styles.shopName, { color: textColor }]} numberOfLines={1}>
                {shop.name}
              </Text>
              
              <Text style={[styles.shopCategory, { color: subtextColor }]} numberOfLines={1}>
                {shop.category}
              </Text>
              
              <View style={styles.reasonContainer}>
                <Ionicons name="bulb" size={12} color="#2E5AA7" />
                <Text style={[styles.reasonText, { color: '#2E5AA7' }]} numberOfLines={1}>
                  {getRecommendationReason(shop)}
                </Text>
              </View>
              
              {shop.priceRange && (
                <Text style={[styles.priceRange, { color: subtextColor }]}>
                  {shop.priceRange}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({  container: {
    marginBottom: 32, // Increased from 24 to provide space for drop shadow
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginRight: 4,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8, // Added bottom padding for drop shadow
    gap: 12,
  },
  shopCard: {
    width: 180,    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 90,
  },
  shopImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  cardContent: {
    padding: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    marginLeft: 4,
    flex: 1,
  },
  priceRange: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
  },
});

export default PersonalizedRecommendations;
