import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface SkeletonCardProps {
  width?: number;
  height?: number;
  style?: any;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = 280,
  height = 180,
  style,
}) => {
  return (
    <SkeletonPlaceholder
      borderRadius={16}
      backgroundColor="#E0E0E0"
      highlightColor="#F5F5F5"
    >
      <View style={[styles.card, { width, height }, style]} />
    </SkeletonPlaceholder>
  );
};

export const SkeletonCardList: React.FC<{
  count?: number;
  horizontal?: boolean;
}> = ({ count = 3, horizontal = false }) => {
  return (
    <SkeletonPlaceholder
      borderRadius={16}
      backgroundColor="#E0E0E0"
      highlightColor="#F5F5F5"
    >
      <View
        style={
          horizontal ? styles.horizontalContainer : styles.verticalContainer
        }
      >
        {Array.from({ length: count }).map((_, index) => (
          <View key={index} style={styles.listCard} />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export const SkeletonCarousel: React.FC = () => {
  return (
    <View style={styles.carouselContainer}>
      <SkeletonPlaceholder
        borderRadius={4}
        backgroundColor="#E0E0E0"
        highlightColor="#F5F5F5"
      >
        {/* Title skeleton */}
        <View style={styles.titleSkeleton} />
      </SkeletonPlaceholder>

      <SkeletonPlaceholder
        borderRadius={16}
        backgroundColor="#E0E0E0"
        highlightColor="#F5F5F5"
      >
        <View style={styles.carouselContent}>
          <View style={styles.featuredCard} />
          <View style={styles.featuredCard} />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
  },
  horizontalContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  verticalContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },
  listCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
  },
  carouselContainer: {
    paddingVertical: 16,
  },
  titleSkeleton: {
    width: 150,
    height: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  carouselContent: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
  },
});
