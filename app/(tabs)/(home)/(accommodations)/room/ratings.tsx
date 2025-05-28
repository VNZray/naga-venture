import { accommodations, reviews as initialReviews } from '@/app/Controller/AccommodationData';
import { users } from '@/app/Controller/User';
import ReviewCard from '@/components/ReviewCard';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget'; // Make sure this package is installed

type User = {
  id: number;
  name: string;
};

interface RatingsProps {
  roomId: string;
}

const Ratings: React.FC<RatingsProps> = ({ roomId }) => {
  const { user } = useAuth();
  const rId = Number(roomId);

  const [reviews, setReviews] = useState(
    initialReviews.filter((review) => review.roomId === rId)
  );
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5); // star rating state

  const handleAddReview = () => {
    if (!user || newReview.trim() === '') return;

    const newReviewObj = {
      id: reviews.length + 1,
      userId: user.id,
      accommodationId: null,
      roomId: rId,
      rating: rating,
      date: new Date().toISOString().split('T')[0],
      message: newReview.trim(),
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview('');
    setRating(5); // Reset rating to default
  };

  return (
    <View style={{ paddingTop: 0 }}>
      {user && (
        
        <>
                  <ThemedText style={styles.label}>Leave a review:</ThemedText>
        
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={28}
            color="#FFD700"
            style={{ marginBottom: 12 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Write a review..."
            value={newReview}
            onChangeText={setNewReview}
            multiline
          />
          <Button title="Submit Review" onPress={handleAddReview} />
        </>
      )}

      {reviews.length > 0 ? (
        reviews.map((review) => {
          const userData: User | undefined = users.find((u) => u.id === review.userId);
          const reviewerName = userData?.name || 'Unknown User';

          const profileImageUri =
            review.userId === 1
              ? 'https://randomuser.me/api/portraits/women/1.jpg'
              : 'https://randomuser.me/api/portraits/men/2.jpg';

          const imageUri =
            accommodations.find((acc) => acc.id === review.roomId)?.imageUri ||
            'https://media-cdn.tripadvisor.com/media/photo-p/2e/4f/53/15/uma-hotel-residences.jpg';

          return (
            <View key={review.id} style={{ paddingTop: 16 }}>
              <ReviewCard
                reviewerName={reviewerName}
                reviewDate={review.date}
                reviewText={review.message}
                imageUri={imageUri}
                profileImageUri={profileImageUri}
                elevation={3}
                rating={review.rating}
              />
            </View>
          );
        })
      ) : (
        <ThemedText>No reviews available for this room.</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
    label: {
    marginBottom: 4,
  },
});

export default Ratings;
