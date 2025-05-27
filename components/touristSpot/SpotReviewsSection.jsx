import { reviewsData } from "@/app/(tabs)/(home)/(touristSpots)/reviewsData";
import ReviewCard from "@/components/ReviewCard";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function SpotReviewsSection({ spotId, rating, ratingCount, renderStars, iconColor }) {
  // Get reviews for this spot
  const spotReviews = reviewsData.filter(review => review.spotId === spotId);

  // Calculate rating distribution
  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  spotReviews.forEach(review => {
    ratingDistribution[review.rating]++;
  });

  const renderRatingBars = () => {
    const maxCount = Math.max(...Object.values(ratingDistribution));
    
    return (
      <View style={styles.ratingBarsContainer}>
        {[5, 4, 3, 2, 1].map((star) => (
          <View key={star} style={styles.ratingBarRow}>
            <View style={styles.ratingLabelContainer}>
              <ThemedText style={styles.ratingLabel}>{star}</ThemedText>
              <ThemedText style={styles.starIcon}>★</ThemedText>
            </View>
            <View style={styles.ratingBarBackground}>
              <View 
                style={[
                  styles.ratingBarFill,
                  { 
                    width: `${(ratingDistribution[star] / maxCount) * 100}%`,
                    backgroundColor: '#0A1B47'
                  }
                ]} 
              />
            </View>
            <ThemedText style={styles.ratingCount}>{ratingDistribution[star]}</ThemedText>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.reviewsTab}>
      <View style={styles.ratingSummary}>
        <View style={styles.overallRating}>
          <ThemedText type="title" style={styles.overallRatingValue}>
            {rating ? rating.toFixed(1) : "No"}
          </ThemedText>
          <View>{renderStars(rating)}</View>
          <ThemedText type="default2" style={styles.ratingCount}>
            {ratingCount} reviews
          </ThemedText>
        </View>
        <View style={styles.ratingBreakdown}>{renderRatingBars()}</View>
      </View>
      {spotReviews.length > 0 ? (
        <View style={styles.reviewsList}>
          {spotReviews.map((review) => (
            <ReviewCard
              key={review.id}
              reviewerName={review.reviewerName}
              reviewText={review.reviewText}
              reviewDate={review.reviewDate}
              profileImageUri={review.profileImageUri}
              style={styles.reviewCard}
            />
          ))}
        </View>
      ) : (
        <ThemedText type="default2" style={{ color: iconColor }}>No reviews yet.</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsTab: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  ratingSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  overallRating: {
    alignItems: "center",
    minWidth: 100,
  },
  overallRatingValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  ratingBreakdown: {
    flex: 1,
    marginLeft: 16,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    marginBottom: 12,
  },
  ratingBarsContainer: {
    gap: 1,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 24,
    justifyContent: 'flex-end',
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  starIcon: {
    fontSize: 10,
    color: '#FFD700',
    marginLeft: 2,
  },
  ratingBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 3,
  },
}); 