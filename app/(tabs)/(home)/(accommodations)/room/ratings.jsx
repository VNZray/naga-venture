import { reviews } from '@/app/Controller/ReviewData';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const Ratings = ({ roomId }) => {
  const roomReviews = reviews[`room_${roomId}`];

  if (!roomReviews) {
    return (
      <View style={styles.detailsContainer}>
        <ThemedText>No reviews yet</ThemedText>
      </View>
    );
  }

  const renderRatingBar = (rating, percentage) => (
    <View style={styles.ratingBarContainer}>
      <ThemedText style={styles.ratingNumber}>{rating}</ThemedText>
      <View style={styles.ratingBarWrapper}>
        <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
      </View>
      <ThemedText style={styles.ratingPercentage}>{percentage}%</ThemedText>
    </View>
  );

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.reviewsSummary}>
        <View style={styles.overallRating}>
          <ThemedText style={styles.averageRating}>{roomReviews.averageRating}</ThemedText>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome5 
                key={star}
                name="star"
                size={16}
                color="#FFD700"
                solid
              />
            ))}
          </View>
          <ThemedText style={styles.totalReviews}>
            {roomReviews.totalReviews} reviews
          </ThemedText>
        </View>
        <View style={styles.ratingDistribution}>
          {Object.entries(roomReviews.ratingDistribution)
            .reverse()
            .map(([rating, percentage]) => (
              renderRatingBar(rating, percentage)
            ))}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable style={styles.filterButton}>
            <ThemedText>All</ThemedText>
          </Pressable>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Pressable key={rating} style={styles.filterButton}>
              <ThemedText>{rating}</ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.reviewsList}>
        {roomReviews.reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image 
                source={{ uri: review.profilePic }}
                style={styles.profilePic}
              />
              <View style={styles.reviewHeaderText}>
                <ThemedText style={styles.reviewUsername}>{review.username}</ThemedText>
                <ThemedText style={styles.reviewDate}>{review.date}</ThemedText>
              </View>
              <View style={styles.reviewRating}>
                {[...Array(review.rating)].map((_, i) => (
                  <FontAwesome5 
                    key={i}
                    name="star"
                    size={12}
                    color="#FFD700"
                    solid
                  />
                ))}
              </View>
            </View>
            <ThemedText style={styles.reviewComment}>{review.comment}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 16,
  },
  reviewsSummary: {
    marginBottom: 24,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 16,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    opacity: 0.7,
  },
  ratingDistribution: {
    gap: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    width: 20,
  },
  ratingBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#0A2342',
    borderRadius: 4,
  },
  ratingPercentage: {
    width: 40,
    textAlign: 'right',
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  reviewsList: {
    gap: 24,
  },
  reviewItem: {
    gap: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewUsername: {
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Ratings;