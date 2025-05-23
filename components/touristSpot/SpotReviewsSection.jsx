import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function SpotReviewsSection({ rating, ratingCount, reviews, renderStars, renderRatingBars, iconColor }) {
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
      {reviews && reviews.length > 0 ? (
        <View>
          <ThemedText type="default2">Reviews will be listed here</ThemedText>
        </View>
      ) : (
        <ThemedText type="default2" style={{ color: iconColor }}>No reviews yet.</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsTab: {
    paddingBottom: 20,
  },
  ratingSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  overallRating: {
    alignItems: "center",
  },
  overallRatingValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  ratingCount: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  ratingBreakdown: {
    flex: 1,
    marginLeft: 20,
  },
}); 