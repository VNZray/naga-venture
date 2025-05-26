// Shop-specific Featured Carousel Component
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
  data: {
    id: number;
    name: string;
    image: string;
    category?: string;
    rating?: number;
    [key: string]: any;
  }[];
  onItemPress: (id: number) => void;
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
export const ShopFeaturedCarousel: React.FC<ShopFeaturedCarouselProps> = ({
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
      mode="parallax"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.id}
          style={styles.carouselItem}
          onPress={() => onItemPress(item.id)}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          <View style={styles.carouselOverlay} />
          <View style={styles.carouselTextContainer}>
            <Text style={styles.carouselTitle}>{item.name}</Text>
            {item.category && (
              <Text style={styles.carouselCategory}>{item.category}</Text>
            )}
          </View>
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
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  carouselCategory: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    opacity: 0.9,
  },
});

export default ShopFeaturedCarousel;
