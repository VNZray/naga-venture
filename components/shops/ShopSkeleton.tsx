// Shop Skeleton Loading Component
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

interface ShopSkeletonProps {
  type?: 'list' | 'card' | 'horizontal';
  count?: number;
}

const ShopSkeleton: React.FC<ShopSkeletonProps> = ({ 
  type = 'list', 
  count = 3 
}) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#374151' : '#F3F4F6';
  const shimmerColor = colorScheme === 'dark' ? '#4B5563' : '#E5E7EB';

  const ShimmerEffect: React.FC<{ style: any }> = ({ style }) => {
    const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }, [shimmerAnimation]);

    const animatedStyle = {
      opacity: shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
      }),
    };

    return <Animated.View style={[style, { backgroundColor }, animatedStyle]} />;
  };

  const renderListSkeleton = () => (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <ShimmerEffect style={styles.listImage} />
          <View style={styles.listContent}>
            <ShimmerEffect style={styles.listTitle} />
            <ShimmerEffect style={styles.listSubtitle} />
            <View style={styles.listFooter}>
              <ShimmerEffect style={styles.listRating} />
              <ShimmerEffect style={styles.listPrice} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderCardSkeleton = () => (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.cardItem}>
          <ShimmerEffect style={styles.cardImage} />
          <View style={styles.cardContent}>
            <ShimmerEffect style={styles.cardTitle} />
            <ShimmerEffect style={styles.cardSubtitle} />
            <ShimmerEffect style={styles.cardRating} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderHorizontalSkeleton = () => (
    <View style={styles.horizontalContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.horizontalItem}>
          <ShimmerEffect style={styles.horizontalImage} />
          <View style={styles.horizontalContent}>
            <ShimmerEffect style={styles.horizontalTitle} />
            <ShimmerEffect style={styles.horizontalSubtitle} />
          </View>
        </View>
      ))}
    </View>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'horizontal':
      return renderHorizontalSkeleton();
    default:
      return renderListSkeleton();
  }
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listTitle: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  listSubtitle: {
    height: 16,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listRating: {
    height: 16,
    width: 60,
    borderRadius: 4,
  },
  listPrice: {
    height: 16,
    width: 80,
    borderRadius: 4,
  },
  cardItem: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardSubtitle: {
    height: 14,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  cardRating: {
    height: 14,
    width: 50,
    borderRadius: 4,
  },
  horizontalItem: {
    width: 130,
    borderRadius: 12,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: '100%',
    height: 85,
  },
  horizontalContent: {
    padding: 8,
  },
  horizontalTitle: {
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  horizontalSubtitle: {
    height: 12,
    width: '80%',
    borderRadius: 4,
  },
});

export default ShopSkeleton;
