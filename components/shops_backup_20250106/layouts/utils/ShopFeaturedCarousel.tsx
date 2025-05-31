// Shop-specific Featured Carousel Component
import type { FeaturedShop } from '@/types/shop';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;

interface ShopFeaturedCarouselProps {
  data: FeaturedShop[];
  onItemPress: (id: string) => void;
  height?: number;
}

/**
 * ShopFeaturedCarousel - Shop-specific carousel component
 * 
 * This component is tailored for shops and demonstrates composition by:
 * - Accepting shop data via props
 * - Handling shop item press via callback
 * - Optimized for shop-specific display (category, rating)
 */
const ShopFeaturedCarousel: React.FC<ShopFeaturedCarouselProps> = ({
  data,
  onItemPress,
  height = 200,
}) => {
  return (
    <Carousel
      loop
      width={width - 40}
      height={height}
      autoPlay={true}
      data={data}
      scrollAnimationDuration={1000}
      mode="parallax"      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.id}
          style={styles.carouselItem}
          onPress={() => onItemPress(item.id)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          
          {/* Enhanced gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
            locations={[0, 0.6, 1]}
          />
          
          {/* Featured badge */}
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
          
          <View style={styles.carouselTextContainer}>
            <Text style={styles.carouselTitle} numberOfLines={1}>
              {item.name}
            </Text>
            {item.category && (
              <Text style={styles.carouselCategory} numberOfLines={1}>
                {item.category}
              </Text>
            )}
            {item.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          
          {/* Shimmer effect for premium feel */}
          <View style={styles.shimmerEffect} />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    borderRadius: 15,
    overflow: "hidden",
    height: "100%",
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: '#FFD700',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    marginLeft: 4,
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  carouselCategory: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    opacity: 0.9,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ skewX: '-25deg' }],
  },
  // Keep the old overlay style for backward compatibility
  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
});

export default ShopFeaturedCarousel;
