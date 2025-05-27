import { accommodations, reviews } from '@/app/Controller/AccommodationData';
import { users } from '@/app/Controller/User';
import ReviewCard from '@/components/ReviewCard';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

// Define User type if not imported from elsewhere
type User = {
  id: number;
  name: string;
  // Add other fields as needed
};

interface RatingsProps {
  accommodationId: string;
}

const Ratings: React.FC<RatingsProps> = ({ accommodationId }) => {
  const filteredReviews = reviews.filter(
    (review) => review.accommodationId === Number(accommodationId)
  );

  return (
    <View style={{ padding: 16, paddingTop: 0 }}>
      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => {
            const user: User | undefined = users.find((u: User) => u.id === review.userId);

          const reviewerName = user?.name || 'Unknown User';
          const profileImageUri =
            review.userId === 1
              ? 'https://randomuser.me/api/portraits/women/1.jpg'
              : 'https://randomuser.me/api/portraits/men/2.jpg';

          const imageUri =
            accommodations.find((acc) => acc.id === review.accommodationId)?.imageUri ||
            'https://media-cdn.tripadvisor.com/media/photo-p/2e/4f/53/15/uma-hotel-residences.jpg';

          return (
            <View key={review.id} style={{ marginBottom: 16 }}>
              <ReviewCard
                reviewerName={reviewerName}
                reviewDate={review.date}
                reviewText={review.message}
                imageUri={imageUri}
                profileImageUri={profileImageUri}
                elevation={3}
              />
            </View>
          );
        })
      ) : (
        <ThemedText>No reviews available for this accommodation.</ThemedText>
      )}
    </View>
  );
};

export default Ratings;
