// Shop Skeleton Loading Component - Performance Optimized
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface ShopSkeletonProps {
  count?: number;
  variant?: 'card' | 'list' | 'featured';
}

const ShopSkeleton: React.FC<ShopSkeletonProps> = ({ 
  count = 3, 
  variant = 'card' 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletonColor = isDark ? '#2a2a2a' : '#e0e0e0';

  const renderCardSkeleton = (index: number) => (
    <View key={index} style={[styles.cardContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <Animated.View 
        style={[
          styles.cardImage, 
          { backgroundColor: skeletonColor, opacity }
        ]} 
      />
      <View style={styles.cardContent}>
        <Animated.View 
          style={[
            styles.cardTitle, 
            { backgroundColor: skeletonColor, opacity }
          ]} 
        />
        <Animated.View 
          style={[
            styles.cardSubtitle, 
            { backgroundColor: skeletonColor, opacity }
          ]} 
        />
        <View style={styles.cardFooter}>
          <Animated.View 
            style={[
              styles.cardRating, 
              { backgroundColor: skeletonColor, opacity }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cardPrice, 
              { backgroundColor: skeletonColor, opacity }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => renderCardSkeleton(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  cardContainer: {
    width: 180,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 90,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardSubtitle: {
    height: 12,
    borderRadius: 4,
    marginBottom: 12,
    width: '80%',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRating: {
    height: 12,
    width: 40,
    borderRadius: 4,
  },
  cardPrice: {
    height: 12,
    width: 30,
    borderRadius: 4,
  },
});

export default ShopSkeleton;
